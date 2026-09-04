import { Head, useForm } from '@inertiajs/react';
import { Bot, Image as ImageIcon, KeyRound, Mic2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Model = {
    id: string;
    label: string;
    tier?: string;
    max_size?: string;
    description?: string;
};

type Props = {
    settings: {
        text_provider: string;
        text_model: string;
        image_provider: string;
        image_model: string;
        image_size: string;
        image_prompt_preset: string;
        respect_branding: boolean;
        avoid_embedded_text: boolean;
        tts_provider: string;
        tts_model: string;
    };
    catalog: {
        text: Record<string, Model[]>;
        image: Record<string, Model[]>;
        speech: Record<string, Model[]>;
    };
    configuredSecrets: Record<string, boolean>;
};

function ProviderStatus({ configured }: { configured: boolean }) {
    return (
        <Badge variant={configured ? 'default' : 'secondary'}>
            {configured ? 'Secret configuré' : 'Secret absent'}
        </Badge>
    );
}

export default function AiProviders({ settings, catalog, configuredSecrets }: Props) {
    const [discovered, setDiscovered] = useState<Model[] | null>(null);
    const [discovering, setDiscovering] = useState(false);
    const form = useForm({
        text_provider: settings.text_provider,
        text_model: settings.text_model,
        image_provider: settings.image_provider,
        image_model: settings.image_model,
        image_size: settings.image_size,
        image_prompt_preset: settings.image_prompt_preset,
        respect_branding: settings.respect_branding,
        avoid_embedded_text: settings.avoid_embedded_text,
        tts_provider: settings.tts_provider,
        tts_model: settings.tts_model,
    });

    const imageModels = form.data.image_provider === 'gemini' && discovered
        ? discovered
        : (catalog.image[form.data.image_provider] ?? []);

    async function discoverGemini() {
        setDiscovering(true);
        try {
            const response = await fetch('/settings/ai-providers/discover-gemini', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
                },
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data.models)) setDiscovered(data.models);
        } finally {
            setDiscovering(false);
        }
    }

    return (
        <>
            <Head title="AI Providers" />
            <div className="space-y-8">
                <Heading
                    variant="small"
                    title="AI Providers"
                    description="Choisissez les moteurs par usage. Les clés API ne sont jamais affichées ni enregistrées dans cette page."
                />

                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.patch('/settings/ai-providers', { preserveScroll: true });
                    }}
                >
                    <section className="academy-panel space-y-5 rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                                <div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary"><Bot className="size-5" /></div>
                                <div><h2 className="font-semibold">Text generation</h2><p className="text-sm text-muted-foreground">Curriculum, réécriture, analyse et Tower.</p></div>
                            </div>
                            <ProviderStatus configured={configuredSecrets[form.data.text_provider] ?? false} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2"><Label>Provider</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.text_provider} onChange={(e) => { const provider=e.target.value; form.setData('text_provider', provider); const first=catalog.text[provider]?.[0]?.id ?? ''; form.setData('text_model', first); }}><option value="deepseek">DeepSeek</option><option value="openai">OpenAI</option><option value="disabled">Disabled</option></select></div>
                            <div className="space-y-2"><Label>Model</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.text_model} onChange={(e) => form.setData('text_model', e.target.value)} disabled={form.data.text_provider==='disabled'}>{(catalog.text[form.data.text_provider] ?? []).map((model) => <option key={model.id} value={model.id}>{model.label}</option>)}</select></div>
                        </div>
                    </section>

                    <section className="academy-panel space-y-5 rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3"><div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary"><ImageIcon className="size-5" /></div><div><h2 className="font-semibold">Image generation</h2><p className="text-sm text-muted-foreground">Gemini / Nano Banana devient le moteur par défaut pour covers et thumbnails.</p></div></div>
                            <ProviderStatus configured={configuredSecrets[form.data.image_provider] ?? false} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2"><Label>Provider</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.image_provider} onChange={(e) => { const provider=e.target.value; form.setData('image_provider', provider); const first=catalog.image[provider]?.[0]?.id ?? ''; form.setData('image_model', first); form.setData('image_size', provider==='gemini' && first==='gemini-3.1-flash-lite-image' ? '1K' : form.data.image_size); }}><option value="gemini">Gemini</option><option value="openai">OpenAI</option><option value="disabled">Disabled</option></select></div>
                            <div className="space-y-2"><div className="flex items-center justify-between gap-2"><Label>Model</Label>{form.data.image_provider==='gemini' && <Button type="button" variant="ghost" size="sm" onClick={discoverGemini} disabled={discovering}><RefreshCw className={`size-3.5 ${discovering ? 'animate-spin' : ''}`} /> Actualiser</Button>}</div><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.image_model} onChange={(e) => { form.setData('image_model', e.target.value); if (e.target.value==='gemini-3.1-flash-lite-image') form.setData('image_size','1K'); }} disabled={form.data.image_provider==='disabled'}>{imageModels.map((model) => <option key={model.id} value={model.id}>{model.label}{model.tier==='default' ? ' · Défaut' : ''}</option>)}</select></div>
                            <div className="space-y-2"><Label>Default quality</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.image_size} onChange={(e) => form.setData('image_size', e.target.value)} disabled={form.data.image_model==='gemini-3.1-flash-lite-image'}><option value="1K">1K</option><option value="2K">2K</option><option value="4K">4K</option></select>{form.data.image_model==='gemini-3.1-flash-lite-image' && <p className="text-xs text-muted-foreground">Nano Banana 2 Lite est limité à 1K.</p>}</div>
                            <div className="space-y-2"><Label>Prompt preset</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.image_prompt_preset} onChange={(e) => form.setData('image_prompt_preset', e.target.value)}><option value="academy-premium">Academy Premium</option><option value="editorial">Editorial</option><option value="cinematic">Cinematic</option><option value="minimal">Minimal</option></select></div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="flex items-center gap-3 rounded-xl border border-border/55 p-4"><input type="checkbox" checked={form.data.respect_branding} onChange={(e) => form.setData('respect_branding', e.target.checked)} /><span><span className="block text-sm font-semibold">Respect Academy branding</span><span className="text-xs text-muted-foreground">Injecte palette et direction visuelle dans le Prompt Compiler.</span></span></label>
                            <label className="flex items-center gap-3 rounded-xl border border-border/55 p-4"><input type="checkbox" checked={form.data.avoid_embedded_text} onChange={(e) => form.setData('avoid_embedded_text', e.target.checked)} /><span><span className="block text-sm font-semibold">Avoid embedded text</span><span className="text-xs text-muted-foreground">Le titre est normalement superposé par l’interface, pas dessiné dans l’image.</span></span></label>
                        </div>
                        {imageModels.find((model) => model.id===form.data.image_model)?.description && <p className="rounded-xl bg-bg-soft p-4 text-sm text-muted-foreground">{imageModels.find((model) => model.id===form.data.image_model)?.description}</p>}
                    </section>

                    <section className="academy-panel space-y-5 rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary"><Mic2 className="size-5" /></div><div><h2 className="font-semibold">Speech</h2><p className="text-sm text-muted-foreground">Narrations de leçons, indépendantes du modèle texte.</p></div></div><ProviderStatus configured={configuredSecrets[form.data.tts_provider] ?? false} /></div>
                        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Provider</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.tts_provider} onChange={(e) => { const provider=e.target.value; form.setData('tts_provider', provider); form.setData('tts_model', catalog.speech[provider]?.[0]?.id ?? ''); }}><option value="openai">OpenAI</option><option value="disabled">Disabled</option></select></div><div className="space-y-2"><Label>Model</Label><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.data.tts_model} onChange={(e) => form.setData('tts_model', e.target.value)} disabled={form.data.tts_provider==='disabled'}>{(catalog.speech[form.data.tts_provider] ?? []).map((model)=><option key={model.id} value={model.id}>{model.label}</option>)}</select></div></div>
                    </section>

                    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><KeyRound className="size-4" />Les secrets restent dans .env / Coolify et ne transitent jamais dans cette page.</div><Button disabled={form.processing}>Enregistrer</Button></div>
                </form>
            </div>
        </>
    );
}
