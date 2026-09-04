import { useForm } from '@inertiajs/react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

export type TowerApproval = {
    id: number;
    status: string;
    tool: string;
    risk: string;
    required_phrase?: string | null;
    expires_at?: string | null;
};

type Props = {
    threadId: number;
    approval: TowerApproval;
    arguments?: Record<string, unknown>;
    requiredPhrase?: string | null;
};

function flattenArguments(
    value: unknown,
    prefix = '',
    output: Array<{ key: string; value: string }> = [],
): Array<{ key: string; value: string }> {
    if (Array.isArray(value)) {
        if (value.every((entry) => ['string', 'number', 'boolean'].includes(typeof entry))) {
            output.push({ key: prefix || 'value', value: value.map(String).join(', ') });
            return output;
        }
        value.forEach((entry, index) => flattenArguments(entry, prefix ? `${prefix}.${index}` : String(index), output));
        return output;
    }

    if (value !== null && typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
            flattenArguments(child, prefix ? `${prefix}.${key}` : key, output);
        });
        return output;
    }

    output.push({ key: prefix || 'value', value: value === null ? 'null' : String(value) });
    return output;
}

export function TowerApprovalCard({
    threadId,
    approval,
    arguments: args = {},
    requiredPhrase,
}: Props) {
    const form = useForm({ decision: 'approve', phrase: '' });
    const pending = approval.status === 'pending';
    const phrase = approval.required_phrase ?? requiredPhrase ?? null;
    const argumentRows = flattenArguments(args);

    const submit = (decision: 'approve' | 'reject') => {
        form.setData('decision', decision);
        form.transform((data) => ({ ...data, decision }));
        form.post(`/tower/chat/${threadId}/approvals/${approval.id}/decision`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-500/5">
            <div className="flex items-start gap-3 border-b border-amber-500/15 p-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <ShieldAlert className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">Validation requise</p>
                        <TowerStatusBadge status={approval.risk} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Tool : <code className="font-mono">{approval.tool}</code>
                    </p>
                </div>
            </div>

            <div className="space-y-4 p-4">
                {argumentRows.length > 0 ? (
                    <details className="rounded-xl border border-border/70 bg-background/70 p-3 text-xs">
                        <summary className="cursor-pointer font-medium">Voir les paramètres</summary>
                        <dl className="mt-3 grid gap-2 sm:grid-cols-[minmax(120px,0.45fr)_minmax(0,1fr)]">
                            {argumentRows.map((row) => (
                                <div key={`${row.key}-${row.value}`} className="contents">
                                    <dt className="truncate font-mono text-[11px] text-muted-foreground">{row.key}</dt>
                                    <dd className="min-w-0 break-words rounded-lg bg-muted/45 px-2.5 py-1.5 text-foreground">{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </details>
                ) : null}

                {phrase && pending ? (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Pour cette action sensible, recopiez exactement :</p>
                        <code className="block rounded-xl border border-border/70 bg-background px-3 py-2 text-xs">{phrase}</code>
                        <Input
                            value={form.data.phrase}
                            onChange={(event) => form.setData('phrase', event.target.value)}
                            placeholder="Phrase de confirmation"
                            autoComplete="off"
                        />
                    </div>
                ) : null}

                {pending ? (
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="outline" disabled={form.processing} onClick={() => submit('reject')}>
                            Refuser
                        </Button>
                        <Button
                            type="button"
                            disabled={form.processing || (Boolean(phrase) && form.data.phrase !== phrase)}
                            onClick={() => submit('approve')}
                        >
                            Approuver
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-4" />
                        Décision enregistrée : {approval.status}
                    </div>
                )}
            </div>
        </div>
    );
}
