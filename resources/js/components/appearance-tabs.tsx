import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Clair' },
        { value: 'dark', icon: Moon, label: 'Sombre' },
        { value: 'system', icon: Monitor, label: 'Système' },
    ];

    return (
        <div
            className={cn(
                'academy-panel inline-flex gap-1 rounded-xl p-1',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'academy-focus-ring flex items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                        appearance === value
                            ? 'bg-brand-primary-soft text-brand-secondary shadow-sm'
                            : 'text-muted-foreground hover:bg-bg-soft hover:text-foreground',
                    )}
                >
                    <Icon className="-ml-0.5 size-4" aria-hidden="true" />
                    <span className="ml-1.5">{label}</span>
                </button>
            ))}
        </div>
    );
}
