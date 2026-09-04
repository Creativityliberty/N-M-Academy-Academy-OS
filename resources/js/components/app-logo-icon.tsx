import { usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: ComponentProps<'div'>) {
    const { academy } = usePage().props;

    const logoSource = academy?.logoUrl || '/images/logo-sun-moon-3d.jpg';

    return (
        <div
            className={cn(
                'grid aspect-square size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-amber-500/20 shadow-sm p-0.5',
                className,
            )}
            {...props}
        >
            <img
                src={logoSource}
                alt={`${academy?.name || 'NÜM Academy'} logo`}
                className="h-full w-full object-cover rounded-lg"
            />
        </div>
    );
}
