import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
    const { academy } = usePage().props;

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <AppLogoIcon className="size-9 rounded-xl shadow-md border border-amber-500/30" />
            <span className="text-base font-bold tracking-[-0.025em] whitespace-nowrap text-foreground md:text-lg">
                {academy?.name || 'NÜM Academy'}
            </span>
        </div>
    );
}
