import { Head, Link } from '@inertiajs/react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Run = {
    id: number;
    mission: { id: number; title: string };
    status: string;
    attempt: number;
    triggeredBy?: string | null;
    approvalsCount: number;
    evidenceCount: number;
    summary?: string | null;
    errorMessage?: string | null;
};

export default function TowerRuns({ runs }: { runs: { data: Run[] } }) {
    return (
        <>
            <Head title="Mission Tower — Runs" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Runs"
                    description="Chaque tentative d'exécution possède son propre état, ses validations et ses preuves. Relancer une mission ne réécrit pas l'historique précédent."
                />
                <TowerNav />
                <DashboardSection
                    title="Historique d'exécution"
                    description="Vue opératoire des missions exécutées par Tower."
                >
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {runs.data.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Aucun run.
                            </div>
                        ) : (
                            runs.data.map((run) => (
                                <Link
                                    key={run.id}
                                    href={`/tower/missions/${run.mission.id}`}
                                    className="flex flex-wrap items-center justify-between gap-5 p-5 transition-colors hover:bg-muted/40"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">
                                                {run.mission.title}
                                            </p>
                                            <TowerStatusBadge
                                                status={run.status}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Run #{run.id} · tentative{' '}
                                            {run.attempt} · {run.approvalsCount}{' '}
                                            approvals · {run.evidenceCount}{' '}
                                            preuves
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {run.summary ??
                                                run.errorMessage ??
                                                `Déclenché par ${run.triggeredBy ?? 'Tower'}`}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
