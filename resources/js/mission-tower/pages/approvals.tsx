import { Head, Link, router } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Approval = {
    id: number;
    mission: { id: number; title: string };
    stepTitle: string;
    tool: string;
    risk: string;
    status: string;
    message: string;
    arguments: Record<string, unknown>;
    requiredPhrase?: string | null;
    receiptId?: string | null;
};

export default function TowerApprovals({
    approvals,
}: {
    approvals: { data: Approval[] };
}) {
    const [phrases, setPhrases] = useState<Record<number, string>>({});

    const decide = (approval: Approval, decision: 'approve' | 'reject') => {
        router.post(
            `/tower/approvals/${approval.id}/decision`,
            { decision, phrase: phrases[approval.id] ?? '' },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Mission Tower — Approvals" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Approvals"
                    description="Toutes les actions mutantes passent ici avant exécution. Les actions sensibles exigent en plus la phrase exacte fournie par Academy MCP."
                />
                <TowerNav />
                <DashboardSection
                    title="Centre de validation"
                    description="Tower ne contourne pas M08 : il expose proprement son mécanisme d'approbation."
                >
                    <div className="space-y-4">
                        {approvals.data.length === 0 ? (
                            <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-8 text-center text-sm text-muted-foreground">
                                Aucune validation.
                            </div>
                        ) : (
                            approvals.data.map((approval) => (
                                <div
                                    key={approval.id}
                                    className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <ShieldCheck className="size-5 text-brand-primary" />
                                                <TowerStatusBadge
                                                    status={approval.status}
                                                />
                                                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                    {approval.risk}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/tower/missions/${approval.mission.id}`}
                                                className="mt-3 block text-lg font-semibold hover:text-brand-primary"
                                            >
                                                {approval.mission.title}
                                            </Link>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {approval.stepTitle} ·{' '}
                                                <span className="font-mono">
                                                    {approval.tool}
                                                </span>
                                            </p>
                                        </div>
                                        {approval.receiptId ? (
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {approval.receiptId}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-5 text-sm leading-6">
                                        {approval.message}
                                    </p>
                                    {Object.keys(approval.arguments).length ? (
                                        <pre className="mt-4 overflow-x-auto rounded-xl bg-muted/50 p-3 text-xs leading-5">
                                            {JSON.stringify(
                                                approval.arguments,
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    ) : null}
                                    {approval.status === 'pending' ? (
                                        <div className="mt-5 space-y-3">
                                            {approval.requiredPhrase ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-muted-foreground">
                                                        Tapez exactement :
                                                    </p>
                                                    <p className="rounded-lg bg-muted p-2 font-mono text-xs">
                                                        {
                                                            approval.requiredPhrase
                                                        }
                                                    </p>
                                                    <Input
                                                        value={
                                                            phrases[
                                                                approval.id
                                                            ] ?? ''
                                                        }
                                                        onChange={(event) =>
                                                            setPhrases(
                                                                (current) => ({
                                                                    ...current,
                                                                    [approval.id]:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        placeholder={
                                                            approval.requiredPhrase
                                                        }
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="flex flex-wrap gap-3">
                                                <Button
                                                    onClick={() =>
                                                        decide(
                                                            approval,
                                                            'approve',
                                                        )
                                                    }
                                                    disabled={Boolean(
                                                        approval.requiredPhrase &&
                                                        phrases[approval.id] !==
                                                            approval.requiredPhrase,
                                                    )}
                                                >
                                                    Approuver
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        decide(
                                                            approval,
                                                            'reject',
                                                        )
                                                    }
                                                >
                                                    Refuser
                                                </Button>
                                            </div>
                                        </div>
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
