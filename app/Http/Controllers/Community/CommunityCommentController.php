<?php

declare(strict_types=1);

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommunityCommentController extends Controller
{
    public function store(Request $request, CommunityPost $post): RedirectResponse
    {
        abort_if($post->is_locked || $post->is_hidden, 403);

        $validated = $request->validate([
            'body' => ['required', 'string', 'min:1', 'max:6000'],
        ]);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'body' => trim($validated['body']),
        ]);

        return back()->with('success', 'Réponse ajoutée.');
    }
}
