import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CircleDot,
    Play,
    ShieldCheck,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Mission = {
    id: number;
    title: string;
    objective: string;
    status: string;
    priority: string;
    owner?: { name: string } | null;
    steps: Array<{
        id: number;
        position: number;
        title: string;
        tool: string;
        risk: string;
        arguments: Record<string, unknown>;
        status: string;
        errorMessage?: string | null;
    }>;
    runs: Array<{
        id: number;
        status: string;
        attempt: number;
        triggeredBy?: string | null;
        summary?: string | null;
        errorMessage?: string | null;
    }>;
    approvals: Array<{
        id: number;
        tool: string;
        risk: string;
        status: string;
        message: string;
        requiredPhrase?: string | null;
        receiptId?: string | null;
    }>;
    evidence: Array<{
        id: number;
        uuid: string;
        type: string;
        status: string;
        source: string;
        receiptId?: string | null;
        summary?: string | null;
    }>;
};

export default function TowerMissionShow({ mission }: { mission: Mission }) {
    const active = ['running', 'awaiting_approval'].includes(mission.status);

    return (
        <>
            <Head title={`Mission Tower — ${mission.title}`} />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title={mission.title}
                    description={mission.objective}
                />
                <TowerNav />
                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild variant="outline">
                        <Link href="/tower/missions">
                            <ArrowLeft className="size-4" /> Missions
                        </Link>
                    </Button>
                    <TowerStatusBadge status={mission.status} />
                    <span className="text-sm text-muted-foreground">
                        Priorité {mission.priority}
                    </span>
                    <Button
                        className="ml-auto"
                        disabled={active}
                        onClick={() =>
                            router.post(
                                `/tower/missions/${mission.id}/run`,
                                {},
                                { preserveScroll: true },
                            )
                        }
                    >
                        <Play className="size-4" />{' '}
                        {mission.runs.length ? 'Relancer' : 'Lancer'}
                    </Button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <DashboardSection
                        title="Plan"
                        description="Les étapes sont exécutées séquentiellement par Academy MCP."
                    >
                        <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            {mission.steps.map((step) => (
                                <div key={step.id} className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                            {step.status === 'succeeded' ? (
                                                <CheckCircle2 className="size-4" />
                                            ) : (
                                                <CircleDot className="size-4" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold">
                                                    {step.position}.{' '}
                                                    {step.title}
                                                </p>
                                                <TowerStatusBadge
                                                    status={step.status}
                                                />
                                                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    {step.risk}
                                                </span>
                                            </div>
                                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                                                {step.tool}
                                            </p>
                                            {Object.keys(step.arguments)
                                                .length ? (
                                                <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/50 p-3 text-xs leading-5">
                                                    {JSON.stringify(
                                                        step.arguments,
                                                        null,
                                                        2,
                                                    )}
                                                </pre>
                                            ) : null}
                                            {step.errorMessage ? (
                                                <p className="mt-3 text-sm text-destructive">
                                                    {step.errorMessage}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Approvals"
                        description="Les mutations restent gouvernées par M08."
                    >
                        <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            {mission.approvals.length === 0 ? (
                                <div className="p-6 text-sm text-muted-foreground">
                                    Aucune validation demandée.
                                </div>
                            ) : (
                                mission.approvals.map((approval) => (
                                    <div key={approval.id} className="p-5">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="size-4 text-brand-primary" />
                                            <TowerStatusBadge
                                                status={approval.status}
                                            />
                                        </div>
                                        <p className="mt-3 text-sm font-medium">
                                            {approval.message}
                                        </p>
                                        {approval.requiredPhrase ? (
                                            <p className="mt-2 rounded-lg bg-muted p-2 font-mono text-xs">
                                                {approval.requiredPhrase}
                                            </p>
                                        ) : null}
                                        {approval.status === 'pending' ? (
                                            <Button
                                                asChild
                                                className="mt-4"
                                                size="sm"
                                            >
                                                <Link href="/tower/approvals">
                                                    Ouvrir la validation
                                                </Link>
                                            </Button>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </div>
                    </DashboardSection>
                </div>

                <DashboardSection
                    title="Runs"
                    description="Une tentative reste distincte des autres et conserve son résultat."
                >
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {mission.runs.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">
                                Aucun run.
                            </div>
                        ) : (
                            mission.runs.map((run) => (
                                <div
                                    key={run.id}
                                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                                >
                                    <div>
                                        <p className="font-medium">
                                            Run #{run.id} · tentative{' '}
                                            {run.attempt}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {run.summary ??
                                                run.errorMessage ??
                                                `Déclenché par ${run.triggeredBy ?? 'Tower'}`}
                                        </p>
                                    </div>
                                    <TowerStatusBadge status={run.status} />
                                </div>
                            ))
                        )}
                    </div>
                </DashboardSection>

                <DashboardSection
                    title="Evidence"
                    description="Receipts MCP et décisions de gouvernance conservés comme preuves d'exécution."
                >
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {mission.evidence.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">
                                Aucune preuve enregistrée.
                            </div>
                        ) : (
                            mission.evidence.map((item) => (
                                <div key={item.id} className="p-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium">
                                            {item.type}
                                        </p>
                                        <TowerStatusBadge
                                            status={item.status}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.summary}
                                    </p>
                                    {item.receiptId ? (
                                        <p className="mt-2 font-mono text-xs text-muted-foreground">
                                            receipt {item.receiptId}
                                        </p>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
