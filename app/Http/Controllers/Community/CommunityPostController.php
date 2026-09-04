<?php

declare(strict_types=1);

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\CommunitySpace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class CommunityPostController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'community_space_id' => ['required', 'integer', 'exists:community_spaces,id'],
            'title' => ['required', 'string', 'min:4', 'max:180'],
            'body' => ['required', 'string', 'min:2', 'max:12000'],
            'attachments' => ['nullable', 'array', 'max:4'],
            'attachments.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,webp,gif,pdf'],
        ]);

        $space = CommunitySpace::query()->whereKey($validated['community_space_id'])->where('is_active', true)->firstOrFail();
        $storedPaths = [];

        try {
            DB::transaction(function () use ($request, $validated, $space, &$storedPaths): void {
                $post = CommunityPost::create([
                    'community_space_id' => $space->id,
                    'user_id' => $request->user()->id,
                    'title' => trim($validated['title']),
                    'body' => trim($validated['body']),
                ]);

                foreach ($request->file('attachments', []) as $file) {
                    $path = $file->store("community/posts/{$post->id}", 'public');
                    $storedPaths[] = $path;

                    $post->attachments()->create([
                        'disk' => 'public',
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
                        'size' => $file->getSize(),
                    ]);
                }
            });
        } catch (Throwable $exception) {
            if ($storedPaths !== []) {
                Storage::disk('public')->delete($storedPaths);
            }

            throw $exception;
        }

        return back()->with('success', 'Sujet publié dans la communauté.');
    }
}
