<?php

declare(strict_types=1);

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\AcademyEvent;
use App\Models\EventRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EventRegistrationController extends Controller
{
    public function store(Request $request, AcademyEvent $event): RedirectResponse
    {
        $user = $request->user();

        DB::transaction(function () use ($event, $user): void {
            $lockedEvent = AcademyEvent::query()->whereKey($event->id)->lockForUpdate()->firstOrFail();

            if (! $lockedEvent->is_published || $lockedEvent->is_cancelled || $lockedEvent->starts_at->lte(now())) {
                throw ValidationException::withMessages([
                    'event' => 'Les inscriptions ne sont plus ouvertes pour cet événement.',
                ]);
            }

            if (EventRegistration::query()->where('academy_event_id', $lockedEvent->id)->where('user_id', $user->id)->exists()) {
                return;
            }

            if ($lockedEvent->capacity !== null) {
                $registrationsCount = EventRegistration::query()->where('academy_event_id', $lockedEvent->id)->count();

                if ($registrationsCount >= $lockedEvent->capacity) {
                    throw ValidationException::withMessages([
                        'event' => 'Cet événement est complet.',
                    ]);
                }
            }

            EventRegistration::create([
                'academy_event_id' => $lockedEvent->id,
                'user_id' => $user->id,
                'registered_at' => now(),
            ]);
        });

        return back()->with('success', 'Inscription confirmée.');
    }

    public function destroy(Request $request, AcademyEvent $event): RedirectResponse
    {
        EventRegistration::query()
            ->where('academy_event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return back()->with('success', 'Inscription annulée.');
    }
}
