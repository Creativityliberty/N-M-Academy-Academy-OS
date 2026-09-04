<?php

declare(strict_types=1);

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommunityModerationController extends Controller
{
    private const MODERATOR_ROLES = ['trainer', 'admin', 'super-admin'];

    public function updatePost(Request $request, CommunityPost $post): RedirectResponse
    {
        $this->authorizeModerator($request);

        $validated = $request->validate([
            'action' => ['required', Rule::in(['pin', 'unpin', 'lock', 'unlock', 'hide', 'restore'])],
        ]);

        match ($validated['action']) {
            'pin' => $post->update(['is_pinned' => true]),
            'unpin' => $post->update(['is_pinned' => false]),
            'lock' => $post->update(['is_locked' => true]),
            'unlock' => $post->update(['is_locked' => false]),
            'hide' => $post->update([
                'is_hidden' => true,
                'hidden_at' => now(),
                'hidden_by' => $request->user()->id,
            ]),
            'restore' => $post->update([
                'is_hidden' => false,
                'hidden_at' => null,
                'hidden_by' => null,
            ]),
        };

        return back()->with('success', 'Modération appliquée.');
    }

    public function updateComment(Request $request, CommunityComment $comment): RedirectResponse
    {
        $this->authorizeModerator($request);

        $validated = $request->validate([
            'action' => ['required', Rule::in(['hide', 'restore'])],
        ]);

        if ($validated['action'] === 'hide') {
            $comment->update([
                'is_hidden' => true,
                'hidden_at' => now(),
                'hidden_by' => $request->user()->id,
            ]);
        } else {
            $comment->update([
                'is_hidden' => false,
                'hidden_at' => null,
                'hidden_by' => null,
            ]);
        }

        return back()->with('success', 'Commentaire mis à jour.');
    }

    private function authorizeModerator(Request $request): void
    {
        abort_unless($request->user()?->hasAnyRole(self::MODERATOR_ROLES), 403);
    }
}
