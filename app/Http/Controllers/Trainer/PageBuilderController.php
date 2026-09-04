<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\AcademyPage;
use App\Models\AcademyPageSection;
use App\Models\CourseOffer;
use App\PageBuilder\PageBlockRegistry;
use App\PageBuilder\PageSectionResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PageBuilderController extends Controller
{
    public function index(Request $request): Response
    {
        $trainer = $request->user();
        $pages = AcademyPage::query()->where('trainer_id', $trainer->id)->withCount('sections')->latest()->get()->map(fn (AcademyPage $page) => [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'status' => $page->status,
            'pageType' => $page->page_type,
            'sectionsCount' => $page->sections_count,
            'publishedAt' => $page->published_at?->toIso8601String(),
            'publicUrl' => route('academy-pages.show', $page->slug),
        ]);

        return Inertia::render('trainer/pages/index', ['pages' => $pages]);
    }

    public function store(Request $request, PageBlockRegistry $registry): RedirectResponse
    {
        $trainer = $request->user();
        $validated = $request->validate([
            'title' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:160','regex:/^[a-z0-9-]+$/'],
            'page_type' => ['nullable', Rule::in(['landing','sales','about','course'])],
            'course_id' => ['nullable','integer'],
        ]);

        $slug = $validated['slug'] ?: Str::slug($validated['title']);
        $slug = $this->uniqueSlug((int) $trainer->id, $slug ?: 'page');
        $courseId = (int) ($validated['course_id'] ?? 0);

        $page = DB::transaction(function () use ($trainer, $validated, $slug, $courseId, $registry): AcademyPage {
            $page = AcademyPage::create([
                'trainer_id' => $trainer->id,
                'title' => $validated['title'],
                'slug' => $slug,
                'page_type' => $validated['page_type'] ?? 'landing',
                'status' => 'draft',
            ]);

            $seed = [
                ['type' => 'hero', 'settings' => ['headline' => $validated['title'], 'subheadline' => 'Une expérience claire, propriétaire et pensée pour votre audience.', 'course_id' => $courseId ?: null]],
                ['type' => 'course', 'settings' => ['title' => 'La formation', 'course_id' => $courseId ?: null]],
                ['type' => 'pricing', 'settings' => ['title' => 'Choisissez votre accès', 'course_id' => $courseId ?: null]],
                ['type' => 'cta', 'settings' => ['title' => 'Prêt à commencer ?', 'button_label' => 'Découvrir les offres', 'button_url' => '#pricing']],
                ['type' => 'footer', 'settings' => ['tagline' => 'Votre académie, votre marque.']],
            ];

            foreach ($seed as $order => $block) {
                $page->sections()->create([
                    'type' => $block['type'],
                    'variant' => $registry->defaultVariant($block['type']),
                    'sort_order' => $order,
                    'settings' => $registry->sanitizeSettings($block['type'], array_filter($block['settings'], fn ($v) => $v !== null)),
                ]);
            }

            return $page;
        });

        return redirect()->route('trainer.pages.edit', $page)->with('success', 'Page créée en brouillon.');
    }

    public function edit(Request $request, AcademyPage $page, PageBlockRegistry $registry, PageSectionResolver $resolver): Response
    {
        $this->authorizePage($request, $page);
        $page->load('sections');
        $trainer = $request->user();
        $courses = $trainer->courses()->with(['offers' => fn ($q) => $q->where('is_active', true)])->orderBy('title')->get()->map(fn ($course) => [
            'id' => $course->id,
            'title' => $course->title,
            'image' => $course->image,
            'thumbnail' => $course->thumbnail,
            'offers' => $course->offers->map(fn (CourseOffer $offer) => [
                'id' => $offer->id, 'name' => $offer->name, 'billing_type' => $offer->billing_type, 'amount' => $offer->amount, 'currency' => $offer->currency,
            ])->values(),
        ])->values();

        return Inertia::render('trainer/pages/edit', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'pageType' => $page->page_type,
                'status' => $page->status,
                'metaTitle' => $page->meta_title,
                'metaDescription' => $page->meta_description,
                'publicUrl' => route('academy-pages.show', $page->slug),
                'previewUrl' => route('trainer.pages.preview', $page),
            ],
            'sections' => $page->sections->map(fn (AcademyPageSection $section) => $resolver->resolve($page, $section))->values(),
            'blocks' => $registry->metadata(),
            'courses' => $courses,
        ]);
    }

    public function update(Request $request, AcademyPage $page): RedirectResponse
    {
        $this->authorizePage($request, $page);
        $validated = $request->validate([
            'title' => ['required','string','max:255'],
            'slug' => ['required','string','max:160','regex:/^[a-z0-9-]+$/', Rule::unique('academy_pages','slug')->ignore($page->id)],
            'page_type' => ['required', Rule::in(['landing','sales','about','course'])],
            'meta_title' => ['nullable','string','max:255'],
            'meta_description' => ['nullable','string','max:1000'],
        ]);
        $page->update($validated);
        return back()->with('success', 'Page mise à jour.');
    }

    public function publish(Request $request, AcademyPage $page): RedirectResponse
    {
        $this->authorizePage($request, $page);
        if ($page->sections()->where('is_visible', true)->count() === 0) {
            return back()->with('error', 'Ajoutez au moins une section visible avant publication.');
        }
        $page->update(['status' => 'published', 'published_at' => now()]);
        return back()->with('success', 'Page publiée.');
    }

    public function unpublish(Request $request, AcademyPage $page): RedirectResponse
    {
        $this->authorizePage($request, $page);
        $page->update(['status' => 'draft', 'published_at' => null]);
        return back()->with('success', 'Page repassée en brouillon.');
    }

    public function destroy(Request $request, AcademyPage $page): RedirectResponse
    {
        $this->authorizePage($request, $page);
        $page->delete();
        return redirect()->route('trainer.pages.index')->with('success', 'Page supprimée.');
    }

    public function storeSection(Request $request, AcademyPage $page, PageBlockRegistry $registry): RedirectResponse
    {
        $this->authorizePage($request, $page);
        $validated = $request->validate(['type' => ['required','string'], 'variant' => ['nullable','string'], 'settings' => ['nullable','array']]);
        $variant = $validated['variant'] ?: $registry->defaultVariant($validated['type']);
        $registry->assertAllowed($validated['type'], $variant);
        $page->sections()->create([
            'type' => $validated['type'],
            'variant' => $variant,
            'sort_order' => ((int) $page->sections()->max('sort_order')) + 1,
            'settings' => $registry->sanitizeSettings($validated['type'], (array) ($validated['settings'] ?? [])),
        ]);
        return back()->with('success', 'Bloc ajouté.');
    }

    public function updateSection(Request $request, AcademyPage $page, AcademyPageSection $section, PageBlockRegistry $registry): RedirectResponse
    {
        $this->authorizeSection($request, $page, $section);
        $validated = $request->validate(['variant' => ['required','string'], 'settings' => ['nullable','array'], 'is_visible' => ['nullable','boolean']]);
        $registry->assertAllowed($section->type, $validated['variant']);
        $section->update([
            'variant' => $validated['variant'],
            'settings' => $registry->sanitizeSettings($section->type, (array) ($validated['settings'] ?? [])),
            'is_visible' => $validated['is_visible'] ?? $section->is_visible,
        ]);
        return back()->with('success', 'Bloc mis à jour.');
    }

    public function destroySection(Request $request, AcademyPage $page, AcademyPageSection $section): RedirectResponse
    {
        $this->authorizeSection($request, $page, $section);
        $section->delete();
        return back()->with('success', 'Bloc supprimé.');
    }

    public function reorderSections(Request $request, AcademyPage $page): RedirectResponse
    {
        $this->authorizePage($request, $page);
        $ids = collect($request->validate(['section_ids' => ['required','array'], 'section_ids.*' => ['integer']])['section_ids'])->map(fn ($id) => (int) $id)->values();
        $owned = $page->sections()->whereIn('id', $ids)->pluck('id')->sort()->values();
        if ($owned->all() !== $ids->sort()->values()->all() || $owned->count() !== $page->sections()->count()) {
            abort(422, 'La liste de sections est incomplète ou non autorisée.');
        }
        DB::transaction(function () use ($ids): void {
            foreach ($ids as $order => $id) {
                AcademyPageSection::whereKey($id)->update(['sort_order' => $order]);
            }
        });
        return back()->with('success', 'Ordre des blocs mis à jour.');
    }

    public function preview(Request $request, AcademyPage $page, PageSectionResolver $resolver): Response
    {
        $this->authorizePage($request, $page);
        $page->load('sections');
        return Inertia::render('home/pages/show', $this->pagePayload($page, $resolver, true));
    }

    private function pagePayload(AcademyPage $page, PageSectionResolver $resolver, bool $preview): array
    {
        return ['page' => ['title' => $page->title, 'slug' => $page->slug, 'metaTitle' => $page->meta_title, 'metaDescription' => $page->meta_description], 'sections' => $resolver->resolvePage($page), 'preview' => $preview];
    }

    private function authorizePage(Request $request, AcademyPage $page): void
    {
        abort_unless((int) $page->trainer_id === (int) $request->user()->id, 403);
    }

    private function authorizeSection(Request $request, AcademyPage $page, AcademyPageSection $section): void
    {
        $this->authorizePage($request, $page);
        abort_unless((int) $section->academy_page_id === (int) $page->id, 404);
    }

    private function uniqueSlug(int $trainerId, string $base): string
    {
        $slug = mb_substr($base, 0, 150); $candidate = $slug; $i = 2;
        while (AcademyPage::where('slug', $candidate)->exists()) { $candidate = $slug.'-'.$i++; }
        return $candidate;
    }
}
