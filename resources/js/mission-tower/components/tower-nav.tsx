import { Link, usePage } from '@inertiajs/react';
import {
    Brain,
    CheckSquare2,
    FileCheck2,
    Gauge,
    Lightbulb,
    MessagesSquare,
    ListChecks,
    PlayCircle,
    WandSparkles,
} from 'lucide-react';

const items = [
    { href: '/tower/chat', label: 'Chat', icon: MessagesSquare },
    { href: '/tower', label: 'Overview', icon: Gauge },
    { href: '/tower/memory', label: 'Memory', icon: Brain },
    { href: '/tower/compiler', label: 'Compiler', icon: WandSparkles },
    { href: '/tower/missions', label: 'Missions', icon: ListChecks },
    { href: '/tower/approvals', label: 'Approvals', icon: CheckSquare2 },
    { href: '/tower/runs', label: 'Runs', icon: PlayCircle },
    { href: '/tower/evidence', label: 'Evidence', icon: FileCheck2 },
    { href: '/tower/insights', label: 'Insights', icon: Lightbulb },
];

export function TowerNav() {
    const current = usePage().url;

    return (
        <nav className="flex flex-wrap gap-2">
            {items.map(({ href, label, icon: Icon }) => {
                const active =
                    href === '/tower'
                        ? current === href
                        : current.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                            active
                                ? 'border-brand-primary/30 bg-brand-primary-soft text-brand-primary'
                                : 'border-border/70 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
