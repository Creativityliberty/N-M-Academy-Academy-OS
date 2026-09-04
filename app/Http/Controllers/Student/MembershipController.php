<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AcademyMembership;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\BillingPortal\Session as PortalSession;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class MembershipController extends Controller
{
    public function index(Request $request): Response
    {
        $memberships = AcademyMembership::query()
            ->where('user_id', $request->user()->id)
            ->with(['course:id,title', 'offer:id,name,amount,currency,interval'])
            ->latest()
            ->get()
            ->map(fn (AcademyMembership $membership) => [
                'id' => $membership->id,
                'course' => $membership->course?->title,
                'offer' => $membership->offer?->name,
                'status' => $membership->status,
                'recurringAmount' => (int) ($membership->recurring_amount ?: $membership->offer?->amount ?: 0),
                'currency' => $membership->currency ?: ($membership->offer?->currency ?? 'EUR'),
                'interval' => $membership->interval ?: $membership->offer?->interval,
                'currentPeriodEnd' => $membership->current_period_end?->toIso8601String(),
                'canceledAt' => $membership->canceled_at?->toIso8601String(),
                'endedAt' => $membership->ended_at?->toIso8601String(),
                'canManage' => ! empty($request->user()->stripe_id),
            ])
            ->values();

        return Inertia::render('student/memberships/index', [
            'memberships' => $memberships,
        ]);
    }

    public function portal(Request $request, AcademyMembership $membership): SymfonyResponse
    {
        abort_unless((int) $membership->user_id === (int) $request->user()->id, 403);
        abort_unless($request->user()->stripe_id, 422, 'Aucun client Stripe associé.');

        Stripe::setApiKey((string) config('cashier.secret'));
        $session = PortalSession::create([
            'customer' => $request->user()->stripe_id,
            'return_url' => route('student.memberships.index'),
        ]);

        return Inertia::location($session->url);
    }
}
