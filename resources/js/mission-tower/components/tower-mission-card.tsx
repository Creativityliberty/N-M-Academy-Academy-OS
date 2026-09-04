import { Link } from '@inertiajs/react';
import { ArrowUpRight, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Props = {
    mission: { id: number; title: string; status: string };
    run?: { id: number; status: string } | null;
};

export function TowerMissionCard({ mission, run }: Props) {
    return (
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                    <Route className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{mission.title}</p>
                        <TowerStatusBadge status={mission.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Mission #{mission.id}{run ? ` · Run #${run.id} · ${run.status}` : ''}
                    </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0">
                    <Link href={`/tower/missions/${mission.id}`}>
                        Ouvrir
                        <ArrowUpRight className="ml-1.5 size-3.5" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
