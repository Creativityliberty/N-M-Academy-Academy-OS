import { Head, router, useForm } from '@inertiajs/react';
import { Database, RefreshCw, ShieldCheck } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CourseStatus = {
    id: number;
    title: string;
    status: string;
    documents: number;
    indexed: number;
    chunks: number;
    lastIndexedAt: string | null;
};

type Props = {
    settings: {
        enabled: boolean;
        provider: 'inherit' | 'openai' | 'deepseek';
        model: string | null;
        premiumModel: string | null;
        personality: 'helpful' | 'concise' | 'coach';
        outsideContentPolicy: 'never' | 'ask' | 'allowed';
        dailyLimit: number;
        monthlyBudgetCents: number;
        allowedCourseIds: number[];
        geminiApiKey?: string;
    };
    provider: { configured: boolean; provider: string; model: string };
    embedding: { provider: string; model: string };
    courses: CourseStatus[];
};

export default function TutorSettings({
    settings,
    provider,
    embedding,
    courses,
}: Props) {
    const form = useForm({
        enabled: settings.enabled,
        provider: settings.provider,
        model: settings.model ?? '',
        premium_model: settings.premiumModel ?? '',
        personality: settings.personality,
        outside_content_policy: settings.outsideContentPolicy,
        daily_limit: settings.dailyLimit,
        monthly_budget_cents: settings.monthlyBudgetCents,
        allowed_course_ids: settings.allowedCourseIds,
        gemini_api_key: settings.geminiApiKey ?? '',
    });

    function toggleCourse(id: number) {
        const allIds = courses.map((course) => course.id);
        const current =
            form.data.allowed_course_ids.length === 0
                ? allIds
                : form.data.allowed_course_ids;
        const next = current.includes(id)
            ? current.filter((value) => value !== id)
            : [...current, id];

        form.setData(
            'allowed_course_ids',
            next.length === allIds.length ? [] : next,
        );
    }

    return (
        <>
            <Head title="AI Tutor" />
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <DashboardHero
                    title="AI Tutor"
                    description="Un professeur privé relié aux contenus réellement autorisés de votre Academy."
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <DashboardSection
                        title="Configuration"
                        description="Le LLM peut être OpenAI ou DeepSeek. Le retrieval reste indépendant du modèle de conversation."
                    >
                        <form
                            className="grid gap-5 md:grid-cols-2"
                            onSubmit={(event) => {
                                event.preventDefault();
                                form.patch('/trainer/ai-tutor', {
                                    preserveScroll: true,
                                });
                            }}
                        >
                            <label className="flex items-center gap-3 rounded-xl border border-border/55 p-4 md:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.enabled}
                                    onChange={(event) =>
                                        form.setData(
                                            'enabled',
                                            event.target.checked,
                                        )
                                    }
                                />
                                <span>
                                    <span className="block text-sm font-semibold">
                                        Activer AI Tutor
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Le reste de l’Academy continue de
                                        fonctionner s’il est désactivé.
                                    </span>
                                </span>
                            </label>

                            <div className="space-y-2">
                                <Label>Provider</Label>
                                <select
                                    value={form.data.provider}
                                    onChange={(event) =>
                                        form.setData(
                                            'provider',
                                            event.target
                                                .value as typeof form.data.provider,
                                        )
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="inherit">
                                        Hériter d’Academy AI (
                                        {provider.provider})
                                    </option>
                                    <option value="deepseek">DeepSeek</option>
                                    <option value="openai">OpenAI</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Modèle (optionnel)</Label>
                                <Input
                                    value={form.data.model}
                                    onChange={(event) =>
                                        form.setData(
                                            'model',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="deepseek-v4-flash"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Modèle premium (optionnel)</Label>
                                <Input
                                    value={form.data.premium_model}
                                    onChange={(event) =>
                                        form.setData(
                                            'premium_model',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="deepseek-v4-pro"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Utilisé pour les quiz et plans de révision
                                    quand il est défini.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Personnalité</Label>
                                <select
                                    value={form.data.personality}
                                    onChange={(event) =>
                                        form.setData(
                                            'personality',
                                            event.target
                                                .value as typeof form.data.personality,
                                        )
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="helpful">Pédagogique</option>
                                    <option value="concise">Concise</option>
                                    <option value="coach">Coach</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Hors contenu</Label>
                                <select
                                    value={form.data.outside_content_policy}
                                    onChange={(event) =>
                                        form.setData(
                                            'outside_content_policy',
                                            event.target
                                                .value as typeof form.data.outside_content_policy,
                                        )
                                    }
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="never">Refuser</option>
                                    <option value="ask">
                                        Demander permission
                                    </option>
                                    <option value="allowed">
                                        Autoriser explication générale
                                    </option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Messages / étudiant / jour</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={1000}
                                    value={form.data.daily_limit}
                                    onChange={(event) =>
                                        form.setData(
                                            'daily_limit',
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    Budget mensuel estimé (centimes, 0 =
                                    illimité)
                                </Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.data.monthly_budget_cents}
                                    onChange={(event) =>
                                        form.setData(
                                            'monthly_budget_cents',
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Clé API Gemini (Génération d'images AI & médias)</Label>
                                <Input
                                    type="password"
                                    value={form.data.gemini_api_key}
                                    onChange={(event) =>
                                        form.setData(
                                            'gemini_api_key',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="AIzaSy..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Collez votre clé API Google Gemini pour générer automatiquement les visuels de vos cours.
                                </p>
                            </div>
                            <div className="flex justify-end md:col-span-2">
                                <Button
                                    disabled={form.processing}
                                    className="rounded-full"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </DashboardSection>

                    <div className="space-y-6">
                        <DashboardSection
                            title="Moteurs"
                            description="État de la couche d’intelligence et du retrieval."
                        >
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between rounded-xl border border-border/50 p-3">
                                    <span>LLM</span>
                                    <Badge
                                        variant={
                                            provider.configured
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {provider.provider} · {provider.model}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-border/50 p-3">
                                    <span>Embeddings</span>
                                    <Badge variant="outline">
                                        {embedding.provider} · {embedding.model}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4" />{' '}
                                    Retrieval filtré par inscription avant
                                    génération.
                                </div>
                            </div>
                        </DashboardSection>
                    </div>
                </div>

                <DashboardSection
                    title="Knowledge Status"
                    description="Indexez uniquement les formations que le Tutor doit connaître."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        {courses.map((course) => {
                            const allowed =
                                form.data.allowed_course_ids.length === 0 ||
                                form.data.allowed_course_ids.includes(
                                    course.id,
                                );

                            return (
                                <div
                                    key={course.id}
                                    className="rounded-xl border border-border/55 bg-card p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">
                                                {course.title}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {course.indexed}/
                                                {course.documents} documents ·{' '}
                                                {course.chunks} chunks
                                            </p>
                                        </div>
                                        <Database className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        <label className="flex items-center gap-2 text-xs">
                                            <input
                                                type="checkbox"
                                                checked={allowed}
                                                onChange={() =>
                                                    toggleCourse(course.id)
                                                }
                                            />{' '}
                                            Tutor autorisé
                                        </label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="rounded-full"
                                            onClick={() =>
                                                router.post(
                                                    `/trainer/ai-tutor/courses/${course.id}/reindex`,
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />{' '}
                                            Réindexer
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
