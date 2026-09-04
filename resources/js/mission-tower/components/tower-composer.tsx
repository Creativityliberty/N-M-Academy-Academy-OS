import { Send } from 'lucide-react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    maxLength: number;
    error?: string;
};

export function TowerComposer({
    value,
    onChange,
    onSubmit,
    processing,
    maxLength,
    error,
}: Props) {
    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <form onSubmit={onSubmit} className="sticky bottom-0 z-10 border-t border-border/70 bg-background/88 p-4 backdrop-blur-xl sm:p-5">
            <div className="rounded-2xl border border-border/70 bg-background p-2 shadow-[0_-12px_40px_-28px_rgba(0,0,0,0.28)] transition-colors focus-within:border-brand-primary/40">
                <Textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={onKeyDown}
                    maxLength={maxLength}
                    rows={3}
                    placeholder="Parlez à Mission Tower…"
                    className="resize-none border-0 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center justify-between gap-3 px-2 pb-1">
                    <span className="text-[11px] text-muted-foreground">
                        ⌘/Ctrl + Entrée pour envoyer · WRITE/SENSITIVE → validation
                    </span>
                    <Button type="submit" size="sm" disabled={processing || !value.trim()}>
                        <Send className="mr-2 size-4" />
                        {processing ? 'Traitement…' : 'Envoyer'}
                    </Button>
                </div>
            </div>
            {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
        </form>
    );
}
