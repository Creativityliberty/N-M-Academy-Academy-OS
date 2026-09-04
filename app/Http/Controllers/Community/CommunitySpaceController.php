<?php

declare(strict_types=1);

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\CommunitySpace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CommunitySpaceController extends Controller
{
    private const MODERATOR_ROLES = ['trainer', 'admin', 'super-admin'];

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->hasAnyRole(self::MODERATOR_ROLES), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80', Rule::unique('community_spaces', 'name')],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $slug = Str::slug($validated['name']);
        abort_if($slug === '', 422, 'Le nom doit produire un identifiant valide.');

        $baseSlug = $slug;
        $suffix = 2;
        while (CommunitySpace::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        CommunitySpace::create([
            'name' => trim($validated['name']),
            'slug' => $slug,
            'description' => isset($validated['description']) ? trim($validated['description']) : null,
            'position' => ((int) CommunitySpace::query()->max('position')) + 10,
            'is_active' => true,
        ]);

        return back()->with('success', 'Espace communautaire créé.');
    }
}
