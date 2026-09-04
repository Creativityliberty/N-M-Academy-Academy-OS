import type { ReactNode } from 'react';

type DashboardSectionProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

export function DashboardSection({
    title,
    description,
    children,
}: DashboardSectionProps) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            {children}
        </section>
    );
}
