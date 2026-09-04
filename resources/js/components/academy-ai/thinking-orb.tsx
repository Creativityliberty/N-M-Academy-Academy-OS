import {
    ThinkingOrbVisual,
    type ThinkingOrbVisualState,
} from '@/components/ai/thinking-orb-visual';
import { cn } from '@/lib/utils';

export type ThinkingOrbState = Extract<
    ThinkingOrbVisualState,
    | 'shaping'
    | 'weaving'
    | 'composing'
    | 'listening'
    | 'connecting'
    | 'solving'
    | 'breathing'
>;

type Props = {
    state: ThinkingOrbState;
    label: string;
    detail?: string | null;
    className?: string;
    size?: number;
};

const stateCopy: Record<ThinkingOrbState, string> = {
    shaping: 'Structuration',
    weaving: 'Assemblage',
    composing: 'Création',
    listening: 'Narration',
    connecting: 'Connexion',
    solving: 'Construction',
    breathing: 'Finalisation',
};

export function ThinkingOrb({ state, label, detail, className, size = 64 }: Props) {
    const scaleFactor = size > 64 ? size / 64 : 1;

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-6 text-center',
                className,
            )}
            data-orb-state={state}
            role="status"
            aria-live="polite"
        >
            <div className="grid place-items-center shrink-0 py-4">
                <div style={{ transform: `scale(${scaleFactor})` }} className="transition-transform duration-500">
                    <ThinkingOrbVisual
                        state={state}
                        size={64}
                        label={`${stateCopy[state]} : ${label}`}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                    {stateCopy[state]}
                </p>
                <p className="text-xl font-bold tracking-tight text-white">{label}</p>
                {detail && (
                    <p className="max-w-md text-sm leading-relaxed text-slate-300">
                        {detail}
                    </p>
                )}
            </div>
        </div>
    );
}
