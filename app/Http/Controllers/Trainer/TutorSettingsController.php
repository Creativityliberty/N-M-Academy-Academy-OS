<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\AI\AiProviderManager;
use App\Http\Controllers\Controller;
use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyKnowledgeChunk;
use App\Models\AcademyKnowledgeDocument;
use App\Models\AcademyTutorSetting;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TutorSettingsController extends Controller
{
    public function index(Request $request, AiProviderManager $providers): Response
    {
        $trainer = $request->user();
        $settings = AcademyTutorSetting::forTrainer((int) $trainer->id);
        $providerName = $settings->provider === 'inherit' ? null : $settings->provider;
        $selectedProvider = $providers->providerFor($providerName, $settings->model ?: null);

        $courses = $trainer->courses()
            ->orderBy('title')
            ->get(['id', 'title', 'status'])
            ->map(function (Course $course): array {
                $documents = AcademyKnowledgeDocument::where('course_id', $course->id);

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'status' => $course->status->value,
                    'documents' => (clone $documents)->count(),
                    'indexed' => (clone $documents)->where('index_status', 'indexed')->count(),
                    'chunks' => AcademyKnowledgeChunk::where('course_id', $course->id)->count(),
                    'lastIndexedAt' => (clone $documents)->max('indexed_at'),
                ];
            })
            ->values();

        return Inertia::render('trainer/tutor-settings/index', [
            'settings' => [
                'enabled' => $settings->enabled,
                'provider' => $settings->provider,
                'model' => $settings->model,
                'premiumModel' => $settings->premium_model,
                'personality' => $settings->personality,
                'outsideContentPolicy' => $settings->outside_content_policy,
                'dailyLimit' => $settings->daily_limit,
                'monthlyBudgetCents' => $settings->monthly_budget_cents,
                'allowedCourseIds' => $settings->allowed_course_ids ?? [],
                'geminiApiKey' => env('GEMINI_API_KEY') ? (substr((string) env('GEMINI_API_KEY'), 0, 8) . '…') : '',
            ],
            'provider' => [
                'configured' => $selectedProvider->name() !== 'disabled',
                'provider' => $selectedProvider->name(),
                'model' => $selectedProvider->model(),
            ],
            'embedding' => [
                'provider' => config('academy-tutor.embedding.provider'),
                'model' => config('academy-tutor.embedding.model'),
            ],
            'courses' => $courses,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'provider' => ['required', 'in:inherit,openai,deepseek'],
            'model' => ['nullable', 'string', 'max:120'],
            'premium_model' => ['nullable', 'string', 'max:120'],
            'personality' => ['required', 'in:helpful,concise,coach'],
            'outside_content_policy' => ['required', 'in:never,ask,allowed'],
            'daily_limit' => ['required', 'integer', 'min:0', 'max:1000'],
            'monthly_budget_cents' => ['required', 'integer', 'min:0', 'max:10000000'],
            'gemini_api_key' => ['nullable', 'string', 'max:255'],
            'allowed_course_ids' => ['array'],
            'allowed_course_ids.*' => ['integer'],
        ]);

        if (array_key_exists('gemini_api_key', $data) && filled($data['gemini_api_key']) && ! str_contains($data['gemini_api_key'], '…')) {
            $envPath = base_path('.env');
            if (file_exists($envPath)) {
                $envContent = file_get_contents($envPath);
                if (str_contains($envContent, 'GEMINI_API_KEY=')) {
                    $envContent = preg_replace('/GEMINI_API_KEY=.*/', 'GEMINI_API_KEY=' . trim($data['gemini_api_key']), $envContent);
                } else {
                    $envContent .= "\nGEMINI_API_KEY=" . trim($data['gemini_api_key']);
                }
                file_put_contents($envPath, $envContent);
            }
        }

        $owned = $request->user()->courses()
            ->pluck('id')
            ->map(fn ($value) => (int) $value)
            ->all();
        $allowed = array_values(array_intersect(
            array_map('intval', $data['allowed_course_ids'] ?? []),
            $owned,
        ));

        AcademyTutorSetting::forTrainer((int) $request->user()->id)->update([
            'enabled' => $data['enabled'],
            'provider' => $data['provider'],
            'model' => $data['model'] ?: null,
            'premium_model' => ($data['premium_model'] ?? null) ?: null,
            'personality' => $data['personality'],
            'outside_content_policy' => $data['outside_content_policy'],
            'daily_limit' => $data['daily_limit'],
            'monthly_budget_cents' => $data['monthly_budget_cents'],
            'allowed_course_ids' => $allowed,
        ]);

        return back()->with('success', 'Réglages AI Tutor enregistrés.');
    }

    public function reindex(Request $request, Course $course): RedirectResponse
    {
        abort_unless($course->trainer_id === $request->user()->id, 403);

        IndexCourseKnowledge::dispatch($course->id);

        return back()->with('success', 'Réindexation ajoutée à la file.');
    }
}
