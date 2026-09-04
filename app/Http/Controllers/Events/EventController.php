<?php

declare(strict_types=1);

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\AcademyEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $viewer = $request->user();
        $viewerId = $viewer?->id;

        $events = AcademyEvent::query()
            ->where('is_published', true)
            ->where('is_cancelled', false)
            ->where('ends_at', '>=', now())
            ->with(['creator:id,name,trainer_avatar'])
            ->withCount('registrations')
            ->when($viewerId !== null, fn (Builder $query) => $query->with([
                'registrations' => fn ($registrations) => $registrations
                    ->where('user_id', $viewerId)
                    ->select(['id', 'academy_event_id', 'user_id', 'registered_at']),
            ]))
            ->orderBy('starts_at')
            ->get()
            ->map(fn (AcademyEvent $event) => $this->serializeEvent($event, $viewer));

        return Inertia::render(
            $viewer ? 'events/index' : 'home/community/events',
            [
                'events' => $events,
                'canCreate' => $viewer?->hasAnyRole(['trainer', 'admin', 'super-admin']) ?? false,
            ],
        );
    }

    private function serializeEvent(AcademyEvent $event, ?User $viewer): array
    {
        $isRegistered = $viewer !== null && $event->relationLoaded('registrations') && $event->registrations->isNotEmpty();
        $canManage = $viewer !== null && (
            $viewer->id === $event->creator_id
            || $viewer->hasAnyRole(['admin', 'super-admin'])
        );
        $capacity = $event->capacity;
        $spotsRemaining = $capacity === null
            ? null
            : max(0, $capacity - (int) $event->registrations_count);

        return [
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'startsAt' => $event->starts_at?->utc()->toIso8601String(),
            'endsAt' => $event->ends_at?->utc()->toIso8601String(),
            'timezone' => $event->timezone,
            'location' => $event->location,
            'hasMeeting' => $event->meeting_url !== null,
            'meetingUrl' => ($isRegistered || $canManage) ? $event->meeting_url : null,
            'capacity' => $capacity,
            'registrationsCount' => (int) $event->registrations_count,
            'spotsRemaining' => $spotsRemaining,
            'isFull' => $spotsRemaining !== null && $spotsRemaining <= 0,
            'isRegistered' => $isRegistered,
            'canManage' => $canManage,
            'reminderMinutes' => $event->reminder_minutes,
            'creator' => [
                'id' => $event->creator->id,
                'name' => $event->creator->name,
                'avatar' => $event->creator->trainer_avatar,
            ],
        ];
    }
}
