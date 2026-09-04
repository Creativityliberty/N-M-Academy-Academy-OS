import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { academy } = usePage().props;

    return (
        <>
            <AppLogoIcon />
            <div className="ml-2.5 grid min-w-0 flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold tracking-[-0.01em] text-foreground">
                    {academy.name}
                </span>
                <span className="truncate text-[11px] leading-4 text-muted-foreground">
                    {academy.descriptor}
                </span>
            </div>
        </>
    );
}
