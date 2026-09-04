import { CheckCircle2, CircleAlert, LoaderCircle, Wrench } from 'lucide-react';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';
import { cn } from '@/lib/utils';

export type TowerToolStep = {
    id?: number;
    title?: string | null;
    tool: string;
    risk?: string | null;
    status?: string | null;
    position?: number | null;
};

function StatusIcon({ status }: { status?: string | null }) {
    if (status === 'succeeded' || status === 'completed') {
        return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-300" />;
    }
    if (status === 'failed' || status === 'cancelled' || status === 'expired') {
        return <CircleAlert className="size-4 text-destructive" />;
    }
    if (status === 'running' || status === 'processing') {
        return <LoaderCircle className="size-4 motion-safe:animate-spin motion-reduce:animate-none" />;
    }
    return <Wrench className="size-4 text-muted-foreground" />;
}

export function TowerToolCard({ step }: { step: TowerToolStep }) {
    return (
        <div className="rounded-xl border border-border/70 bg-muted/20 px-3.5 py-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-background">
                    <StatusIcon status={step.status} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">{step.title || step.tool}</p>
                        {step.risk ? <TowerStatusBadge status={step.risk} /> : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono">{step.tool}</code>
                        {step.status ? <span className={cn('capitalize')}>{step.status.replaceAll('_', ' ')}</span> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
