<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseOffer;
use App\Services\Commerce\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    public function __construct(private readonly CheckoutService $checkout) {}

    public function show(Request $request, int $courseId): Response
    {
        $course = Course::with('trainer')->published()->findOrFail($courseId);
        $offer = $request->integer('offer') ? CourseOffer::findOrFail($request->integer('offer')) : $this->checkout->defaultOffer($course);
        return $this->createSession($request, $course, $offer);
    }

    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'course_id' => ['required','integer','exists:courses,id'],
            'offer_id' => ['nullable','integer','exists:course_offers,id'],
            'coupon' => ['nullable','string','max:64'],
            'affiliate' => ['nullable','string','max:64'],
        ]);
        $course = Course::with('trainer')->published()->findOrFail($validated['course_id']);
        $offer = !empty($validated['offer_id']) ? CourseOffer::findOrFail($validated['offer_id']) : $this->checkout->defaultOffer($course);
        return $this->createSession($request, $course, $offer, $validated['coupon'] ?? null, $validated['affiliate'] ?? null);
    }

    private function createSession(Request $request, Course $course, CourseOffer $offer, ?string $coupon = null, ?string $affiliate = null): Response
    {
        $result = $this->checkout->begin($request->user(), $course, $offer, $coupon ?? $request->string('coupon')->toString(), $affiliate ?? $request->string('ref')->toString() ?: $request->cookie('academy_ref'));
        if ($result['session'] === null) {
            return redirect()->route('courses.purchase.success')->with('success','Accès activé.');
        }
        return Inertia::location($result['session']->url);
    }
}
