import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, PlayCircle, Sparkles, Trash2 } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToolArgumentsEditor } from '@/mission-tower/components/tool-arguments-editor';
import { TowerNav } from '@/mission-tower/components/tower-nav';
import { TowerStatusBadge } from '@/mission-tower/components/status-badge';

type Tool = {
    name: string;
    title: string;
    description: string;
    risk: string;
    inputSchema: {
        properties?: Record<
            string,
            { type?: string; enum?: Array<string | number>; format?: string }
        >;
        required?: string[];
    };
};

type ArgumentValue = string | number | boolean | null;
type MissionForm = {
    title: string;
    objective: string;
    priority: string;
    steps: Array<{ tool: string; arguments: Record<string, ArgumentValue> }>;
};

type Mission = {
    id: number;
    title: string;
    objective: string;
    status: string;
    priority: string;
    stepsCount: number;
    runsCount: number;
    approvalsCount: number;
    latestRun?: { id: number; status: string } | null;
};

type PageData = { data: Mission[] };

export default function TowerMissionsIndex({
    missions,
    tools,
    toolError,
    limits,
}: {
    missions: PageData;
    tools: Tool[];
    toolError?: string | null;
    limits: { maxSteps: number };
}) {
    const form = useForm<MissionForm>({
        title: '',
        objective: '',
        priority: 'normal',
        steps: [],
    });

    const addStep = () => {
        if (tools.length === 0 || form.data.steps.length >= limits.maxSteps) {
            return;
        }

        form.setData('steps', [
            ...form.data.steps,
            { tool: tools[0].name, arguments: {} },
        ]);
    };

    const updateStep = (
        index: number,
        next: { tool: string; arguments: Record<string, ArgumentValue> },
    ) => {
        const copy = [...form.data.steps];
        copy[index] = next;
        form.setData('steps', copy);
    };

    const removeStep = (index: number) => {
        form.setData(
            'steps',
            form.data.steps.filter((_, stepIndex) => stepIndex !== index),
        );
    };

    return (
        <>
            <Head title="Mission Tower — Missions" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Missions"
                    description="Composez une séquence de capacités Academy MCP. Tower exécute les lectures, suspend les mutations pour validation et conserve les receipts dans Evidence."
                />
                <TowerNav />

                <div className="flex justify-end">
                    <Button asChild variant="outline">
                        <Link href="/tower/compiler">
                            <Sparkles className="size-4" /> Compiler depuis une
                            intention
                        </Link>
                    </Button>
                </div>

                <DashboardSection
                    title="Nouvelle mission"
                    description="Composez manuellement un plan explicite ou utilisez Mission Compiler pour partir d'une intention en langage naturel."
                >
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/tower/missions', {
                                preserveScroll: true,
                                onSuccess: () => form.reset(),
                            });
                        }}
                        className="academy-panel space-y-6 rounded-[calc(var(--radius)*1.05)] p-5 sm:p-6"
                    >
                        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                            <div className="space-y-2">
                                <Label htmlFor="mission-title">Titre</Label>
                                <Input
                                    id="mission-title"
                                    value={form.data.title}
                                    onChange={(event) =>
                                        form.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Relancer les étudiants inactifs"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Priorité</Label>
                                <Select
                                    value={form.data.priority}
                                    onValueChange={(value) =>
                                        form.setData('priority', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">
                                            Basse
                                        </SelectItem>
                                        <SelectItem value="normal">
                                            Normale
                                        </SelectItem>
                                        <SelectItem value="high">
                                            Haute
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mission-objective">Objectif</Label>
                            <Textarea
                                id="mission-objective"
                                rows={3}
                                value={form.data.objective}
                                onChange={(event) =>
                                    form.setData(
                                        'objective',
                                        event.target.value,
                                    )
                                }
                                placeholder="Décrire le résultat attendu, sans instructions techniques inutiles."
                            />
                        </div>

                        {toolError ? (
                            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                                {toolError}
                            </p>
                        ) : null}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Plan d'exécution
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {form.data.steps.length}/
                                        {limits.maxSteps} étapes
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addStep}
                                    disabled={tools.length === 0}
                                >
                                    <Plus className="size-4" /> Ajouter une
                                    étape
                                </Button>
                            </div>

                            {form.data.steps.map((step, index) => {
                                const tool =
                                    tools.find(
                                        (item) => item.name === step.tool,
                                    ) ?? tools[0];

                                if (!tool) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={`${index}-${step.tool}`}
                                        className="rounded-2xl border border-border/70 p-4 sm:p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <Label>Étape {index + 1}</Label>
                                                <Select
                                                    value={step.tool}
                                                    onValueChange={(value) =>
                                                        updateStep(index, {
                                                            tool: value,
                                                            arguments: {},
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {tools.map((item) => (
                                                            <SelectItem
                                                                key={item.name}
                                                                value={
                                                                    item.name
                                                                }
                                                            >
                                                                {item.title} ·{' '}
                                                                {item.risk.toUpperCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs leading-5 text-muted-foreground">
                                                    {tool.description}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeStep(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-5">
                                            <ToolArgumentsEditor
                                                schema={tool.inputSchema}
                                                value={step.arguments}
                                                onChange={(nextArguments) =>
                                                    updateStep(index, {
                                                        ...step,
                                                        arguments:
                                                            nextArguments,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {form.data.steps.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                    Ajoutez au moins une capacité MCP pour créer
                                    la mission.
                                </div>
                            ) : null}
                        </div>

                        <Button
                            type="submit"
                            disabled={
                                form.processing || form.data.steps.length === 0
                            }
                        >
                            Créer la mission
                        </Button>
                    </form>
                </DashboardSection>

                <DashboardSection
                    title="Missions récentes"
                    description="Chaque mission conserve son plan, ses runs, approvals et preuves."
                >
                    <div className="academy-panel overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        {missions.data.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Aucune mission pour le moment.
                            </div>
                        ) : (
                            <div className="divide-y divide-border/70">
                                {missions.data.map((mission) => (
                                    <Link
                                        key={mission.id}
                                        href={`/tower/missions/${mission.id}`}
                                        className="flex items-center justify-between gap-5 p-5 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-foreground">
                                                    {mission.title}
                                                </p>
                                                <TowerStatusBadge
                                                    status={mission.status}
                                                />
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {mission.objective}
                                            </p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {mission.stepsCount} étapes ·{' '}
                                                {mission.runsCount} runs ·{' '}
                                                {mission.approvalsCount}{' '}
                                                approvals
                                            </p>
                                        </div>
                                        <PlayCircle className="size-5 shrink-0 text-muted-foreground" />
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
