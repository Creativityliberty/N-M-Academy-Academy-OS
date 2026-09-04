import { usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

type DashboardHeroProps = {
    eyebrow?: string;
    title: string;
    description: string;
};

export function DashboardHero({
    eyebrow,
    title,
    description,
}: DashboardHeroProps) {
    const props = usePage().props as any;
    const firstName = props.auth?.user?.name?.trim().split(/\s+/)[0];

    return (
        <section className="academy-surface relative overflow-hidden rounded-[calc(var(--radius)*1.35)] px-6 py-7 sm:px-8 sm:py-8">
            <div
                aria-hidden="true"
                className="absolute -top-20 -right-16 size-64 rounded-full bg-brand-primary-soft/80 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-24 left-1/3 size-48 rounded-full bg-brand-accent/10 blur-3xl"
            />

            <div className="relative max-w-2xl">
                {eyebrow ? (
                    <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand-primary uppercase">
                        {eyebrow}
                    </p>
                ) : null}
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary">
                    <Sparkles className="size-4.5" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
                    {firstName ? `${title}, ${firstName}` : title}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                    {description}
                </p>
                <p className="mt-5 text-xs font-medium tracking-wide text-brand-primary">
                    {props.academy?.name ?? 'NÜM Academy'}
                </p>
            </div>
        </section>
    );
}
