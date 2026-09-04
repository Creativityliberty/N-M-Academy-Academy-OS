import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { academy } = usePage().props;

    return (
        <header className="sticky top-0 z-40 flex h-[68px] shrink-0 items-center justify-between gap-4 border-b border-black/[0.045] bg-bg-page/88 px-4 backdrop-blur-xl transition-[width,height] ease-linear sm:px-6 dark:border-white/[0.06]">
            <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="-ml-1 size-8 rounded-lg text-muted-foreground hover:bg-brand-primary-soft hover:text-brand-secondary" />
                <div className="min-w-0">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                    {academy.descriptor}
                </span>
            </div>
        </header>
    );
}
