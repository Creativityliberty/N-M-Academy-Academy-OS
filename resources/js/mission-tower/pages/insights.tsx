import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    CircleAlert,
    Coins,
    GraduationCap,
    Lightbulb,
    MessageSquareText,
    RefreshCw,
    ShoppingCart,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import { Button } from '@/components/ui/button';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Snapshot = {
    id: number;
    status: string;
    metrics: {
        sales?: {
            conversionRate?: number | null;
            activeMemberships?: number;
            monthlyChurnRate?: number | null;
            revenueByCurrency?: Array<{
                currency: string;
                net: number;
                refundRate: number;
            }>;
        };
        learning?: {
            students?: number;
            averageCompletion?: number;
            riskStudents?: number;
            riskRate?: number;
        };
        community?: {
            recentPostCount?: number;
            latestPostAt?: string | null;
            comments?: number;
            reactions?: number;
        };
        events?: { count?: number };
        ai?: {
            creatorRuns30d?: number;
            tutorRuns30d?: number;
            estimatedCostCents30d?: number;
            inputTokens30d?: number;
            outputTokens30d?: number;
        };
    };
    errors?: Record<string, string> | null;
    capturedAt?: string | null;
};

type Insight = {
    id: number;
    rule: string;
    domain: string;
    severity: string;
    status: string;
    title: string;
    summary: string;
    currentValue?: number | null;
    baselineValue?: number | null;
    deltaPercent?: number | null;
    missionId?: number | null;
    lastSeenAt?: string | null;
};

type Props = {
    snapshot: Snapshot | null;
    insights: { data: Insight[] };
    observatory: { enabled: boolean; schedule: string };
};

const domainIcons: Record<string, LucideIcon> = {
    sales: ShoppingCart,
    learning: GraduationCap,
    community: MessageSquareText,
    events: CalendarDays,
    ai: Sparkles,
};

function moneyFromCents(value?: number | null) {
    return ((value ?? 0) / 100).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function TowerInsights() {
    const { snapshot, insights, observatory } = usePage<Props>().props;
    const metrics = snapshot?.metrics;
    const open = insights.data.filter((item) =>
        ['open', 'mission_created'].includes(item.status),
    );

    const observe = () =>
        router.post('/tower/insights/observe', {}, { preserveScroll: true });
    const createMission = (id: number) =>
        router.post(`/tower/insights/${id}/mission`);

    return (
        <>
            <Head title="Mission Tower — Insights" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Academy Observatory"
                    description="Tower observe les signaux métier via Academy MCP, compare les snapshots et transforme les anomalies déterministes en insights actionnables."
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <TowerNav />
                    <Button onClick={observe} disabled={!observatory.enabled}>
                        <RefreshCw className="size-4" />
                        Observer maintenant
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Conversion"
                        value={
                            metrics?.sales?.conversionRate == null
                                ? '—'
                                : `${metrics.sales.conversionRate}%`
                        }
                        icon={ShoppingCart}
                    />
                    <MetricCard
                        label="Complétion"
                        value={`${metrics?.learning?.averageCompletion ?? 0}%`}
                        icon={GraduationCap}
                    />
                    <MetricCard
                        label="À risque"
                        value={metrics?.learning?.riskStudents ?? 0}
                        icon={CircleAlert}
                    />
                    <MetricCard
                        label="Coût Tutor estimé 30j"
                        value={moneyFromCents(
                            metrics?.ai?.estimatedCostCents30d,
                        )}
                        icon={Coins}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <DashboardSection
                        title="Insights actifs"
                        description={`${open.length} signal(s) actuellement ouverts.`}
                    >
                        <div className="space-y-3">
                            {open.length === 0 ? (
                                <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-6 text-sm text-muted-foreground">
                                    Aucun signal ouvert. Lancez une observation
                                    pour capturer l’état actuel de l’Academy.
                                </div>
                            ) : (
                                open.map((item) => {
                                    const Icon =
                                        domainIcons[item.domain] ?? Lightbulb;

                                    return (
                                        <div
                                            key={item.id}
                                            className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 gap-3">
                                                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                                        <Icon className="size-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-medium text-foreground">
                                                                {item.title}
                                                            </h3>
                                                            <TowerStatusBadge
                                                                status={
                                                                    item.severity
                                                                }
                                                            />
                                                        </div>
                                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                            {item.summary}
                                                        </p>
                                                    </div>
                                                </div>
                                                {item.missionId ? (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/tower/missions/${item.missionId}`}
                                                        >
                                                            Voir la mission
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            createMission(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        Créer la mission
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Dernier snapshot"
                        description={`Observation automatique toutes les ${observatory.schedule}.`}
                    >
                        <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5">
                            {!snapshot ? (
                                <p className="text-sm text-muted-foreground">
                                    Aucun snapshot disponible.
                                </p>
                            ) : (
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">
                                            État
                                        </span>
                                        <TowerStatusBadge
                                            status={snapshot.status}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">
                                            Étudiants
                                        </span>
                                        <span className="font-medium">
                                            {metrics?.learning?.students ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">
                                            Memberships actifs
                                        </span>
                                        <span className="font-medium">
                                            {metrics?.sales
                                                ?.activeMemberships ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">
                                            Événements à venir
                                        </span>
                                        <span className="font-medium">
                                            {metrics?.events?.count ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">
                                            Runs AI 30j
                                        </span>
                                        <span className="font-medium">
                                            {(metrics?.ai?.creatorRuns30d ??
                                                0) +
                                                (metrics?.ai?.tutorRuns30d ??
                                                    0)}
                                        </span>
                                    </div>
                                    {snapshot.errors &&
                                    Object.keys(snapshot.errors).length > 0 ? (
                                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs leading-5 text-destructive">
                                            Certaines sources MCP n’ont pas
                                            répondu. Le snapshot est conservé
                                            comme partiel sans inventer les
                                            métriques manquantes.
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </DashboardSection>
                </div>

                <DashboardSection
                    title="Historique des signaux"
                    description="Les signaux résolus restent conservés pour comprendre ce qui a changé."
                >
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {insights.data.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                        {item.summary}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TowerStatusBadge status={item.severity} />
                                    <TowerStatusBadge status={item.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
