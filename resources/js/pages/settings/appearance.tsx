import { Head, usePage } from '@inertiajs/react';
import { Palette } from 'lucide-react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { academy } = usePage().props;

    return (
        <>
            <Head title="Apparence" />

            <h1 className="sr-only">Apparence</h1>

            <div className="space-y-8">
                <section className="space-y-5">
                    <Heading
                        variant="small"
                        title="Interface"
                        description="Choisissez le mode d’affichage qui vous convient."
                    />
                    <AppearanceTabs />
                </section>

                <section className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                            <Palette
                                className="size-[18px]"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold tracking-[-0.015em]">
                                Thème de l’académie
                            </h2>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                Le branding de cette instance est piloté par le
                                Theme Engine et peut être remplacé au
                                déploiement sans modifier l’interface.
                            </p>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-bg-soft p-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Identité
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {academy.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {academy.theme.preset} · rayon{' '}
                                        {academy.theme.radius}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-bg-soft p-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Palette active
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        {[
                                            academy.theme.primary,
                                            academy.theme.primarySoft,
                                            academy.theme.secondary,
                                            academy.theme.accent,
                                        ].map((color) => (
                                            <span
                                                key={color}
                                                className="size-7 rounded-full border border-black/5 shadow-sm dark:border-white/10"
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Apparence',
            href: editAppearance(),
        },
    ],
};
