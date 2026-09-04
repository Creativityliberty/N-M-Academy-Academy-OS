<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerInsight;
use App\MissionTower\Models\TowerObservatorySnapshot;
use Carbon\CarbonImmutable;

class ObservatorySignalEngine
{
    /** @return array<int,TowerInsight> */
    public function evaluate(TowerObservatorySnapshot $snapshot): array
    {
        $previous = TowerObservatorySnapshot::query()->where('owner_id', $snapshot->owner_id)->where('id', '<', $snapshot->id)->latest('captured_at')->first();
        $signals = array_merge(
            $this->refundRateSignals($snapshot),
            $this->conversionDropSignals($snapshot, $previous),
            $this->learningRiskSignals($snapshot),
            $this->eventFillSignals($snapshot),
            $this->communitySilenceSignals($snapshot),
            $this->aiCostSpikeSignals($snapshot, $previous),
        );

        $seen = [];
        $insights = [];
        foreach ($signals as $signal) {
            $seen[] = $signal['fingerprint'];
            $existing = TowerInsight::query()
                ->where('owner_id', $snapshot->owner_id)
                ->where('fingerprint', $signal['fingerprint'])
                ->first();

            $insights[] = TowerInsight::updateOrCreate(
                ['owner_id' => $snapshot->owner_id, 'fingerprint' => $signal['fingerprint']],
                array_merge($signal, [
                    'snapshot_id' => $snapshot->id,
                    'status' => $existing?->mission_id ? 'mission_created' : 'open',
                    'last_seen_at' => now(),
                    'resolved_at' => null,
                    'first_seen_at' => $existing?->first_seen_at ?? now(),
                ])
            );
        }

        $observedDomains = collect([
            'sales' => data_get($snapshot->sources, 'sales.status') === 'ok',
            'learning' => data_get($snapshot->sources, 'learning.status') === 'ok' && data_get($snapshot->sources, 'studentRisk.status') === 'ok',
            'community' => data_get($snapshot->sources, 'community.status') === 'ok',
            'events' => data_get($snapshot->sources, 'events.status') === 'ok',
            'ai' => data_get($snapshot->sources, 'ai.status') === 'ok',
        ])->filter()->keys()->all();

        if ($observedDomains !== []) {
            TowerInsight::query()->where('owner_id', $snapshot->owner_id)->whereIn('status', ['open', 'mission_created'])->whereIn('domain', $observedDomains)
                ->when($seen !== [], fn ($q) => $q->whereNotIn('fingerprint', $seen))
                ->update(['status' => 'resolved', 'resolved_at' => now()]);
        }

        return $insights;
    }

    private function refundRateSignals(TowerObservatorySnapshot $snapshot): array
    {
        $threshold = (float) config('mission-tower.observatory.refund_rate_warn', 5);
        return collect((array) data_get($snapshot->metrics, 'sales.revenueByCurrency', []))->filter(fn ($row) => (float) ($row['refundRate'] ?? 0) >= $threshold)->map(fn ($row) => [
            'fingerprint' => 'refund_rate:'.($row['currency'] ?? 'N/A'), 'rule' => 'refund_rate', 'domain' => 'sales', 'severity' => (float) $row['refundRate'] >= $threshold * 2 ? 'critical' : 'warning',
            'title' => 'Taux de remboursement élevé', 'summary' => sprintf('%s : %.1f%% du montant brut a été remboursé.', $row['currency'] ?? 'N/A', (float) $row['refundRate']),
            'metric_key' => 'sales.refund_rate.'.($row['currency'] ?? 'N/A'), 'current_value' => $row['refundRate'], 'baseline_value' => $threshold, 'delta_percent' => null,
            'context' => $row, 'mission_blueprint' => ['title' => 'Analyser les remboursements', 'objective' => 'Identifier les causes du taux de remboursement et proposer des actions sans exécuter de remboursement.', 'priority' => 'high', 'steps' => [['tool' => 'sales.summary', 'arguments' => []]]],
        ])->values()->all();
    }

    private function conversionDropSignals(TowerObservatorySnapshot $snapshot, ?TowerObservatorySnapshot $previous): array
    {
        $current = data_get($snapshot->metrics, 'sales.conversionRate');
        $baseline = $previous ? data_get($previous->metrics, 'sales.conversionRate') : null;
        if (! is_numeric($current) || ! is_numeric($baseline) || (float) $baseline <= 0) return [];
        $delta = (((float) $current - (float) $baseline) / (float) $baseline) * 100;
        $threshold = (float) config('mission-tower.observatory.conversion_drop_pct', 15);
        if ($delta > -$threshold) return [];
        return [[
            'fingerprint' => 'conversion_drop', 'rule' => 'conversion_drop', 'domain' => 'sales', 'severity' => $delta <= -30 ? 'critical' : 'warning',
            'title' => 'Conversion en baisse', 'summary' => sprintf('La conversion est passée de %.1f%% à %.1f%% (%.1f%%).', $baseline, $current, $delta),
            'metric_key' => 'sales.conversion_rate', 'current_value' => $current, 'baseline_value' => $baseline, 'delta_percent' => round($delta, 2), 'context' => [],
            'mission_blueprint' => ['title' => 'Diagnostiquer la baisse de conversion', 'objective' => 'Analyser les ventes et les formations afin de préparer une mission d’optimisation de conversion.', 'priority' => 'high', 'steps' => [['tool' => 'sales.summary', 'arguments' => []], ['tool' => 'courses.list', 'arguments' => ['limit' => 100]]]],
        ]];
    }

    private function learningRiskSignals(TowerObservatorySnapshot $snapshot): array
    {
        $risk = (float) data_get($snapshot->metrics, 'learning.riskRate', 0);
        $students = (int) data_get($snapshot->metrics, 'learning.riskStudents', 0);
        $threshold = (float) config('mission-tower.observatory.learning_risk_pct', 25);
        if ($students <= 0 || $risk < $threshold) return [];
        return [[
            'fingerprint' => 'learning_risk', 'rule' => 'learning_risk', 'domain' => 'learning', 'severity' => $risk >= 50 ? 'critical' : 'warning', 'title' => 'Étudiants à risque de décrochage',
            'summary' => sprintf('%d étudiants (%.1f%%) n’ont pas démarré ou sont inactifs depuis au moins 14 jours.', $students, $risk), 'metric_key' => 'learning.risk_rate', 'current_value' => $risk, 'baseline_value' => $threshold, 'delta_percent' => null,
            'context' => ['courses' => data_get($snapshot->metrics, 'learning.courses', [])], 'mission_blueprint' => ['title' => 'Comprendre le décrochage étudiant', 'objective' => 'Analyser les formations avec le plus de risque et préparer une mission de récupération des étudiants inactifs.', 'priority' => 'high', 'steps' => [['tool' => 'analytics.learning', 'arguments' => []], ['tool' => 'students.risk.summary', 'arguments' => []]]],
        ]];
    }

    private function eventFillSignals(TowerObservatorySnapshot $snapshot): array
    {
        $threshold = (float) config('mission-tower.observatory.event_fill_warn', 30);
        $now = CarbonImmutable::now();
        return collect((array) data_get($snapshot->metrics, 'events.items', []))->filter(function ($event) use ($threshold, $now) {
            $capacity = (int) ($event['capacity'] ?? 0); $starts = $event['startsAt'] ?? null;
            if ($capacity <= 0 || ! $starts) return false;
            $date = CarbonImmutable::parse($starts); $fill = ((int) ($event['registrations'] ?? 0) / $capacity) * 100;
            return $date->between($now, $now->addDays(7)) && $fill < $threshold;
        })->map(function ($event) use ($threshold) {
            $capacity = max(1, (int) $event['capacity']); $fill = round(((int) $event['registrations'] / $capacity) * 100, 2);
            return ['fingerprint' => 'event_fill:'.$event['id'], 'rule' => 'event_fill', 'domain' => 'events', 'severity' => 'warning', 'title' => 'Événement peu rempli', 'summary' => sprintf('%s est rempli à %.1f%% à moins de 7 jours.', $event['title'], $fill), 'metric_key' => 'events.fill_rate.'.$event['id'], 'current_value' => $fill, 'baseline_value' => $threshold, 'delta_percent' => null, 'context' => $event, 'mission_blueprint' => ['title' => 'Relancer les inscriptions à '.$event['title'], 'objective' => 'Examiner cet événement et préparer une action de relance sans envoyer de message automatiquement.', 'priority' => 'normal', 'steps' => [['tool' => 'events.list', 'arguments' => ['limit' => 100]]]]];
        })->values()->all();
    }

    private function communitySilenceSignals(TowerObservatorySnapshot $snapshot): array
    {
        $latest = data_get($snapshot->metrics, 'community.latestPostAt');
        $threshold = (int) config('mission-tower.observatory.community_silence_hours', 72);
        $postCount = (int) data_get($snapshot->metrics, 'community.recentPostCount', 0);

        if ($postCount === 0 || ! $latest) {
            return [[
                'fingerprint' => 'community_silence', 'rule' => 'community_silence', 'domain' => 'community', 'severity' => 'info', 'title' => 'Communauté silencieuse',
                'summary' => 'Aucune publication visible n’est disponible dans la communauté.', 'metric_key' => 'community.silence_hours', 'current_value' => null, 'baseline_value' => $threshold, 'delta_percent' => null, 'context' => ['latestPostAt' => null, 'recentPostCount' => 0],
                'mission_blueprint' => ['title' => 'Réactiver la communauté', 'objective' => 'Analyser la communauté et préparer une mission éditoriale pour lancer ou relancer les échanges.', 'priority' => 'normal', 'steps' => [['tool' => 'community.posts.list', 'arguments' => ['limit' => 100]]]],
            ]];
        }

        $hours = CarbonImmutable::parse($latest)->diffInHours(now());
        if ($hours < $threshold) return [];
        return [[
            'fingerprint' => 'community_silence', 'rule' => 'community_silence', 'domain' => 'community', 'severity' => $hours >= 168 ? 'warning' : 'info', 'title' => 'Communauté silencieuse',
            'summary' => sprintf('Aucune nouvelle publication depuis environ %d heures.', $hours), 'metric_key' => 'community.silence_hours', 'current_value' => $hours, 'baseline_value' => $threshold, 'delta_percent' => null, 'context' => ['latestPostAt' => $latest, 'recentPostCount' => $postCount],
            'mission_blueprint' => ['title' => 'Réactiver la communauté', 'objective' => 'Analyser les publications récentes et préparer une mission éditoriale pour relancer les échanges.', 'priority' => 'normal', 'steps' => [['tool' => 'community.posts.list', 'arguments' => ['limit' => 100]]]],
        ]];
    }

    private function aiCostSpikeSignals(TowerObservatorySnapshot $snapshot, ?TowerObservatorySnapshot $previous): array
    {
        $current = (float) data_get($snapshot->metrics, 'ai.estimatedCostCents24h', 0);
        $baseline = (float) data_get($snapshot->metrics, 'ai.estimatedCostCentsPrevious24h', 0);
        $minimum = (float) config('mission-tower.observatory.ai_cost_min_baseline_cents', 100);
        if ($baseline < $minimum || $current <= $baseline) return [];
        $delta = (($current - $baseline) / $baseline) * 100;
        $threshold = (float) config('mission-tower.observatory.ai_cost_spike_pct', 50);
        if ($delta < $threshold) return [];
        return [[
            'fingerprint' => 'ai_cost_spike', 'rule' => 'ai_cost_spike', 'domain' => 'ai', 'severity' => $delta >= 100 ? 'warning' : 'info', 'title' => 'Coût Tutor AI en hausse',
            'summary' => sprintf('Le coût Tutor estimé des dernières 24 h est passé de %.2f à %.2f par rapport aux 24 h précédentes.', $baseline / 100, $current / 100),
            'metric_key' => 'ai.estimated_cost_cents_24h', 'current_value' => $current, 'baseline_value' => $baseline, 'delta_percent' => round($delta, 2),
            'context' => ['providers' => data_get($snapshot->metrics, 'ai.providers', []), 'coverage' => 'tutor_only'],
            'mission_blueprint' => ['title' => 'Auditer les coûts AI', 'objective' => 'Analyser l’usage des providers et identifier les postes de coût sans modifier la configuration automatiquement.', 'priority' => 'normal', 'steps' => [['tool' => 'ai.usage.summary', 'arguments' => []]]],
        ]];
    }
}
