import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    ClipboardCheck,
    CheckCircle2,
    Circle,
    CircleAlert,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    LoaderCircle,
    Mic2,
    ReceiptText,
    RotateCcw,
    Sparkles,
    WandSparkles,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ThinkingOrb,
    type ThinkingOrbState,
} from '@/components/academy-ai/thinking-orb';
import { CosmicOrbCanvas } from '@/components/ai/thinking-orb-visual';
import { DashboardHero } from '@/components/dashboard-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ProviderStatus = {
    configured: boolean;
    provider: string;
    model: string;
};

type Category = { id: number; name: string };

type StepStatus = 'pending' | 'running' | 'done' | 'skipped' | 'failed';

type RunStep = {
    status: StepStatus;
    detail: string | null;
    reason: string | null;
};

type CourseCreationRun = {
    id: number;
    brief: string;
    options: Record<string, unknown>;
    state: {
        steps?: Record<string, RunStep>;
        narrations?: { eligible: number; generated: number };
        assignments?: { eligible: number; generated: number };
        summary?: Record<string, unknown>;
    };
    status: 'pending' | 'running' | 'completed' | 'failed';
    currentStep: string;
    stepStatus: string;
    progressPercent: number;
    error: string | null;
    advanceUrl: string;
    retryUrl: string;
    reviewUrl: string;
    course: null | {
        id: number;
        title: string;
        status: string;
        image: string | null;
        thumbnail: string | null;
        moduleCount: number;
        lessonCount: number;
        editUrl: string;
    };
    offer: null | {
        id: number;
        name: string;
        amount: number;
        currency: string;
        billingType: string;
    };
    page: null | {
        id: number;
        title: string;
        status: string;
        editUrl: string;
        previewUrl: string;
    };
    createdAt: string | null;
    completedAt: string | null;
};

type Props = {
    provider: ProviderStatus;
    categories: Category[];
    activeRun: CourseCreationRun | null;
    recentRuns: Array<{
        id: number;
        brief: string;
        status: string;
        progressPercent: number;
        createdAt: string | null;
        url: string;
    }>;
};


const generationOptions = [
    { key: 'generate_assessments', label: 'Générer les quiz', description: 'Un quiz auto-corrigé par module.' },
    { key: 'generate_assignments', label: 'Assignments & projets', description: 'Un projet pratique avec rubric par module.' },
    { key: 'generate_cover', label: 'Générer la cover', description: 'Image 16:9 pour la page formation.' },
    { key: 'generate_thumbnail', label: 'Générer la thumbnail', description: 'Visuel carré pour les cartes et sélections.' },
    { key: 'generate_audio', label: 'Narration audio', description: 'Narration optionnelle pour chaque leçon textuelle.' },
    { key: 'generate_landing', label: 'Landing page', description: 'Page de vente M11 liée aux vraies offres.' },
] as const;

const workflow = [
    { key: 'blueprint', label: 'Positionnement & blueprint', icon: Sparkles },
    { key: 'materialize', label: 'Curriculum & leçons', icon: BookOpen },
    { key: 'assessments', label: 'Quiz & évaluations', icon: ClipboardCheck },
    { key: 'assignments', label: 'Assignments & projets', icon: FileText },
    { key: 'cover', label: 'Cover', icon: ImageIcon },
    { key: 'thumbnail', label: 'Thumbnail', icon: ImageIcon },
    { key: 'narrations', label: 'Narrations', icon: Mic2 },
    { key: 'offer', label: 'Offre', icon: ReceiptText },
    { key: 'landing', label: 'Landing page', icon: FileText },
    { key: 'review', label: 'Revue', icon: CheckCircle2 },
] as const;

function csrfToken() {
    return document
        .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.getAttribute('content');
}

function orbState(step: string): ThinkingOrbState {
    if (step === 'blueprint') return 'shaping';
    if (step === 'materialize') return 'weaving';
    if (step === 'assessments') return 'solving';
    if (step === 'assignments') return 'weaving';
    if (step === 'cover' || step === 'thumbnail') return 'composing';
    if (step === 'narrations') return 'listening';
    if (step === 'offer') return 'connecting';
    if (step === 'landing') return 'solving';
    return 'breathing';
}

function stepIcon(status: StepStatus) {
    if (status === 'done') {
        return <CheckCircle2 className="size-4 text-emerald-600" />;
    }
    if (status === 'skipped') {
        return <Circle className="size-4 text-muted-foreground" />;
    }
    if (status === 'failed') {
        return <CircleAlert className="size-4 text-destructive" />;
    }
    if (status === 'running') {
        return <LoaderCircle className="size-4 animate-spin text-brand-primary" />;
    }
    return <Circle className="size-4 text-border" />;
}

function formatMoney(amount: number, currency: string) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
    }).format(amount / 100);
}

export default function OneBriefCourseCreation({
    provider,
    categories,
    activeRun,
    recentRuns,
}: Props) {
    const [run, setRun] = useState<CourseCreationRun | null>(activeRun);
    const [advanceError, setAdvanceError] = useState<string | null>(null);
    const advancing = useRef(false);

    const form = useForm({
        brief: '',
        category_id: categories[0]?.id ?? 0,
        audience: '',
        outcome: '',
        weeks: 6,
        price_major: 197,
        currency: 'EUR',
        generate_assessments: true,
        generate_assignments: true,
        generate_cover: true,
        generate_thumbnail: true,
        generate_audio: false,
        generate_landing: true,
        voice: '',
    });

    const currentStep = run?.state.steps?.[run.currentStep];
    const currentLabel =
        currentStep?.detail ??
        workflow.find((item) => item.key === run?.currentStep)?.label ??
        'Création de la formation…';

    const narrationDetail = useMemo(() => {
        const narrations = run?.state.narrations;
        if (!narrations?.eligible) return null;
        return `${narrations.generated}/${narrations.eligible} narrations générées`;
    }, [run]);

    const assessmentDetail = useMemo(() => {
        const data = (run?.state as { assessments?: { eligible?: number; generated?: number } } | undefined)?.assessments;
        if (!data?.eligible) return null;
        return `${data.generated ?? 0}/${data.eligible} quiz générés`;
    }, [run]);

    const assignmentDetail = useMemo(() => {
        const data = run?.state.assignments;
        if (!data?.eligible) return null;
        return `${data.generated ?? 0}/${data.eligible} projets générés`;
    }, [run]);

    useEffect(() => {
        if (!run || run.status !== 'running' || advancing.current) {
            return;
        }

        const timer = window.setTimeout(async () => {
            advancing.current = true;
            setAdvanceError(null);

            try {
                const advanceEndpoint = run.advanceUrl.startsWith('http')
                    ? run.advanceUrl
                    : `${window.location.origin}${run.advanceUrl.startsWith('/') ? '' : '/'}${run.advanceUrl}`;

                const response = await fetch(advanceEndpoint, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken() ?? '',
                    },
                    body: JSON.stringify({}),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data?.message ??
                            'La création de la formation a rencontré un problème côté serveur.',
                    );
                }
                setRun(data.run);
            } catch (caught) {
                setAdvanceError(
                    caught instanceof Error
                        ? caught.message
                        : 'La création de la formation a été interrompue.',
                );
            } finally {
                advancing.current = false;
            }
        }, 350);

        return () => window.clearTimeout(timer);
    }, [run]);

    async function retryRun() {
        if (!run) return;
        setAdvanceError(null);
        try {
            const response = await fetch(run.retryUrl, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken() ?? '',
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message ?? 'Impossible de reprendre cette génération.');
            }
            setRun(data.run);
        } catch (caught) {
            setAdvanceError(caught instanceof Error ? caught.message : 'Impossible de reprendre cette génération.');
        }
    }

    function start() {
        form.post('/trainer/academy-ai/course-creation');
    }

    return (
        <>
            <Head title="Créer une formation avec l’IA" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <div className="flex items-center justify-between gap-3">
                    <Button variant="ghost" asChild className="gap-2 rounded-full">
                        <Link href="/trainer/academy-ai">
                            <ArrowLeft className="size-4" /> Academy AI
                        </Link>
                    </Button>
                    <Badge variant="outline" className="gap-2">
                        <Sparkles className="size-3.5" /> One‑Brief‑to‑Course
                    </Badge>
                </div>

                <DashboardHero
                    title="Créer ma formation avec l’IA"
                    description="Décrivez l’idée une fois. Academy OS construit le positionnement, le curriculum, les leçons, les médias optionnels, l’offre et la landing page — puis s’arrête en brouillon pour votre revue."
                />

                {!run && (
                    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <section className="academy-panel space-y-6 rounded-[calc(var(--radius)*1.1)] p-5 sm:p-6">
                            <div>
                                <h2 className="text-lg font-semibold">Votre brief</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Donnez l’objectif métier et pédagogique. Les options ci-dessous restent modifiables avant le lancement.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Idée de formation</Label>
                                <Textarea
                                    value={form.data.brief}
                                    onChange={(event) =>
                                        form.setData('brief', event.target.value)
                                    }
                                    placeholder="Ex : Je veux une formation de 6 semaines pour aider des entrepreneurs débutants à maîtriser Canva et produire eux-mêmes leurs visuels professionnels."
                                    className="min-h-44 resize-y leading-6"
                                />
                                {form.errors.brief && (
                                    <p className="text-xs text-destructive">{form.errors.brief}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    <select
                                        value={form.data.category_id}
                                        onChange={(event) =>
                                            form.setData('category_id', Number(event.target.value))
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Durée cible (semaines)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={52}
                                        value={form.data.weeks}
                                        onChange={(event) =>
                                            form.setData('weeks', Number(event.target.value) || 1)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Audience</Label>
                                    <Input
                                        value={form.data.audience}
                                        onChange={(event) => form.setData('audience', event.target.value)}
                                        placeholder="Entrepreneurs débutants"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Résultat attendu</Label>
                                    <Input
                                        value={form.data.outcome}
                                        onChange={(event) => form.setData('outcome', event.target.value)}
                                        placeholder="Créer seuls leurs visuels professionnels"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Prix cible</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="1"
                                        value={form.data.price_major}
                                        onChange={(event) =>
                                            form.setData('price_major', Number(event.target.value) || 0)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Devise</Label>
                                    <Input
                                        value={form.data.currency}
                                        maxLength={3}
                                        onChange={(event) =>
                                            form.setData('currency', event.target.value.toUpperCase())
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {generationOptions.map(({ key, label, description }) => {
                                    const checked = form.data[key];
                                    return (
                                        <label
                                            key={key}
                                            className={cn(
                                                'flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors',
                                                checked
                                                    ? 'border-brand-primary/30 bg-brand-primary-soft/45'
                                                    : 'border-border/60 bg-background/50',
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                className="mt-1 size-4 accent-[var(--brand-primary)]"
                                                checked={checked}
                                                onChange={(event) =>
                                                    form.setData(
                                                        key,
                                                        event.target.checked,
                                                    )
                                                }
                                            />
                                            <span>
                                                <span className="block text-sm font-semibold">{label}</span>
                                                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                                    {description}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {form.data.generate_audio && (
                                <div className="space-y-2">
                                    <Label>Voix TTS optionnelle</Label>
                                    <Input
                                        value={form.data.voice}
                                        onChange={(event) => form.setData('voice', event.target.value)}
                                        placeholder="Laisser vide pour la voix par défaut"
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
                                <Button
                                    type="button"
                                    onClick={start}
                                    disabled={form.processing || !provider.configured || form.data.brief.trim().length < 20}
                                    className="gap-2 rounded-full"
                                >
                                    {form.processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <WandSparkles className="size-4" />
                                    )}
                                    Construire la formation
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    {provider.configured
                                        ? `${provider.provider} · ${provider.model}`
                                        : 'Configurez un provider Academy AI avant de lancer.'}
                                </span>
                            </div>
                        </section>

                        <aside className="space-y-4">
                            <div className="academy-panel rounded-[calc(var(--radius)*1.1)] p-5">
                                <h3 className="font-semibold">Ce que le moteur va faire</h3>
                                <div className="mt-4 space-y-3">
                                    {workflow.map(({ key, label, icon: Icon }, index) => (
                                        <div key={key} className="flex items-center gap-3 text-sm">
                                            <span className="grid size-8 place-items-center rounded-lg bg-brand-primary-soft text-brand-primary">
                                                <Icon className="size-4" />
                                            </span>
                                            <span className="text-muted-foreground">{index + 1}.</span>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {recentRuns.length > 0 && (
                                <div className="academy-panel rounded-[calc(var(--radius)*1.1)] p-5">
                                    <h3 className="font-semibold">Générations récentes</h3>
                                    <div className="mt-3 space-y-2">
                                        {recentRuns.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={item.url}
                                                className="block rounded-xl border border-border/50 p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="line-clamp-1 text-sm font-medium">{item.brief}</p>
                                                    <Badge variant="outline">{item.progressPercent}%</Badge>
                                                </div>
                                                <p className="mt-1 text-xs capitalize text-muted-foreground">{item.status}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                )}

                {run && run.status === 'running' && (
                    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card/85 via-card/50 to-background/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
                        {/* Soft atmospheric glow */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />

                        <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)_310px] lg:items-center">
                            {/* Left Column: Workflow Stepper (All 10 steps) */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/40">
                                    Pipeline Workflow
                                </h3>
                                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                    {workflow.map(({ key, label }, index) => {
                                        const step = run.state.steps?.[key] ?? {
                                            status: 'pending' as StepStatus,
                                            detail: null,
                                            reason: null,
                                        };
                                        const isCurrent = key === run.currentStep;
                                        const isDone = step.status === 'done';

                                        return (
                                            <div key={key} className="flex items-start gap-2.5">
                                                <span
                                                    className={cn(
                                                        'grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-all',
                                                        isDone
                                                            ? 'bg-emerald-600 text-white shadow-xs'
                                                            : isCurrent
                                                              ? 'border-2 border-brand-primary bg-brand-primary-soft text-brand-primary animate-pulse'
                                                              : 'border border-border/80 bg-background text-muted-foreground',
                                                    )}
                                                >
                                                    {isDone ? '✓' : index + 1}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className={cn("text-xs font-semibold leading-tight", isCurrent ? "text-brand-primary font-bold" : "text-foreground")}>
                                                        {label}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground truncate">
                                                        {isCurrent ? 'En cours…' : isDone ? 'Terminé' : 'En attente'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Middle Column: 3D Cosmic Orb & Main Progress */}
                            <div className="flex flex-col items-center justify-center text-center py-4">
                                <div className="relative flex items-center justify-center">
                                    <CosmicOrbCanvas size={310} />
                                </div>

                                <div className="mt-4 space-y-2 max-w-md">
                                    <h2 className="text-base font-bold text-foreground sm:text-lg">
                                        L’IA conçoit votre formation sur-mesure…
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Étape actuelle : <span className="font-semibold text-brand-primary">{currentLabel}</span>
                                    </p>
                                </div>

                                <div className="mt-5 w-full max-w-sm space-y-2">
                                    <div className="h-2 overflow-hidden rounded-full bg-muted/80 p-0.5 border border-border/50">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-brand-primary to-amber-500 transition-[width] duration-700 shadow-sm"
                                            style={{ width: `${run.progressPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                                        <span>Progression globale</span>
                                        <span className="font-mono text-brand-primary font-bold">{run.progressPercent}%</span>
                                    </div>
                                </div>

                                {advanceError && (
                                    <div className="mt-4 max-w-sm rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive space-y-2 text-center">
                                        <p>{advanceError}</p>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={retryRun}
                                            className="h-7 text-xs rounded-lg gap-1.5 mx-auto"
                                        >
                                            <RotateCcw className="size-3" />
                                            Relancer cette étape
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Generated Curriculum Live */}
                            <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3.5 backdrop-blur-md shadow-sm">
                                <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Curriculum généré
                                    </h3>
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full animate-pulse">
                                        En direct
                                    </span>
                                </div>

                                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                                    {run.course ? (
                                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold text-foreground line-clamp-1">{run.course.title}</p>
                                                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 shrink-0">Brouillon</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                                <span>📚 {run.course.moduleCount} modules</span>
                                                <span>•</span>
                                                <span>✍️ {run.course.lessonCount} leçons</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-border/60 p-3 text-center text-xs text-muted-foreground">
                                            Curriculum en cours de conception…
                                        </div>
                                    )}

                                    {/* Sub-assets live indicators */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded-lg border border-border/50 bg-card/50 p-2 text-center">
                                            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Quiz</span>
                                            <span className="font-bold text-foreground">{assessmentDetail ?? 'En attente'}</span>
                                        </div>
                                        <div className="rounded-lg border border-border/50 bg-card/50 p-2 text-center">
                                            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Projets</span>
                                            <span className="font-bold text-foreground">{assignmentDetail ?? 'En attente'}</span>
                                        </div>
                                    </div>

                                    {run.offer && (
                                        <div className="rounded-lg border border-border/50 bg-card/50 p-2.5 flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground font-medium">Offre créée :</span>
                                            <span className="font-bold text-foreground">{formatMoney(run.offer.amount, run.offer.currency)}</span>
                                        </div>
                                    )}

                                    {run.page && (
                                        <div className="rounded-lg border border-border/50 bg-card/50 p-2.5 flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground font-medium">Landing page :</span>
                                            <Badge variant="outline" className="text-[10px] text-emerald-600">Prête</Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {run && run.status === 'failed' && (
                    <div className="academy-panel rounded-[calc(var(--radius)*1.1)] p-6">
                        <div className="flex items-start gap-4">
                            <span className="grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
                                <CircleAlert className="size-5" />
                            </span>
                            <div className="flex-1">
                                <h2 className="font-semibold">La génération s’est arrêtée</h2>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {run.error ?? 'Une étape essentielle n’a pas pu être terminée.'}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button type="button" onClick={retryRun} className="rounded-full">
                                        Reprendre cette génération
                                    </Button>
                                    <Button variant="outline" asChild className="rounded-full">
                                        <Link href="/trainer/academy-ai/course-creation">Nouveau brief</Link>
                                    </Button>
                                    {run.course && (
                                        <Button variant="outline" asChild className="rounded-full">
                                            <Link href={run.course.editUrl}>Revoir le brouillon existant</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {run && run.status === 'completed' && run.course && (
                    <div className="space-y-6">
                        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-card/85 via-card/50 to-background/90 p-8 shadow-xl backdrop-blur-xl text-center flex flex-col items-center">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />
                            <CosmicOrbCanvas size={220} />
                            <div className="mt-4 max-w-lg space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                    <CheckCircle2 className="size-3.5" />
                                    Création IA 100% Terminée
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    Votre formation est prête pour la revue humaine
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Rien n’a été publié automatiquement. Vous gardez le plein contrôle sur le programme, l’offre commerciale et la landing page.
                                </p>
                            </div>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <Button asChild size="lg" className="gap-2 rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                                    <Link href={run.reviewUrl}>
                                        <BookOpen className="size-4" /> Revoir la formation dans le Review Center
                                    </Link>
                                </Button>
                                {run.page && (
                                    <Button variant="outline" size="lg" asChild className="gap-2 rounded-full">
                                        <Link href={run.page.editUrl}>
                                            <ExternalLink className="size-4" /> Ouvrir la landing page
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </section>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="academy-panel rounded-xl p-4">
                                <p className="text-xs text-muted-foreground">Formation</p>
                                <p className="mt-1 font-semibold">{run.course.title}</p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {run.course.moduleCount} modules · {run.course.lessonCount} leçons
                                </p>
                            </div>
                            <div className="academy-panel rounded-xl p-4">
                                <p className="text-xs text-muted-foreground">Médias</p>
                                <p className="mt-1 font-semibold">
                                    {run.course.image ? 'Cover ✓' : 'Cover —'} · {run.course.thumbnail ? 'Thumb ✓' : 'Thumb —'}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {run.state.narrations?.generated ?? 0}/{run.state.narrations?.eligible ?? 0} narrations
                                </p>
                            </div>
                            <div className="academy-panel rounded-xl p-4">
                                <p className="text-xs text-muted-foreground">Offre</p>
                                <p className="mt-1 font-semibold">
                                    {run.offer ? formatMoney(run.offer.amount, run.offer.currency) : 'Non créée'}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">{run.offer?.name ?? '—'}</p>
                            </div>
                            <div className="academy-panel rounded-xl p-4">
                                <p className="text-xs text-muted-foreground">Landing</p>
                                <p className="mt-1 font-semibold">{run.page?.title ?? 'Non créée'}</p>
                                <p className="mt-2 text-xs capitalize text-muted-foreground">{run.page?.status ?? '—'}</p>
                            </div>
                        </div>

                        <section className="academy-panel rounded-[calc(var(--radius)*1.1)] p-5 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-semibold">Revue humaine obligatoire</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Vérifiez le programme et la page avant d’utiliser le lifecycle de publication existant.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button asChild className="gap-2 rounded-full">
                                        <Link href={run.reviewUrl}>
                                            <BookOpen className="size-4" /> Revoir la formation dans le Review Center
                                        </Link>
                                    </Button>
                                    {run.page && (
                                        <Button variant="outline" asChild className="gap-2 rounded-full">
                                            <Link href={run.page.editUrl}>
                                                <ExternalLink className="size-4" /> Ouvrir la landing
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </>
    );
}

OneBriefCourseCreation.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/trainer/dashboard' },
        { title: 'Academy AI', href: '/trainer/academy-ai' },
        { title: 'Créer une formation', href: '/trainer/academy-ai/course-creation' },
    ],
};
