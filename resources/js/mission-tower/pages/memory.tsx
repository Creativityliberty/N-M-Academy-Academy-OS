import { Head, Link, router } from '@inertiajs/react';
import { Brain, Pin, PinOff, Trash2 } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Memory = {
    id: number;
    key: string;
    category: string;
    scope: string;
    status: string;
    content: string;
    importance: number;
    pinned: boolean;
    sourceType: string;
    accessCount: number;
    lastAccessedAt?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
};

const categories = ['preference', 'decision', 'goal', 'constraint', 'result', 'context'];
const statuses = ['active', 'superseded', 'forgotten'];

export default function TowerMemory({
    memories,
    filters,
}: {
    memories: { data: Memory[] };
    filters: { status?: string; category?: string };
}) {
    const href = (next: { status?: string; category?: string }) => {
        const params = new URLSearchParams();
        const status = next.status ?? filters.status;
        const category = next.category ?? filters.category;
        if (status) params.set('status', status);
        if (category) params.set('category', category);
        return `/tower/memory${params.size ? `?${params.toString()}` : ''}`;
    };

    return (
        <>
            <Head title="Mission Tower — Memory" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Memory"
                    description="Mémoire durable et inspectable de Tower : décisions, préférences, contraintes, objectifs et résultats utiles, séparés du transcript brut du chat."
                />
                <TowerNav />
                <DashboardSection
                    title="Memory Center"
                    description="Tower ne réinjecte qu’un petit ensemble de souvenirs pertinents. Tu peux épingler ce qui doit rester prioritaire ou oublier une mémoire sans modifier l’historique Evidence/Chat."
                >
                    <div className="mb-4 flex flex-wrap gap-2">
                        <Link className="rounded-lg border px-3 py-1.5 text-xs" href="/tower/memory">Tout</Link>
                        {statuses.map((status) => (
                            <Link key={status} className="rounded-lg border px-3 py-1.5 text-xs" href={href({ status })}>{status}</Link>
                        ))}
                        <span className="mx-1 h-7 w-px bg-border" />
                        {categories.map((category) => (
                            <Link key={category} className="rounded-lg border px-3 py-1.5 text-xs" href={href({ category })}>{category}</Link>
                        ))}
                    </div>
                    <div className="academy-panel divide-y divide-border/70 overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {memories.data.length === 0 ? (
                            <div className="p-10 text-center text-sm text-muted-foreground">Aucune mémoire pour ce filtre.</div>
                        ) : memories.data.map((memory) => (
                            <div key={memory.id} className="p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex min-w-0 flex-1 gap-3">
                                        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary"><Brain className="size-4" /></div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold">{memory.key}</p>
                                                <TowerStatusBadge status={memory.status} />
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{memory.category} · {memory.scope} · I{memory.importance}</span>
                                                {memory.pinned ? <Pin className="size-3.5 text-brand-primary" /> : null}
                                            </div>
                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{memory.content}</p>
                                            <p className="mt-3 text-[11px] text-muted-foreground">source {memory.sourceType} · utilisée {memory.accessCount}×{memory.expiresAt ? ` · expire ${new Date(memory.expiresAt).toLocaleDateString()}` : ' · sans expiration'}</p>
                                        </div>
                                    </div>
                                    {memory.status === 'active' ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => router.post(`/tower/memory/${memory.id}/pin`)}>
                                                {memory.pinned ? <PinOff className="mr-2 size-4" /> : <Pin className="mr-2 size-4" />}{memory.pinned ? 'Désépingler' : 'Épingler'}
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => router.post(`/tower/memory/${memory.id}/forget`)}>
                                                <Trash2 className="mr-2 size-4" />Oublier
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
