import { Link } from '@inertiajs/react';
import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

export type TowerEvidenceItem = {
    id: number;
    type: string;
    status: string;
    receiptId?: string | null;
    summary?: string | null;
    recordedAt?: string | null;
};

type Props = {
    items: TowerEvidenceItem[];
    count?: number;
};

export function TowerEvidenceCard({ items, count }: Props) {
    if (items.length === 0 && !count) return null;

    return (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/15">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                    <FileCheck2 className="size-4 text-brand-primary" />
                    <p className="text-sm font-semibold">Evidence</p>
                    <span className="text-xs text-muted-foreground">{count ?? items.length} preuve(s)</span>
                </div>
                <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
                    <Link href="/tower/evidence">
                        Ledger
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                    </Link>
                </Button>
            </div>
            {items.length > 0 ? (
                <div className="divide-y divide-border/60">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-medium">{item.type.replaceAll('_', ' ')}</p>
                                    <TowerStatusBadge status={item.status} />
                                </div>
                                {item.summary ? (
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.summary}</p>
                                ) : null}
                            </div>
                            {item.receiptId ? (
                                <code className="max-w-[260px] truncate rounded bg-muted/60 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                                    {item.receiptId}
                                </code>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
