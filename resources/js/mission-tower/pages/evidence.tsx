import { Head, Link } from '@inertiajs/react';
import { FileCheck2 } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Evidence = {
    id: number;
    uuid: string;
    mission: { id: number; title: string };
    stepTitle?: string | null;
    tool?: string | null;
    type: string;
    status: string;
    source: string;
    receiptId?: string | null;
    summary?: string | null;
};

export default function TowerEvidence({
    evidence,
}: {
    evidence: { data: Evidence[] };
}) {
    return (
        <>
            <Head title="Mission Tower — Evidence" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Evidence"
                    description="Ledger lisible des receipts MCP, validations et résultats de mission. Cette couche prépare directement le futur bridge NÜM Harness."
                />
                <TowerNav />
                <DashboardSection
                    title="Preuves d'exécution"
                    description="Les receipts restent reliés à leur mission, run et étape d'origine."
                >
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {evidence.data.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Aucune preuve.
                            </div>
                        ) : (
                            evidence.data.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/tower/missions/${item.mission.id}`}
                                    className="block p-5 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex min-w-0 gap-3">
                                            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                                <FileCheck2 className="size-4" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">
                                                        {item.type}
                                                    </p>
                                                    <TowerStatusBadge
                                                        status={item.status}
                                                    />
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {item.mission.title}
                                                    {item.stepTitle
                                                        ? ` · ${item.stepTitle}`
                                                        : ''}
                                                </p>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {item.summary}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right font-mono text-[11px] text-muted-foreground">
                                            <p>{item.source}</p>
                                            {item.receiptId ? (
                                                <p className="mt-1">
                                                    {item.receiptId}
                                                </p>
                                            ) : null}
                                        </div>
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
