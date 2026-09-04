<?php

use App\Http\Controllers\Community\CommunityCommentController;
use App\Http\Controllers\Community\CommunityController;
use App\Http\Controllers\Community\CommunityModerationController;
use App\Http\Controllers\Community\CommunityPostController;
use App\Http\Controllers\Community\CommunityReactionController;
use App\Http\Controllers\Community\CommunitySpaceController;
use App\Http\Controllers\Events\EventController;
use App\Http\Controllers\Events\EventManagementController;
use App\Http\Controllers\Events\EventRegistrationController;
use App\Http\Controllers\Public\BecomeTrainer\CheckoutController;
use App\Http\Controllers\Public\BecomeTrainer\PaymentController;
use App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController;
use App\Http\Controllers\Public\Courses\CheckoutController as CourseCheckoutController;
use App\Http\Controllers\Public\Courses\CourseController;
use App\Http\Controllers\Public\Home\HomeController;
use App\Http\Controllers\Public\AcademyPageController;
use App\Http\Controllers\Public\WebhookController;
use App\Http\Controllers\Public\CertificateVerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('p/{slug}', [AcademyPageController::class, 'show'])->middleware('feature:pages')->name('academy-pages.show');
Route::get('certificates/verify/{verificationCode}', [CertificateVerificationController::class, 'show'])->name('certificates.verify');
Route::get('certificates/verify/{verificationCode}/pdf', [CertificateVerificationController::class, 'pdf'])->name('certificates.verify.pdf');

Route::inertia('about', 'home/about')->name('about');
Route::inertia('blog', 'home/blog/index')->name('blog');
Route::inertia('contact', 'home/contact')->name('contact');
Route::inertia('realisations', 'home/realisations/index')->name('realisations');

// Plateforme & Communauté
Route::inertia('comment-ca-marche', 'home/how-it-works')->name('how-it-works');
Route::inertia('tarifs', 'home/pricing')->name('pricing');
Route::get('communaute/forum', [CommunityController::class, 'index'])->middleware('feature:community')->name('community.forum');
Route::get('communaute/evenements', [EventController::class, 'index'])->middleware('feature:events')->name('community.events');

Route::middleware(['auth', 'verified', 'feature:community'])->prefix('communaute/forum')->group(function () {
    Route::post('posts', [CommunityPostController::class, 'store'])->name('community.posts.store');
    Route::post('posts/{post}/comments', [CommunityCommentController::class, 'store'])->name('community.comments.store');
    Route::post('reactions', [CommunityReactionController::class, 'store'])->name('community.reactions.store');
    Route::patch('posts/{post}/moderation', [CommunityModerationController::class, 'updatePost'])->name('community.posts.moderate');
    Route::patch('comments/{comment}/moderation', [CommunityModerationController::class, 'updateComment'])->name('community.comments.moderate');
    Route::post('spaces', [CommunitySpaceController::class, 'store'])->name('community.spaces.store');
});


Route::middleware(['auth', 'verified', 'feature:events'])->prefix('communaute/evenements')->group(function () {
    Route::post('/', [EventManagementController::class, 'store'])->name('events.store');
    Route::patch('{event}/cancel', [EventManagementController::class, 'cancel'])->name('events.cancel');
    Route::post('{event}/inscription', [EventRegistrationController::class, 'store'])->name('events.registrations.store');
    Route::delete('{event}/inscription', [EventRegistrationController::class, 'destroy'])->name('events.registrations.destroy');
});

// Légal
Route::inertia('legal/confidentialite', 'home/legal/privacy')->name('legal.privacy');
Route::inertia('legal/cgu', 'home/legal/cgu')->name('legal.cgu');
Route::inertia('legal/cookies', 'home/legal/cookies')->name('legal.cookies');
Route::inertia('legal/mentions-legales', 'home/legal/terms')->name('legal.terms');

// Courses
Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('courses/{id}', [CourseController::class, 'show'])->name('courses.show');
Route::get('courses/{id}/checkout', [CourseCheckoutController::class, 'show'])->middleware(['auth', 'verified', 'feature:sales'])->name('courses.checkout.show');
Route::post('courses/checkout', [CourseCheckoutController::class, 'store'])->middleware(['auth', 'verified', 'feature:sales'])->name('courses.checkout');
Route::inertia('courses/purchase/success', 'home/courses/success')->middleware(['auth', 'verified', 'feature:sales'])->name('courses.purchase.success');

// Become trainer
Route::get('become-trainer', [TrainerPlanController::class, 'index'])->name('become-trainer.index');
Route::get('become-trainer/checkout/{plan}', [CheckoutController::class, 'show'])->middleware(['auth', 'verified'])->name('become-trainer.checkout.show');
Route::post('become-trainer/checkout', [CheckoutController::class, 'store'])->middleware(['auth', 'verified'])->name('become-trainer.checkout');
Route::inertia('become-trainer/success', 'home/become-trainer/success')->name('become-trainer.success');

// Stripe / Cashier
Route::post('stripe/webhook', [WebhookController::class, 'handleWebhook'])->name('cashier.webhook');
Route::get('stripe/payment/{payment}', [PaymentController::class, 'show'])->name('cashier.payment');
