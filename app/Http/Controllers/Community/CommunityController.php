<?php

declare(strict_types=1);

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\CommunitySpace;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    private const MODERATOR_ROLES = ['trainer', 'admin', 'super-admin'];

    public function index(Request $request): Response
    {
        $user = $request->user();
        $canModerate = $this->canModerate($user);
        $spaceSlug = trim((string) $request->query('space', ''));
        $search = trim((string) $request->query('q', ''));

        $spaces = CommunitySpace::query()
            ->where('is_active', true)
            ->withCount(['posts' => fn (Builder $query) => $query->where('is_hidden', false)])
            ->orderBy('position')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'position'])
            ->map(fn (CommunitySpace $space) => [
                'id' => $space->id,
                'name' => $space->name,
                'slug' => $space->slug,
                'description' => $space->description,
                'position' => $space->position,
                'postsCount' => $space->posts_count,
            ]);

        $query = CommunityPost::query()
            ->with([
                'space:id,name,slug',
                'author:id,name,trainer_avatar',
                'attachments',
                'reactions:id,user_id,reactionable_type,reactionable_id,type',
                'comments' => function ($comments) use ($canModerate): void {
                    $comments
                        ->when(! $canModerate, fn ($query) => $query->where('is_hidden', false))
                        ->oldest()
                        ->with([
                            'author:id,name,trainer_avatar',
                            'reactions:id,user_id,reactionable_type,reactionable_id,type',
                        ]);
                },
            ])
            ->withCount([
                'comments as comments_count' => fn (Builder $comments) => $comments->where('is_hidden', false),
            ])
            ->when(! $canModerate, fn (Builder $posts) => $posts->where('is_hidden', false))
            ->when($spaceSlug !== '', function (Builder $posts) use ($spaceSlug): void {
                $posts->whereHas('space', fn (Builder $space) => $space->where('slug', $spaceSlug)->where('is_active', true));
            })
            ->when($search !== '', function (Builder $posts) use ($search): void {
                $posts->where(function (Builder $searchQuery) use ($search): void {
                    $like = '%'.$search.'%';
                    $searchQuery
                        ->where('title', 'like', $like)
                        ->orWhere('body', 'like', $like)
                        ->orWhereHas('author', fn (Builder $author) => $author->where('name', 'like', $like));
                });
            })
            ->orderByDesc('is_pinned')
            ->latest();

        $posts = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (CommunityPost $post) => $this->serializePost($post, $user, $canModerate));

        return Inertia::render(
            $user ? 'community/index' : 'home/community/forum',
            [
                'spaces' => $spaces,
                'posts' => $posts,
                'filters' => [
                    'space' => $spaceSlug !== '' ? $spaceSlug : null,
                    'q' => $search,
                ],
                'canModerate' => $canModerate,
            ],
        );
    }

    private function serializePost(CommunityPost $post, ?User $viewer, bool $canModerate): array
    {
        $viewerId = $viewer?->id;
        $postReactions = $post->reactions->groupBy('type');

        return [
            'id' => $post->id,
            'title' => $post->title,
            'body' => $post->body,
            'createdAt' => $post->created_at?->toIso8601String(),
            'updatedAt' => $post->updated_at?->toIso8601String(),
            'isPinned' => $post->is_pinned,
            'isLocked' => $post->is_locked,
            'isHidden' => $post->is_hidden,
            'commentsCount' => $post->comments_count,
            'space' => [
                'id' => $post->space->id,
                'name' => $post->space->name,
                'slug' => $post->space->slug,
            ],
            'author' => [
                'id' => $post->author->id,
                'name' => $post->author->name,
                'avatar' => $post->author->trainer_avatar,
            ],
            'attachments' => $post->attachments->map(fn ($attachment) => [
                'id' => $attachment->id,
                'name' => $attachment->original_name,
                'mimeType' => $attachment->mime_type,
                'size' => $attachment->size,
                'url' => $attachment->url,
            ])->values(),
            'reactions' => collect(['like', 'celebrate', 'insightful'])->mapWithKeys(function (string $type) use ($postReactions, $viewerId): array {
                $items = $postReactions->get($type, collect());

                return [$type => [
                    'count' => $items->count(),
                    'reacted' => $viewerId !== null && $items->contains('user_id', $viewerId),
                ]];
            }),
            'comments' => $post->comments
                ->sortBy('created_at')
                ->values()
                ->map(function ($comment) use ($viewerId, $canModerate): array {
                    $commentReactions = $comment->reactions->groupBy('type');

                    return [
                        'id' => $comment->id,
                        'body' => $comment->body,
                        'createdAt' => $comment->created_at?->toIso8601String(),
                        'isHidden' => $comment->is_hidden,
                        'canModerate' => $canModerate,
                        'author' => [
                            'id' => $comment->author->id,
                            'name' => $comment->author->name,
                            'avatar' => $comment->author->trainer_avatar,
                        ],
                        'reactions' => collect(['like', 'celebrate', 'insightful'])->mapWithKeys(function (string $type) use ($commentReactions, $viewerId): array {
                            $items = $commentReactions->get($type, collect());

                            return [$type => [
                                'count' => $items->count(),
                                'reacted' => $viewerId !== null && $items->contains('user_id', $viewerId),
                            ]];
                        }),
                    ];
                }),
        ];
    }

    private function canModerate(?User $user): bool
    {
        return $user?->hasAnyRole(self::MODERATOR_ROLES) ?? false;
    }
}
