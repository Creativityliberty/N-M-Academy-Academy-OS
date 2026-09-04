<?php

declare(strict_types=1);

use App\Models\AcademyAiRun;
use App\Models\AcademyPage;
use App\Models\AcademyPageSection;
use App\Models\Course;
use App\Models\CourseOffer;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function m11Trainer(): User
{
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    return $trainer;
}

it('lets a trainer create a structured page with seeded blocks', function () {
    $trainer = m11Trainer();
    $this->actingAs($trainer)->post(route('trainer.pages.store'), ['title' => 'Launch Page', 'page_type' => 'sales'])->assertRedirect();
    $page = AcademyPage::where('trainer_id', $trainer->id)->firstOrFail();
    expect($page->status)->toBe('draft');
    expect($page->sections()->count())->toBe(5);
    expect($page->sections()->pluck('type')->all())->toBe(['hero','course','pricing','cta','footer']);
});

it('prevents another trainer from editing a page', function () {
    $owner = m11Trainer();
    $other = m11Trainer();
    $page = AcademyPage::create(['trainer_id'=>$owner->id,'title'=>'Private','slug'=>'private-page','page_type'=>'landing','status'=>'draft']);
    $this->actingAs($other)->patch(route('trainer.pages.update', $page), ['title'=>'Hijack','slug'=>'private-page','page_type'=>'landing'])->assertForbidden();
    expect($page->fresh()->title)->toBe('Private');
});

it('renders only published pages publicly', function () {
    $trainer = m11Trainer();
    $page = AcademyPage::create(['trainer_id'=>$trainer->id,'title'=>'Public','slug'=>'public-page','page_type'=>'landing','status'=>'draft']);
    $this->get(route('academy-pages.show','public-page'))->assertNotFound();
    $page->update(['status'=>'published','published_at'=>now()]);
    $this->get(route('academy-pages.show','public-page'))->assertOk();
});

it('binds pricing blocks to current active M10 offers instead of copied prices', function () {
    $trainer = m11Trainer();
    $course = Course::factory()->published()->create(['trainer_id'=>$trainer->id]);
    $offer = CourseOffer::create(['course_id'=>$course->id,'name'=>'Pro','slug'=>'pro','billing_type'=>'one_time','amount'=>4900,'currency'=>'EUR','access_rank'=>100,'is_active'=>true]);
    $page = AcademyPage::create(['trainer_id'=>$trainer->id,'title'=>'Sales','slug'=>'live-pricing','page_type'=>'sales','status'=>'published','published_at'=>now()]);
    $page->sections()->create(['type'=>'pricing','variant'=>'cards','sort_order'=>0,'settings'=>['course_id'=>$course->id]]);
    $this->get(route('academy-pages.show','live-pricing'))->assertOk()->assertInertia(fn ($inertia) => $inertia->where('sections.0.data.offers.0.amount',4900));
    $offer->update(['amount'=>7900]);
    $this->get(route('academy-pages.show','live-pricing'))->assertInertia(fn ($inertia) => $inertia->where('sections.0.data.offers.0.amount',7900));
});

it('applies an AI page blueprint only as a draft and strips unsupported settings', function () {
    $trainer = m11Trainer();
    $run = AcademyAiRun::create([
        'user_id'=>$trainer->id,'capability'=>'page.generate','mode'=>'create','prompt'=>'Build page','provider'=>'fake','model'=>'fake','status'=>'succeeded',
        'input'=>[],
        'output'=>[
            'title'=>'AI Landing','slug_hint'=>'ai-landing','meta_title'=>'AI Landing','meta_description'=>'Safe page',
            'sections'=>[
                ['type'=>'hero','variant'=>'minimal','headline'=>'Hello','subheadline'=>'World','title'=>'','description'=>'','button_label'=>'Start','button_url'=>'#pricing','course_id'=>0,'items'=>[], 'evil_html'=>'<script>alert(1)</script>'],
                ['type'=>'cta','variant'=>'centered','headline'=>'','subheadline'=>'','title'=>'Ready','description'=>'','button_label'=>'Go','button_url'=>'#pricing','course_id'=>0,'items'=>[]],
                ['type'=>'footer','variant'=>'minimal','headline'=>'','subheadline'=>'','title'=>'','description'=>'','button_label'=>'','button_url'=>'','course_id'=>0,'items'=>[]],
            ],
        ],
    ]);
    $this->actingAs($trainer)->post(route('trainer.academy-ai.runs.apply',$run))->assertRedirect();
    $page = AcademyPage::where('trainer_id',$trainer->id)->where('title','AI Landing')->firstOrFail();
    expect($page->status)->toBe('draft');
    expect(json_encode($page->sections()->firstOrFail()->settings))->not->toContain('script');
});
