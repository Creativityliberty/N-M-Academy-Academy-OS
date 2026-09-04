import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({
    variant = 'sidebar',
    children,
    className,
    ...props
}: Props) {
    const childrenArray = React.Children.toArray(children);
    const [header, ...content] = childrenArray;

    if (variant === 'sidebar') {
        return (
            <SidebarInset
                className={cn(
                    'flex h-svh min-w-0 flex-1 flex-col overflow-hidden bg-bg-page',
                    className,
                )}
                {...props}
            >
                {header}

                <div className="min-h-0 flex-1 overflow-y-auto">{content}</div>
            </SidebarInset>
        );
    }

    return (
        <main
            className={cn(
                'mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl',
                className,
            )}
            {...props}
        >
            {children}
        </main>
    );
}
