<?php

declare(strict_types=1);

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\AcademyEvent;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventManagementController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->hasAnyRole(['trainer', 'admin', 'super-admin']), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'min:4', 'max:180'],
            'description' => ['required', 'string', 'min:10', 'max:12000'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date'],
            'timezone' => ['required', 'timezone'],
            'meeting_url' => ['nullable', 'url:http,https', 'max:2048', 'required_without:location'],
            'location' => ['nullable', 'string', 'max:255', 'required_without:meeting_url'],
            'capacity' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'reminder_minutes' => ['required', 'integer', 'min:0', 'max:10080'],
        ]);

        $timezone = $validated['timezone'];
        $startsAt = CarbonImmutable::parse($validated['starts_at'], $timezone)->utc();
        $endsAt = CarbonImmutable::parse($validated['ends_at'], $timezone)->utc();

        if ($startsAt->lte(now())) {
            throw ValidationException::withMessages([
                'starts_at' => 'Le début de l’événement doit être dans le futur.',
            ]);
        }

        if ($endsAt->lte($startsAt)) {
            throw ValidationException::withMessages([
                'ends_at' => 'La fin doit être postérieure au début.',
            ]);
        }

        AcademyEvent::create([
            'creator_id' => $request->user()->id,
            'title' => trim($validated['title']),
            'description' => trim($validated['description']),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'timezone' => $timezone,
            'meeting_url' => isset($validated['meeting_url']) ? trim((string) $validated['meeting_url']) ?: null : null,
            'location' => isset($validated['location']) ? trim((string) $validated['location']) ?: null : null,
            'capacity' => $validated['capacity'] ?? null,
            'reminder_minutes' => $validated['reminder_minutes'],
            'is_published' => true,
            'is_cancelled' => false,
        ]);

        return back()->with('success', 'Événement créé.');
    }

    public function cancel(Request $request, AcademyEvent $event): RedirectResponse
    {
        $user = $request->user();
        abort_unless(
            $user !== null && ($user->id === $event->creator_id || $user->hasAnyRole(['admin', 'super-admin'])),
            403,
        );

        $event->update(['is_cancelled' => true]);

        return back()->with('success', 'Événement annulé.');
    }
}
