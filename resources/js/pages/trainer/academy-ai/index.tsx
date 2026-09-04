import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    CircleAlert,
    FilePenLine,
    GraduationCap,
    Layers3,
    LoaderCircle,
    MessageSquareText,
    Sparkles,
    WandSparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const MODE_CAPABILITIES = {
    ask: ['academy.ask'],
    create: [
        'course.generate',
        'assessment.generate',
        'curriculum.generate',
        'lessons.generate',
        'page.generate',
    ],
    modify: ['lesson.rewrite', 'page.optimize'],
    analyze: ['students.analyze'],
} as const;

type CapabilityName =
    | 'academy.ask'
    | 'course.generate'
    | 'assessment.generate'
    | 'curriculum.generate'
    | 'lessons.generate'
    | 'lesson.rewrite'
    | 'students.analyze'
    | 'page.generate'
    | 'page.optimize';

type Mode = keyof typeof MODE_CAPABILITIES;

type ProviderStatus = {
    configured: boolean;
    provider: string;
    model: string;
};

type CapabilityMeta = {
    name: CapabilityName;
    label: string;
    mode: Mode;
    risk: 'read_only' | 'draft_write' | 'write';
    canApply: boolean;
};

type Category = { id: number; name: string };

type LessonTarget = {
    id: number;
    title: string;
    hasContent: boolean;
};

type ModuleTarget = {
    id: number;
    title: string;
    lessons: LessonTarget[];
};

type CourseTarget = {
    id: number;
    title: string;
    status: 'draft' | 'published' | 'archived';
    modules: ModuleTarget[];
};

type Run = {
    id: number;
    capability: CapabilityName;
    mode: Mode;
    prompt: string;
    input: Record<string, unknown>;
    output: Record<string, unknown> | null;
    provider: string | null;
    model: string | null;
    status: 'pending' | 'succeeded' | 'failed';
    error: string | null;
    appliedAt: string | null;
    createdAt: string | null;
};

type Props = {
    provider: ProviderStatus;
    capabilities: CapabilityMeta[];
    categories: Category[];
    courses: CourseTarget[];
    recentRuns: Run[];
    pages: Array<{ id: number; title: string; status: string }>;
};

type FormInput = {
    category_id: number | null;
    course_id: number | null;
    module_id: number | null;
    lesson_id: number | null;
    page_id: number | null;
    audience: string;
    outcome: string;
    weeks: number | null;
};

type FormData = {
    capability: CapabilityName;
    prompt: string;
    input: FormInput;
};

const modeCards: Array<{
    mode: Mode;
    label: string;
    description: string;
    icon: typeof Sparkles;
}> = [
    {
        mode: 'ask',
        label: 'Ask',
        description: 'Interroger les données agrégées de votre académie.',
        icon: MessageSquareText,
    },
    {
        mode: 'create',
        label: 'Create',
        description: 'Concevoir formations, curriculums, leçons et pages.',
        icon: WandSparkles,
    },
    {
        mode: 'modify',
        label: 'Modify',
        description:
            'Réécrire une leçon ou restructurer une page avant application explicite.',
        icon: FilePenLine,
    },
    {
        mode: 'analyze',
        label: 'Analyze',
        description: 'Lire progression, risques et opportunités.',
        icon: BarChart3,
    },
];

const capabilityLabels: Record<CapabilityName, string> = {
    'academy.ask': 'Ask Academy',
    'course.generate': 'Formation complète',
    'assessment.generate': 'Quiz / évaluation',
    'curriculum.generate': 'Curriculum',
    'lessons.generate': 'Leçons',
    'lesson.rewrite': 'Réécriture',
    'students.analyze': 'Analyse étudiants',
    'page.generate': 'Page complète',
    'page.optimize': 'Optimiser une page',
};

const capabilityPlaceholders: Record<CapabilityName, string> = {
    'academy.ask':
        'Ex : Quelle formation mérite le plus mon attention cette semaine et pourquoi ?',
    'course.generate':
        'Ex : Crée une formation de 6 semaines sur l’automatisation IA pour consultants débutants.',
    'curriculum.generate':
        'Ex : Ajoute un parcours avancé après les modules existants, orienté cas pratiques.',
    'lessons.generate':
        'Ex : Génère 4 leçons très concrètes avec exercices et exemples.',
    'lesson.rewrite':
        'Ex : Rends cette leçon plus claire, plus pédagogique et plus concise sans changer le fond.',
    'students.analyze':
        'Ex : Où perd-on le plus d’étudiants et quelles 3 actions tester en priorité ?',
    'page.generate':
        'Ex : Crée une page premium pour vendre ma formation aux dirigeants, sobre et orientée conversion.',
    'page.optimize':
        'Ex : Réorganise cette page pour clarifier la promesse et mettre les offres après le programme.',
};

function modeForCapability(capability: CapabilityName): Mode {
    if (capability === 'academy.ask') {
        return 'ask';
    }

    if (capability === 'lesson.rewrite' || capability === 'page.optimize') {
        return 'modify';
    }

    if (capability === 'students.analyze') {
        return 'analyze';
    }

    return 'create';
}

function formatDate(value: string | null) {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function statusBadge(run: Run) {
    if (run.status === 'succeeded') {
        return (
            <Badge className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Terminé
            </Badge>
        );
    }

    if (run.status === 'failed') {
        return (
            <Badge className="gap-1.5 border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/10">
                <CircleAlert className="h-3 w-3" /> Échec
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="gap-1.5">
            <LoaderCircle className="h-3 w-3 animate-spin" /> En cours
        </Badge>
    );
}

function StringList({ items }: { items: unknown }) {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return (
        <ul className="space-y-2 text-sm text-muted-foreground">
            {items.map((item, index) => (
                <li key={`${String(item)}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{String(item)}</span>
                </li>
            ))}
        </ul>
    );
}

function BlueprintOutput({ output }: { output: Record<string, unknown> }) {
    const modules = Array.isArray(output.modules) ? output.modules : [];

    return (
        <div className="space-y-5">
            {typeof output.title === 'string' && (
                <div>
                    <h4 className="text-lg font-semibold">{output.title}</h4>
                    {typeof output.description === 'string' && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {output.description}
                        </p>
                    )}
                </div>
            )}

            {modules.length > 0 && (
                <div className="space-y-3">
                    {modules.map((module, moduleIndex) => {
                        const typedModule = module as Record<string, unknown>;
                        const lessons = Array.isArray(typedModule.lessons)
                            ? typedModule.lessons
                            : [];

                        return (
                            <div
                                key={`${String(typedModule.title)}-${moduleIndex}`}
                                className="rounded-xl border border-border/50 bg-background/65 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-brand-primary">
                                            Module {moduleIndex + 1}
                                        </p>
                                        <h5 className="mt-1 font-semibold">
                                            {String(
                                                typedModule.title ?? 'Module',
                                            )}
                                        </h5>
                                    </div>
                                    {typeof typedModule.duration_minutes ===
                                        'number' && (
                                        <span className="text-xs text-muted-foreground">
                                            {typedModule.duration_minutes} min
                                        </span>
                                    )}
                                </div>

                                {lessons.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {lessons.map((lesson, lessonIndex) => {
                                            const typedLesson =
                                                lesson as Record<
                                                    string,
                                                    unknown
                                                >;

                                            return (
                                                <div
                                                    key={`${String(typedLesson.title)}-${lessonIndex}`}
                                                    className="rounded-lg bg-muted/45 px-3 py-2.5"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="text-sm font-medium">
                                                            {lessonIndex + 1}.{' '}
                                                            {String(
                                                                typedLesson.title ??
                                                                    'Leçon',
                                                            )}
                                                        </span>
                                                        {typeof typedLesson.duration_minutes ===
                                                            'number' && (
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {
                                                                    typedLesson.duration_minutes
                                                                }{' '}
                                                                min
                                                            </span>
                                                        )}
                                                    </div>
                                                    {typeof typedLesson.summary ===
                                                        'string' && (
                                                        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                                            {
                                                                typedLesson.summary
                                                            }
                                                        </p>
                                                    )}
                                                    {typeof typedLesson.content ===
                                                        'string' && (
                                                        <p className="mt-1.5 line-clamp-3 text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
                                                            {
                                                                typedLesson.content
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function RunOutput({ run }: { run: Run }) {
    const output = run.output;

    if (!output) {
        return null;
    }

    if (typeof output.answer === 'string') {
        return (
            <p className="text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                {output.answer}
            </p>
        );
    }

    if (run.capability === 'students.analyze') {
        return (
            <div className="space-y-5">
                {typeof output.summary === 'string' && (
                    <p className="text-sm leading-7 text-muted-foreground">
                        {output.summary}
                    </p>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border/50 bg-background/65 p-4">
                        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Forces
                        </p>
                        <StringList items={output.strengths} />
                    </div>
                    <div className="rounded-xl border border-border/50 bg-background/65 p-4">
                        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Risques
                        </p>
                        <StringList items={output.risks} />
                    </div>
                </div>
                {Array.isArray(output.actions) && output.actions.length > 0 && (
                    <div className="space-y-2">
                        {output.actions.map((action, index) => {
                            const typed = action as Record<string, unknown>;

                            return (
                                <div
                                    key={index}
                                    className="rounded-xl border border-border/50 bg-background/65 p-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {String(typed.priority ?? 'medium')}
                                        </Badge>
                                        <p className="text-sm font-semibold">
                                            {String(typed.action ?? '')}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        {String(typed.why ?? '')}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (run.capability === 'lesson.rewrite') {
        return (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">
                        {String(output.title ?? 'Leçon réécrite')}
                    </h4>
                    {typeof output.change_summary === 'string' && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {output.change_summary}
                        </p>
                    )}
                </div>
                {typeof output.content === 'string' && (
                    <div className="max-h-72 overflow-y-auto rounded-xl border border-border/50 bg-background/65 p-4 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                        {output.content}
                    </div>
                )}
            </div>
        );
    }

    return <BlueprintOutput output={output} />;
}

export default function AcademyAiIndex() {
    const { provider, capabilities, categories, courses, recentRuns, pages } =
        usePage<Props>().props;

    const form = useForm<FormData>({
        capability: 'academy.ask',
        prompt: '',
        input: {
            category_id: categories[0]?.id ?? null,
            course_id: courses[0]?.id ?? null,
            module_id: courses[0]?.modules[0]?.id ?? null,
            lesson_id: courses[0]?.modules[0]?.lessons[0]?.id ?? null,
            page_id: pages[0]?.id ?? null,
            audience: '',
            outcome: '',
            weeks: 6,
        },
    });

    const activeMode = modeForCapability(form.data.capability);

    const allModules = useMemo(
        () =>
            courses.flatMap((course) =>
                course.modules.map((module) => ({
                    ...module,
                    courseTitle: course.title,
                })),
            ),
        [courses],
    );

    const allLessons = useMemo(
        () =>
            courses.flatMap((course) =>
                course.modules.flatMap((module) =>
                    module.lessons.map((lesson) => ({
                        ...lesson,
                        courseTitle: course.title,
                        moduleTitle: module.title,
                    })),
                ),
            ),
        [courses],
    );

    const capabilityMeta = new Map(
        capabilities.map((capability) => [capability.name, capability]),
    );

    function setMode(mode: Mode) {
        const firstCapability = MODE_CAPABILITIES[mode][0] as CapabilityName;
        form.setData('capability', firstCapability);
    }

    function updateInput<K extends keyof FormInput>(
        key: K,
        value: FormInput[K],
    ) {
        form.setData('input', { ...form.data.input, [key]: value });
    }

    function submit() {
        form.post('/trainer/academy-ai/run', {
            preserveScroll: true,
            onSuccess: () => form.setData('prompt', ''),
        });
    }

    function applyRun(runId: number) {
        router.post(
            `/trainer/academy-ai/runs/${runId}/apply`,
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Academy AI" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Parlez à votre académie"
                    description="Academy AI transforme vos demandes en propositions structurées. Les modifications restent explicites : l’IA propose, vous appliquez."
                />

                <div className="academy-panel flex flex-col gap-4 rounded-[calc(var(--radius)*1.05)] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <span className="grid size-11 place-items-center rounded-xl bg-brand-primary text-white">
                            <WandSparkles className="size-5" />
                        </span>
                        <div>
                            <p className="font-semibold">Créer une formation complète</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Un seul brief → positionnement, curriculum, leçons, médias, offre et landing en brouillon.
                            </p>
                        </div>
                    </div>
                    <Button asChild className="gap-2 rounded-full">
                        <Link href="/trainer/academy-ai/course-creation">
                            <Sparkles className="size-4" /> One‑Brief‑to‑Course
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {modeCards.map(
                        ({ mode, label, description, icon: Icon }) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setMode(mode)}
                                className={cn(
                                    'academy-panel rounded-[calc(var(--radius)*1.05)] p-4 text-left transition-all',
                                    activeMode === mode
                                        ? 'ring-2 ring-brand-primary/30'
                                        : 'hover:-translate-y-0.5',
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={cn(
                                            'grid size-10 place-items-center rounded-xl',
                                            activeMode === mode
                                                ? 'bg-brand-primary text-white'
                                                : 'bg-brand-primary-soft text-brand-primary',
                                        )}
                                    >
                                        <Icon className="size-4" />
                                    </span>
                                    <div>
                                        <p className="font-semibold">{label}</p>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ),
                    )}
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
                    <DashboardSection
                        title="Mission"
                        description="Choisissez une capability puis formulez simplement l’objectif."
                    >
                        <div className="academy-panel space-y-5 rounded-[calc(var(--radius)*1.05)] p-5">
                            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/65 p-3.5">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'grid size-9 place-items-center rounded-xl',
                                            provider.configured
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                                        )}
                                    >
                                        <BrainCircuit className="size-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {provider.configured
                                                ? `${provider.provider} · ${provider.model}`
                                                : 'Provider non configuré'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {provider.configured
                                                ? 'Disponible pour cette instance.'
                                                : 'Ajoutez OPENAI_API_KEY dans Coolify.'}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline">
                                    {provider.configured ? 'Ready' : 'Offline'}
                                </Badge>
                            </div>

                            {activeMode === 'create' && (
                                <div className="space-y-2">
                                    <Label>Type de création</Label>
                                    <select
                                        value={form.data.capability}
                                        onChange={(event) =>
                                            form.setData(
                                                'capability',
                                                event.target
                                                    .value as CapabilityName,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    >
                                        <option value="course.generate">
                                            Formation complète
                                        </option>
                                        <option value="assessment.generate">
                                            Quiz / évaluation
                                        </option>
                                        <option value="curriculum.generate">
                                            Curriculum
                                        </option>
                                        <option value="lessons.generate">
                                            Leçons
                                        </option>
                                        <option value="page.generate">
                                            Page complète
                                        </option>
                                    </select>
                                </div>
                            )}

                            {form.data.capability === 'course.generate' && (
                                <div className="space-y-4 rounded-xl border border-border/50 bg-muted/25 p-4">
                                    <div className="space-y-2">
                                        <Label>Catégorie</Label>
                                        <select
                                            value={
                                                form.data.input.category_id ??
                                                ''
                                            }
                                            onChange={(event) =>
                                                updateInput(
                                                    'category_id',
                                                    Number(
                                                        event.target.value,
                                                    ) || null,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Audience</Label>
                                        <Input
                                            value={form.data.input.audience}
                                            onChange={(event) =>
                                                updateInput(
                                                    'audience',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ex : consultants indépendants débutants"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Résultat attendu</Label>
                                        <Input
                                            value={form.data.input.outcome}
                                            onChange={(event) =>
                                                updateInput(
                                                    'outcome',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ex : construire leur premier système automatisé"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Durée en semaines</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={52}
                                            value={form.data.input.weeks ?? ''}
                                            onChange={(event) =>
                                                updateInput(
                                                    'weeks',
                                                    Number(
                                                        event.target.value,
                                                    ) || null,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {(form.data.capability === 'curriculum.generate' ||
                                form.data.capability ===
                                    'students.analyze') && (
                                <div className="space-y-2">
                                    <Label>
                                        {form.data.capability ===
                                        'students.analyze'
                                            ? 'Formation à analyser'
                                            : 'Formation cible'}
                                    </Label>
                                    <select
                                        value={form.data.input.course_id ?? ''}
                                        onChange={(event) =>
                                            updateInput(
                                                'course_id',
                                                Number(event.target.value) ||
                                                    null,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {form.data.capability ===
                                            'students.analyze' && (
                                            <option value="">
                                                Toute l’académie
                                            </option>
                                        )}
                                        {courses.map((course) => (
                                            <option
                                                key={course.id}
                                                value={course.id}
                                            >
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {form.data.capability === 'lessons.generate' && (
                                <div className="space-y-2">
                                    <Label>Module cible</Label>
                                    <select
                                        value={form.data.input.module_id ?? ''}
                                        onChange={(event) =>
                                            updateInput(
                                                'module_id',
                                                Number(event.target.value) ||
                                                    null,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {allModules.map((module) => (
                                            <option
                                                key={module.id}
                                                value={module.id}
                                            >
                                                {module.courseTitle} ·{' '}
                                                {module.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {form.data.capability === 'lesson.rewrite' && (
                                <div className="space-y-2">
                                    <Label>Leçon cible</Label>
                                    <select
                                        value={form.data.input.lesson_id ?? ''}
                                        onChange={(event) =>
                                            updateInput(
                                                'lesson_id',
                                                Number(event.target.value) ||
                                                    null,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {allLessons.map((lesson) => (
                                            <option
                                                key={lesson.id}
                                                value={lesson.id}
                                            >
                                                {lesson.courseTitle} ·{' '}
                                                {lesson.moduleTitle} ·{' '}
                                                {lesson.title}
                                                {!lesson.hasContent
                                                    ? ' · vide'
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {activeMode === 'modify' && (
                                <div className="space-y-2">
                                    <Label>Type de modification</Label>
                                    <select
                                        value={form.data.capability}
                                        onChange={(event) =>
                                            form.setData(
                                                'capability',
                                                event.target
                                                    .value as CapabilityName,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
                                    >
                                        <option value="lesson.rewrite">
                                            Réécrire une leçon
                                        </option>
                                        <option value="page.optimize">
                                            Optimiser une page
                                        </option>
                                    </select>
                                </div>
                            )}

                            {form.data.capability === 'page.optimize' && (
                                <div className="space-y-2">
                                    <Label>Page cible</Label>
                                    <select
                                        value={form.data.input.page_id ?? ''}
                                        onChange={(event) =>
                                            updateInput(
                                                'page_id',
                                                Number(event.target.value) ||
                                                    null,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {pages.map((page) => (
                                            <option
                                                key={page.id}
                                                value={page.id}
                                            >
                                                {page.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Votre demande</Label>
                                <Textarea
                                    value={form.data.prompt}
                                    onChange={(event) =>
                                        form.setData(
                                            'prompt',
                                            event.target.value,
                                        )
                                    }
                                    placeholder={
                                        capabilityPlaceholders[
                                            form.data.capability
                                        ]
                                    }
                                    className="min-h-40 resize-y leading-6"
                                />
                                {form.errors.prompt && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.prompt}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                onClick={submit}
                                disabled={
                                    form.processing || !provider.configured
                                }
                                className="w-full gap-2 rounded-full"
                            >
                                {form.processing ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <Sparkles className="size-4" />
                                )}
                                Lancer Academy AI
                            </Button>

                            <p className="text-center text-[11px] leading-5 text-muted-foreground">
                                Les capacités de création et modification ne
                                touchent aux données qu’après votre clic sur «
                                Appliquer ».
                            </p>
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Dernières missions"
                        description="Chaque exécution garde sa capability, son provider, son résultat et son statut d’application."
                    >
                        <div className="space-y-4">
                            {recentRuns.length === 0 ? (
                                <div className="academy-panel rounded-[calc(var(--radius)*1.05)] px-6 py-14 text-center">
                                    <Sparkles className="mx-auto size-8 text-brand-primary/60" />
                                    <h3 className="mt-4 font-semibold">
                                        Aucune mission AI pour le moment
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        Commencez par Ask pour interroger votre
                                        académie ou générez votre prochain
                                        programme.
                                    </p>
                                </div>
                            ) : (
                                recentRuns.map((run) => {
                                    const meta = capabilityMeta.get(
                                        run.capability,
                                    );
                                    const canApply = Boolean(
                                        meta?.canApply &&
                                        run.status === 'succeeded' &&
                                        !run.appliedAt,
                                    );

                                    return (
                                        <article
                                            key={run.id}
                                            className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5"
                                        >
                                            <div className="flex flex-col gap-4 border-b border-border/50 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="grid size-8 place-items-center rounded-lg bg-brand-primary-soft text-brand-primary">
                                                            {run.mode ===
                                                            'analyze' ? (
                                                                <BarChart3 className="size-3.5" />
                                                            ) : run.mode ===
                                                              'modify' ? (
                                                                <FilePenLine className="size-3.5" />
                                                            ) : run.mode ===
                                                              'create' ? (
                                                                <GraduationCap className="size-3.5" />
                                                            ) : (
                                                                <MessageSquareText className="size-3.5" />
                                                            )}
                                                        </span>
                                                        <h3 className="font-semibold">
                                                            {
                                                                capabilityLabels[
                                                                    run
                                                                        .capability
                                                                ]
                                                            }
                                                        </h3>
                                                        {statusBadge(run)}
                                                        {run.appliedAt && (
                                                            <Badge variant="outline">
                                                                Appliqué
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                                        {run.prompt}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right text-[11px] text-muted-foreground">
                                                    <p>
                                                        {run.provider ?? '—'} ·{' '}
                                                        {run.model ?? '—'}
                                                    </p>
                                                    <p className="mt-1">
                                                        {formatDate(
                                                            run.createdAt,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {run.status === 'failed' ? (
                                                <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                                                    {run.error ??
                                                        'La mission a échoué.'}
                                                </div>
                                            ) : run.output ? (
                                                <div className="mt-5">
                                                    <RunOutput run={run} />
                                                </div>
                                            ) : null}

                                            {canApply && (
                                                <div className="mt-5 flex items-center justify-end border-t border-border/50 pt-4">
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            applyRun(run.id)
                                                        }
                                                        className="gap-2 rounded-full"
                                                    >
                                                        <CheckCircle2 className="size-4" />
                                                        Appliquer cette
                                                        proposition
                                                    </Button>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    </DashboardSection>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5">
                        <Layers3 className="size-5 text-brand-primary" />
                        <h3 className="mt-3 font-semibold">Structured first</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Les programmes et analyses sont générés sous schéma
                            structuré avant d’entrer dans votre base.
                        </p>
                    </div>
                    <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5">
                        <BookOpen className="size-5 text-brand-primary" />
                        <h3 className="mt-3 font-semibold">Contenu natif</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Les leçons possèdent désormais un vrai contenu
                            texte, éditable et visible dans le player étudiant.
                        </p>
                    </div>
                    <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5">
                        <BrainCircuit className="size-5 text-brand-primary" />
                        <h3 className="mt-3 font-semibold">MCP-ready</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Chaque capability possède déjà nom, mode, risque et
                            règle d’application pour préparer M08.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

AcademyAiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/trainer/dashboard' },
        { title: 'Academy AI', href: '/trainer/academy-ai' },
    ],
};
