import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bot,
    Boxes,
    CheckCircle2,
    CircleAlert,
    Lightbulb,
    Network,
    ShieldCheck,
    TowerControl,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import { Button } from '@/components/ui/button';
import { ThinkingOrbVisual } from '@/components/ai/thinking-orb-visual';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Status = {
    ready: boolean;
    message: string;
    provider?: string;
    model?: string | null;
    configured?: boolean;
    connected?: boolean | null;
    toolCount?: number | null;
    enabled?: boolean;
};

type Props = {
    readiness: {
        ready: boolean;
        towerEnabled: boolean;
        ai: Status;
        academyMcp: Status;
        numflow: Status;
        harness: Status;
        fleet: Status;
    };
    observatory: {
        openInsights: number;
        capturedAt?: string | null;
        status?: string | null;
        metrics?: {
            sales?: { conversionRate?: number | null };
            learning?: { averageCompletion?: number; riskStudents?: number };
        } | null;
        topInsights: Array<{
            id: number;
            title: string;
            summary: string;
            severity: string;
            domain: string;
            missionId?: number | null;
        }>;
    };
    operations: {
        missions: number;
        activeMissions: number;
        pendingApprovals: number;
        runs: number;
        evidence: number;
        recentMissions: Array<{
            id: number;
            title: string;
            status: string;
            priority: string;
            updatedAt?: string | null;
        }>;
        recentEvidence: Array<{
            id: number;
            missionId: number;
            type: string;
            status: string;
            summary?: string | null;
            recordedAt?: string | null;
        }>;
    };
};

function StatusRow({ label, status }: { label: string; status: Status }) {
    const Icon = status.ready ? CheckCircle2 : CircleAlert;

    return (
        <div className="flex items-start justify-between gap-5 px-5 py-4">
            <div className="flex min-w-0 items-start gap-3">
                <div
                    className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${
                        status.ready
                            ? 'bg-brand-primary-soft text-brand-primary'
                            : 'bg-destructive/10 text-destructive'
                    }`}
                >
                    <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                        {label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {status.message}
                    </p>
                </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {status.ready ? 'Prêt' : 'À configurer'}
            </span>
        </div>
    );
}

export default function MissionTowerOverview() {
    const { readiness, operations, observatory } = usePage<Props>().props;

    return (
        <>
            <Head title="Mission Tower" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/60 to-background/80 p-6 backdrop-blur-xl shadow-lg sm:p-8">
                    <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Mission Tower
                                </h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-brand-primary"></span>
                                    </span>
                                    {readiness.ready ? 'Academy MCP Connecté' : 'Hors ligne'}
                                </span>
                            </div>
                            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Le poste de commandement autonome de votre Academy : missions gouvernées, approvals, preuves et signaux métier observés via Academy MCP.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center justify-center p-2 rounded-2xl bg-muted/20 border border-border/40 backdrop-blur-md">
                            <ThinkingOrbVisual state={readiness.ready ? 'breathing' : 'working'} size={64} label="Orb Tower State" />
                        </div>
                    </div>
                </div>

                <TowerNav />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        label="Missions"
                        value={operations.missions}
                        icon={TowerControl}
                    />
                    <MetricCard
                        label="Actives"
                        value={operations.activeMissions}
                        icon={Bot}
                    />
                    <MetricCard
                        label="Approvals"
                        value={operations.pendingApprovals}
                        icon={Network}
                    />
                    <MetricCard
                        label="Evidence"
                        value={operations.evidence}
                        icon={Boxes}
                    />
                    <MetricCard
                        label="Insights ouverts"
                        value={observatory.openInsights}
                        icon={Lightbulb}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <DashboardSection
                        title="Missions récentes"
                        description="Le poste de commandement reste dans le même shell Academy."
                    >
                        <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            {operations.recentMissions.length === 0 ? (
                                <div className="p-6 text-sm text-muted-foreground">
                                    Aucune mission. Créez votre première mission
                                    gouvernée.
                                </div>
                            ) : (
                                operations.recentMissions.map((mission) => (
                                    <Link
                                        key={mission.id}
                                        href={`/tower/missions/${mission.id}`}
                                        className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {mission.title}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Priorité {mission.priority}
                                            </p>
                                        </div>
                                        <TowerStatusBadge
                                            status={mission.status}
                                        />
                                    </Link>
                                ))
                            )}
                        </div>
                    </DashboardSection>
                    <DashboardSection
                        title="Evidence récente"
                        description="Receipts et décisions enregistrés par Tower."
                    >
                        <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            {operations.recentEvidence.length === 0 ? (
                                <div className="p-6 text-sm text-muted-foreground">
                                    Aucune preuve pour le moment.
                                </div>
                            ) : (
                                operations.recentEvidence.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/tower/missions/${item.missionId}`}
                                        className="block p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">
                                                {item.type}
                                            </p>
                                            <TowerStatusBadge
                                                status={item.status}
                                            />
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                            {item.summary}
                                        </p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </DashboardSection>
                </div>

                <DashboardSection
                    title="Academy Observatory"
                    description="Les signaux prioritaires détectés automatiquement via Academy MCP."
                >
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {observatory.topInsights.length === 0 ? (
                            <div className="flex items-center justify-between gap-4 p-5">
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Aucun signal ouvert
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        L’Observatory conserve les snapshots et
                                        n’invente pas d’alerte quand les sources
                                        sont incomplètes.
                                    </p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/tower/insights">
                                        Ouvrir Insights
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            observatory.topInsights.map((item) => (
                                <Link
                                    key={item.id}
                                    href="/tower/insights"
                                    className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-medium">
                                                {item.title}
                                            </p>
                                            <TowerStatusBadge
                                                status={item.severity}
                                            />
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                            {item.summary}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </DashboardSection>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <DashboardSection
                        title="Readiness"
                        description="Les connexions obligatoires et optionnelles de Mission Tower."
                    >
                        <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            <StatusRow
                                label="Provider IA"
                                status={readiness.ai}
                            />
                            <StatusRow
                                label="Academy MCP"
                                status={readiness.academyMcp}
                            />
                            <StatusRow
                                label="NümFlow"
                                status={readiness.numflow}
                            />
                            <StatusRow
                                label="Harness"
                                status={readiness.harness}
                            />
                            <StatusRow
                                label="Fleet / Coolify"
                                status={readiness.fleet}
                            />
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Lancer Tower"
                        description="Le setup minimal tient en trois étapes."
                    >
                        <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5">
                            <ol className="space-y-5 text-sm">
                                <li className="flex gap-3">
                                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-primary-soft text-xs font-semibold text-brand-primary">
                                        1
                                    </span>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Activer Tower
                                        </p>
                                        <p className="mt-1 leading-6 text-muted-foreground">
                                            TOWER_ENABLED=true et
                                            ACADEMY_FEATURE_TOWER=true.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-primary-soft text-xs font-semibold text-brand-primary">
                                        2
                                    </span>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Créer son identité MCP
                                        </p>
                                        <p className="mt-1 leading-6 text-muted-foreground">
                                            Un bearer token dédié à Tower,
                                            jamais le mot de passe d'un
                                            utilisateur.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-primary-soft text-xs font-semibold text-brand-primary">
                                        3
                                    </span>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            Vérifier la connexion
                                        </p>
                                        <p className="mt-1 leading-6 text-muted-foreground">
                                            Le probe appelle réellement Academy
                                            MCP et compte les tools accessibles.
                                        </p>
                                    </div>
                                </li>
                            </ol>

                            <Button asChild className="mt-6 w-full sm:w-auto">
                                <Link href="/tower?probe=1">
                                    <Activity className="size-4" />
                                    Vérifier maintenant
                                </Link>
                            </Button>
                        </div>
                    </DashboardSection>
                </div>

                <DashboardSection
                    title="Architecture"
                    description="Tower reste un module isolé, mais conserve le shell et le Theme Engine de l'Academy."
                >
                    <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-border/70 p-4">
                                <TowerControl className="size-5 text-brand-primary" />
                                <h3 className="mt-3 font-semibold text-foreground">
                                    Mission Tower
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    Missions, approvals, runs, evidence.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/70 p-4">
                                <Network className="size-5 text-brand-primary" />
                                <h3 className="mt-3 font-semibold text-foreground">
                                    Academy MCP
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    Frontière métier et gouvernance des actions.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/70 p-4">
                                <ShieldCheck className="size-5 text-brand-primary" />
                                <h3 className="mt-3 font-semibold text-foreground">
                                    NümFlow + Harness
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    Bridges optionnels pour durable execution et
                                    gouvernance forte.
                                </p>
                            </div>
                        </div>
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
