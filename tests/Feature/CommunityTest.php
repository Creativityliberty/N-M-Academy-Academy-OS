<?php

use App\Enums\RoleEnum;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\CommunityReaction;
use App\Models\CommunitySpace;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function communityMember(string $role = 'student'): User
{
    $user = User::factory()->create(['email_verified_at' => now()]);
    $user->assignRole($role);

    return $user;
}

function communitySpace(): CommunitySpace
{
    return CommunitySpace::query()->firstOrCreate(
        ['slug' => 'general'],
        [
            'name' => 'Général',
            'description' => 'Discussions générales',
            'position' => 1,
            'is_active' => true,
        ],
    );
}

test('guest forum renders persisted visible posts but not hidden posts', function () {
    $author = User::factory()->create();
    $space = communitySpace();

    CommunityPost::create([
        'community_space_id' => $space->id,
        'user_id' => $author->id,
        'title' => 'Sujet visible',
        'body' => 'Un vrai sujet stocké en base.',
    ]);

    CommunityPost::create([
        'community_space_id' => $space->id,
        'user_id' => $author->id,
        'title' => 'Sujet masqué',
        'body' => 'Ce contenu ne doit pas sortir.',
        'is_hidden' => true,
        'hidden_at' => now(),
    ]);

    $this->get(route('community.forum'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home/community/forum')
            ->where('posts.data.0.title', 'Sujet visible')
            ->missing('posts.data.1')
        );
});

test('verified member can create a post with a persisted public attachment', function () {
    Storage::fake('public');

    $member = communityMember();
    $space = communitySpace();

    $this->actingAs($member)
        ->post(route('community.posts.store'), [
            'community_space_id' => $space->id,
            'title' => 'Mon premier sujet',
            'body' => 'Voici un document utile pour la communauté.',
            'attachments' => [UploadedFile::fake()->create('guide.pdf', 256, 'application/pdf')],
        ])
        ->assertRedirect();

    $post = CommunityPost::query()->where('title', 'Mon premier sujet')->firstOrFail();

    $this->assertDatabaseHas('community_attachments', [
        'community_post_id' => $post->id,
        'original_name' => 'guide.pdf',
        'disk' => 'public',
    ]);

    $attachment = $post->attachments()->firstOrFail();
    Storage::disk('public')->assertExists($attachment->path);
});

test('locked post refuses new comments', function () {
    $member = communityMember();
    $space = communitySpace();
    $post = CommunityPost::create([
        'community_space_id' => $space->id,
        'user_id' => $member->id,
        'title' => 'Discussion fermée',
        'body' => 'Le modérateur a fermé les réponses.',
        'is_locked' => true,
    ]);

    $this->actingAs($member)
        ->post(route('community.comments.store', $post), ['body' => 'Nouvelle réponse'])
        ->assertForbidden();

    expect(CommunityComment::query()->count())->toBe(0);
});

test('reaction endpoint toggles a reaction on and off', function () {
    $member = communityMember();
    $space = communitySpace();
    $post = CommunityPost::create([
        'community_space_id' => $space->id,
        'user_id' => $member->id,
        'title' => 'Réagissez ici',
        'body' => 'Un sujet réactif.',
    ]);

    $payload = [
        'target_type' => 'post',
        'target_id' => $post->id,
        'type' => 'insightful',
    ];

    $this->actingAs($member)->post(route('community.reactions.store'), $payload)->assertRedirect();
    expect(CommunityReaction::query()->count())->toBe(1);

    $this->actingAs($member)->post(route('community.reactions.store'), $payload)->assertRedirect();
    expect(CommunityReaction::query()->count())->toBe(0);
});

test('student cannot moderate but trainer can pin and hide posts', function () {
    $student = communityMember();
    $trainer = communityMember(RoleEnum::Trainer->value);
    $space = communitySpace();
    $post = CommunityPost::create([
        'community_space_id' => $space->id,
        'user_id' => $student->id,
        'title' => 'À modérer',
        'body' => 'Contenu de test.',
    ]);

    $this->actingAs($student)
        ->patch(route('community.posts.moderate', $post), ['action' => 'pin'])
        ->assertForbidden();

    $this->actingAs($trainer)
        ->patch(route('community.posts.moderate', $post), ['action' => 'pin'])
        ->assertRedirect();

    expect($post->fresh()->is_pinned)->toBeTrue();

    $this->actingAs($trainer)
        ->patch(route('community.posts.moderate', $post), ['action' => 'hide'])
        ->assertRedirect();

    expect($post->fresh()->is_hidden)->toBeTrue();
});

test('moderator can create a new community space', function () {
    $trainer = communityMember(RoleEnum::Trainer->value);

    $this->actingAs($trainer)
        ->post(route('community.spaces.store'), [
            'name' => 'Acquisition',
            'description' => 'SEO, ads et croissance.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('community_spaces', [
        'name' => 'Acquisition',
        'slug' => 'acquisition',
        'is_active' => true,
    ]);
});

test('reaction cannot target a comment whose parent post is hidden', function () {
    $member = communityMember();
    $space = communitySpace();
    $post = CommunityPost::create([
        'community_space_id' => $space->id,
        'user_id' => $member->id,
        'title' => 'Sujet masqué',
        'body' => 'Ce sujet a été masqué.',
        'is_hidden' => true,
        'hidden_at' => now(),
    ]);
    $comment = CommunityComment::create([
        'community_post_id' => $post->id,
        'user_id' => $member->id,
        'body' => 'Commentaire rattaché au sujet masqué.',
    ]);

    $this->actingAs($member)
        ->post(route('community.reactions.store'), [
            'target_type' => 'comment',
            'target_id' => $comment->id,
            'type' => 'like',
        ])
        ->assertNotFound();

    expect(CommunityReaction::query()->count())->toBe(0);
});
