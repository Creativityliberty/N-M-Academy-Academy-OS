<?php

declare(strict_types=1);

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CommunityReactionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'target_type' => ['required', Rule::in(['post', 'comment'])],
            'target_id' => ['required', 'integer', 'min:1'],
            'type' => ['required', Rule::in(['like', 'celebrate', 'insightful'])],
        ]);

        $target = $this->resolveTarget($validated['target_type'], (int) $validated['target_id']);
        abort_if($target->is_hidden, 404);
        if ($target instanceof CommunityComment) {
            abort_if($target->post()->where('is_hidden', true)->exists(), 404);
        }

        $existing = $target->reactions()
            ->where('user_id', $request->user()->id)
            ->where('type', $validated['type'])
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            $target->reactions()->create([
                'user_id' => $request->user()->id,
                'type' => $validated['type'],
            ]);
        }

        return back();
    }

    private function resolveTarget(string $type, int $id): Model
    {
        return match ($type) {
            'post' => CommunityPost::query()->findOrFail($id),
            'comment' => CommunityComment::query()->findOrFail($id),
        };
    }
}
