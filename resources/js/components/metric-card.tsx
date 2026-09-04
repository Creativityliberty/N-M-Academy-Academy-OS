import type { LucideIcon } from 'lucide-react';

type MetricCardProps = {
    label: string;
    value: number | string;
    icon: LucideIcon;
};

export function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
    return (
        <article className="academy-panel group rounded-[calc(var(--radius)*1.05)] p-5 transition-transform duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[13px] font-medium text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                        {value}
                    </p>
                </div>
                <div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary transition-transform duration-200 group-hover:scale-105">
                    <Icon className="size-[18px]" aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}
