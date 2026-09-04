<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerObservatorySnapshot;
use App\Models\User;
use Illuminate\Support\Str;
use Throwable;

class ObservatoryCollector
{
    public function __construct(private readonly AcademyGateway $academy) {}

    public function collect(User $owner): TowerObservatorySnapshot
    {
        $calls = [
            'academy' => ['academy.summary', []],
            'sales' => ['sales.summary', []],
            'learning' => ['analytics.summary', []],
            'learningCourses' => ['analytics.learning', []],
            'studentRisk' => ['students.risk.summary', []],
            'community' => ['community.posts.list', ['limit' => 100]],
            'events' => ['events.list', ['limit' => 100]],
            'ai' => ['ai.usage.summary', []],
        ];

        $raw = [];
        $sources = [];
        $errors = [];
        foreach ($calls as $key => [$tool, $arguments]) {
            try {
                $raw[$key] = $this->academy->call($tool, $arguments);
                $sources[$key] = ['tool' => $tool, 'status' => 'ok'];
            } catch (Throwable $error) {
                $raw[$key] = null;
                $sources[$key] = ['tool' => $tool, 'status' => 'error'];
                $errors[$key] = mb_substr($error->getMessage(), 0, 1000);
            }
        }

        $metrics = $this->normalize($raw);

        return TowerObservatorySnapshot::create([
            'owner_id' => $owner->id,
            'snapshot_uuid' => (string) Str::uuid(),
            'status' => $errors === [] ? 'completed' : 'partial',
            'sources' => $sources,
            'metrics' => $metrics,
            'errors' => $errors === [] ? null : $errors,
            'captured_at' => now(),
        ]);
    }

    /** @param array<string,mixed> $sources @return array<string,mixed> */
    private function normalize(array $sources): array
    {
        $sales = is_array($sources['sales'] ?? null) ? $sources['sales'] : [];
        $learning = is_array($sources['learning'] ?? null) ? $sources['learning'] : [];
        $risk = is_array($sources['studentRisk'] ?? null) ? $sources['studentRisk'] : [];
        $community = is_array($sources['community'] ?? null) ? $sources['community'] : [];
        $events = is_array($sources['events'] ?? null) ? $sources['events'] : [];
        $ai = is_array($sources['ai'] ?? null) ? $sources['ai'] : [];

        $revenue = collect((array) ($sales['revenueByCurrency'] ?? []))->map(fn ($row) => [
            'currency' => (string) ($row['currency'] ?? 'N/A'),
            'gross' => (int) ($row['gross'] ?? 0),
            'refunds' => (int) ($row['refunds'] ?? 0),
            'net' => (int) ($row['net'] ?? 0),
            'refundRate' => (int) ($row['gross'] ?? 0) > 0 ? round(((int) ($row['refunds'] ?? 0) / (int) $row['gross']) * 100, 2) : 0,
        ])->values()->all();

        $posts = collect((array) ($community['items'] ?? []));
        $latestPostAt = $posts->pluck('createdAt')->filter()->sortDesc()->first();
        $eventItems = collect((array) ($events['items'] ?? []));

        return [
            'sales' => [
                'conversionRate' => $sales['conversionRate'] ?? null,
                'activeMemberships' => (int) ($sales['activeMemberships'] ?? 0),
                'monthlyChurnRate' => $sales['monthlyChurnRate'] ?? null,
                'revenueByCurrency' => $revenue,
            ],
            'learning' => [
                'students' => (int) ($learning['students'] ?? 0),
                'averageCompletion' => (int) ($learning['averageCompletion'] ?? 0),
                'riskStudents' => (int) ($risk['riskStudents'] ?? 0),
                'riskRate' => $risk['riskRate'] ?? 0,
                'courses' => $risk['courses'] ?? [],
            ],
            'community' => [
                'recentPostCount' => $posts->count(),
                'latestPostAt' => $latestPostAt,
                'comments' => (int) $posts->sum(fn ($row) => (int) ($row['comments'] ?? 0)),
                'reactions' => (int) $posts->sum(fn ($row) => (int) ($row['reactions'] ?? 0)),
            ],
            'events' => [
                'count' => $eventItems->count(),
                'items' => $eventItems->map(fn ($row) => [
                    'id' => $row['id'] ?? null,
                    'title' => $row['title'] ?? 'Event',
                    'startsAt' => $row['startsAt'] ?? null,
                    'registrations' => (int) ($row['registrations'] ?? 0),
                    'capacity' => isset($row['capacity']) ? (int) $row['capacity'] : null,
                ])->values()->all(),
            ],
            'ai' => [
                'creatorRuns30d' => (int) ($ai['creatorRuns30d'] ?? 0),
                'tutorRuns30d' => (int) ($ai['tutorRuns30d'] ?? 0),
                'estimatedCostCents30d' => (int) ($ai['estimatedCostCents30d'] ?? 0),
                'estimatedCostCents24h' => (int) ($ai['estimatedCostCents24h'] ?? 0),
                'estimatedCostCentsPrevious24h' => (int) ($ai['estimatedCostCentsPrevious24h'] ?? 0),
                'inputTokens30d' => (int) ($ai['inputTokens30d'] ?? 0),
                'outputTokens30d' => (int) ($ai['outputTokens30d'] ?? 0),
                'providers' => $ai['providers'] ?? [],
                'costCoverage' => (string) ($ai['costCoverage'] ?? 'unknown'),
            ],
        ];
    }
}
