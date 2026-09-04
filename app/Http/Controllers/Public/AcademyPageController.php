<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AcademyPage;
use App\PageBuilder\PageSectionResolver;
use Inertia\Inertia;
use Inertia\Response;

class AcademyPageController extends Controller
{
    public function show(string $slug, PageSectionResolver $resolver): Response
    {
        $page = AcademyPage::query()->where('slug', $slug)->where('status', 'published')->whereNotNull('published_at')->with('sections')->firstOrFail();
        return Inertia::render('home/pages/show', [
            'page' => ['title' => $page->title, 'slug' => $page->slug, 'metaTitle' => $page->meta_title, 'metaDescription' => $page->meta_description],
            'sections' => $resolver->resolvePage($page),
            'preview' => false,
        ]);
    }
}
