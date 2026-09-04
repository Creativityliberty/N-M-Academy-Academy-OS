import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Step = {
    position: number;
    title: string;
    tool: string;
    risk: string;
    arguments: Record<string, unknown>;
    reason: string;
    requiresApproval: boolean;
    destructive: boolean;
    openWorld: boolean;
};

type Proposal = {
    title: string;
    objective: string;
    priority: string;
    summary: string;
    assumptions: string[];
    steps: Step[];
    riskSummary: { read: number; write: number; sensitive: number };
    approvalCount: number;
};

type Compilation = {
    id: number;
    status: string;
    prompt: string;
    provider?: string | null;
    model?: string | null;
    proposal?: Proposal | null;
    warnings: string[];
    errorMessage?: string | null;
    mission?: { id: number; title: string; status: string } | null;
    appliedAt?: string | null;
    createdAt?: string | null;
};

function riskClass(risk: string) {
    if (risk === 'sensitive') {
        return 'border-destructive/25 bg-destructive/5 text-destructive';
    }

    if (risk === 'write') {
        return 'border-amber-500/25 bg-amber-500/5 text-amber-700 dark:text-amber-300';
    }

    return 'border-emerald-500/25 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300';
}

export default function MissionCompiler({
    compilation,
    recentCompilations,
    maxPromptLength,
}: {
    compilation?: Compilation | null;
    recentCompilations: Compilation[];
    maxPromptLength: number;
}) {
    const form = useForm({ prompt: compilation?.prompt ?? '' });
    const applyForm = useForm<{ compilation: string }>({ compilation: '' });
    const proposal = compilation?.proposal ?? null;

    return (
        <>
            <Head title="Mission Tower — Compiler" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Mission Compiler"
                    description="Décrivez le résultat attendu en langage naturel. Tower propose un plan MCP minimal, recalcule les risques depuis le catalogue réel et vous laisse le vérifier avant de créer une mission."
                />
                <TowerNav />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                    <DashboardSection
                        title="Décrire la mission"
                        description="Compiler ne lance aucune action : il prépare uniquement une proposition auditée."
                    >
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.post('/tower/compiler', {
                                    preserveScroll: true,
                                });
                            }}
                            className="academy-panel space-y-5 rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6"
                        >
                            <div className="space-y-2">
                                <Textarea
                                    rows={10}
                                    maxLength={maxPromptLength}
                                    value={form.data.prompt}
                                    onChange={(event) =>
                                        form.setData(
                                            'prompt',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Analyse pourquoi mes étudiants décrochent, identifie les signaux utiles et propose-moi un plan minimal pour améliorer leur progression."
                                />
                                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                                    <span>
                                        Tower utilise uniquement les tools
                                        visibles par son token MCP.
                                    </span>
                                    <span>
                                        {form.data.prompt.length}/
                                        {maxPromptLength}
                                    </span>
                                </div>
                                {form.errors.prompt ? (
                                    <p className="text-sm text-destructive">
                                        {form.errors.prompt}
                                    </p>
                                ) : null}
                            </div>

                            <div className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-primary" />
                                    <p>
                                        Le modèle ne décide jamais du niveau de
                                        risque. Après génération, Tower relit
                                        chaque tool dans le catalogue MCP live,
                                        valide ses arguments et recalcule READ /
                                        WRITE / SENSITIVE côté serveur.
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={
                                    form.processing ||
                                    form.data.prompt.trim().length < 10
                                }
                                className="w-full sm:w-auto"
                            >
                                <Sparkles className="size-4" />
                                {form.processing
                                    ? 'Compilation…'
                                    : 'Compiler la mission'}
                            </Button>
                        </form>
                    </DashboardSection>

                    <DashboardSection
                        title="Proposition"
                        description="Review → Apply → Mission DRAFT. L'exécution reste un acte séparé."
                    >
                        {!compilation ? (
                            <div className="academy-panel flex min-h-[360px] items-center justify-center rounded-[calc(var(--radius)*1.05)] p-8 text-center">
                                <div className="max-w-md">
                                    <BrainCircuit className="mx-auto size-9 text-brand-primary" />
                                    <h3 className="mt-4 text-base font-semibold">
                                        Aucune proposition sélectionnée
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Décrivez un objectif à gauche. Tower
                                        construira un plan à partir des
                                        capacités MCP réellement accessibles.
                                    </p>
                                </div>
                            </div>
                        ) : compilation.status === 'failed' ? (
                            <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-6">
                                <div className="flex gap-3 text-destructive">
                                    <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">
                                            Compilation échouée
                                        </h3>
                                        <p className="mt-2 text-sm leading-6">
                                            {compilation.errorMessage ??
                                                'Le plan n’a pas pu être validé.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : proposal ? (
                            <div className="academy-panel space-y-6 rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <TowerStatusBadge
                                                status={compilation.status}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {compilation.provider ?? 'AI'} ·{' '}
                                                {compilation.model ?? 'model'}
                                            </span>
                                        </div>
                                        <h2 className="mt-3 text-xl font-semibold tracking-tight">
                                            {proposal.title}
                                        </h2>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {proposal.objective}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span
                                            className={`rounded-full border px-2.5 py-1 ${riskClass('read')}`}
                                        >
                                            {proposal.riskSummary.read} READ
                                        </span>
                                        <span
                                            className={`rounded-full border px-2.5 py-1 ${riskClass('write')}`}
                                        >
                                            {proposal.riskSummary.write} WRITE
                                        </span>
                                        <span
                                            className={`rounded-full border px-2.5 py-1 ${riskClass('sensitive')}`}
                                        >
                                            {proposal.riskSummary.sensitive}{' '}
                                            SENSITIVE
                                        </span>
                                    </div>
                                </div>

                                {proposal.summary ? (
                                    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm leading-6">
                                        {proposal.summary}
                                    </div>
                                ) : null}

                                {compilation.warnings.length > 0 ? (
                                    <div className="space-y-2">
                                        {compilation.warnings.map((warning) => (
                                            <div
                                                key={warning}
                                                className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-800 dark:text-amber-200"
                                            >
                                                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                                                <span>{warning}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {proposal.assumptions.length > 0 ? (
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Hypothèses à vérifier
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                            {proposal.assumptions.map(
                                                (assumption) => (
                                                    <li
                                                        key={assumption}
                                                        className="flex gap-2"
                                                    >
                                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                                                        <span>
                                                            {assumption}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                ) : null}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm font-semibold">
                                            Plan compilé
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {proposal.steps.length} étapes ·{' '}
                                            {proposal.approvalCount} validations
                                            prévues
                                        </p>
                                    </div>
                                    {proposal.steps.map((step) => (
                                        <div
                                            key={`${step.position}-${step.tool}`}
                                            className="rounded-2xl border border-border/70 p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Étape {step.position}
                                                    </p>
                                                    <h3 className="mt-1 text-sm font-semibold">
                                                        {step.title}
                                                    </h3>
                                                    <code className="mt-1 block text-xs text-muted-foreground">
                                                        {step.tool}
                                                    </code>
                                                </div>
                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${riskClass(step.risk)}`}
                                                >
                                                    {step.risk.toUpperCase()}
                                                </span>
                                            </div>
                                            {step.reason ? (
                                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                                    {step.reason}
                                                </p>
                                            ) : null}
                                            <pre className="mt-3 max-h-44 overflow-auto rounded-xl bg-muted/45 p-3 text-xs leading-5">
                                                {JSON.stringify(
                                                    step.arguments,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                            {step.destructive ||
                                            step.openWorld ? (
                                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                    {step.destructive ? (
                                                        <span>
                                                            Action destructive
                                                        </span>
                                                    ) : null}
                                                    {step.openWorld ? (
                                                        <span>
                                                            Effet externe
                                                            possible
                                                        </span>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>

                                {compilation.mission ? (
                                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    Mission créée
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Elle reste en brouillon
                                                    jusqu'à ce que vous décidiez
                                                    de l'exécuter.
                                                </p>
                                            </div>
                                        </div>
                                        <Button asChild variant="outline">
                                            <Link
                                                href={`/tower/missions/${compilation.mission.id}`}
                                            >
                                                Ouvrir la mission{' '}
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            applyForm.post(
                                                `/tower/compiler/${compilation.id}/apply`,
                                            );
                                        }}
                                    >
                                        {applyForm.errors.compilation ? (
                                            <p className="mb-3 text-sm text-destructive">
                                                {applyForm.errors.compilation}
                                            </p>
                                        ) : null}
                                        <Button
                                            type="submit"
                                            disabled={applyForm.processing}
                                        >
                                            <FileText className="size-4" />
                                            {applyForm.processing
                                                ? 'Création…'
                                                : 'Créer la mission brouillon'}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-6 text-sm text-muted-foreground">
                                Cette compilation ne contient pas encore de
                                proposition exploitable.
                            </div>
                        )}
                    </DashboardSection>
                </div>

                <DashboardSection
                    title="Compilations récentes"
                    description="Le prompt, le provider, la proposition et la mission appliquée restent auditables."
                >
                    <div className="academy-panel overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {recentCompilations.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Aucune autre compilation pour le moment.
                            </div>
                        ) : (
                            <div className="divide-y divide-border/70">
                                {recentCompilations.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/tower/compiler/${item.id}`}
                                        className="flex items-center justify-between gap-5 p-5 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <TowerStatusBadge
                                                    status={item.status}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {item.provider ?? '—'} ·{' '}
                                                    {item.model ?? '—'}
                                                </span>
                                            </div>
                                            <p className="mt-2 line-clamp-1 text-sm font-medium">
                                                {item.proposal?.title ??
                                                    item.prompt}
                                            </p>
                                        </div>
                                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
