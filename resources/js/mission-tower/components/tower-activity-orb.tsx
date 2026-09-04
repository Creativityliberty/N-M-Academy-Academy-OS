import {
    ThinkingOrbVisual,
    type ThinkingOrbVisualState,
} from '@/components/ai/thinking-orb-visual';
import { cn } from '@/lib/utils';

type Props = {
    state?: ThinkingOrbVisualState;
    label?: string;
    detail?: string;
    className?: string;
};

export function TowerActivityOrb({
    state = 'working',
    label = 'Tower traite la demande…',
    detail = 'Analyse du contexte et orchestration des capacités autorisées.',
    className,
}: Props) {
    return (
        <div
            className={cn('flex items-center gap-3 py-2 text-sm', className)}
            role="status"
            aria-live="polite"
        >
            <ThinkingOrbVisual
                state={state}
                size={20}
                label={`${label} ${detail}`}
            />
            <div className="min-w-0">
                <p className="font-medium text-foreground">{label}</p>
                <p className="truncate text-xs text-muted-foreground">
                    {detail}
                </p>
            </div>
        </div>
    );
}
