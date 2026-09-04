import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, CheckCircle2, LockKeyhole, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TargetType = 'module' | 'lesson' | 'assessment' | 'assignment';
type RuleType = 'enrollment_delay_days' | 'fixed_datetime' | 'module_completed' | 'lesson_completed' | 'assessment_passed' | 'assignment_approved';
type Target = { type: TargetType; id: number; label: string; group: string };
type Rule = {
    id: number;
    targetType: TargetType;
    targetId: number;
    targetLabel: string;
    ruleType: RuleType;
    sourceType: TargetType | null;
    sourceId: number | null;
    sourceLabel: string | null;
    delayDays: number | null;
    availableAt: string | null;
    isEnabled: boolean;
    position: number;
};
type Props = { course: { id: number; title: string }; targets: Target[]; rules: Rule[] };

const labels: Record<RuleType, string> = {
    enrollment_delay_days: 'Après inscription',
    fixed_datetime: 'Date fixe',
    module_completed: 'Module terminé',
    lesson_completed: 'Leçon terminée',
    assessment_passed: 'Évaluation réussie',
    assignment_approved: 'Projet approuvé',
};

const sourceTypeFor = (rule: RuleType): TargetType | null => ({
    module_completed: 'module',
    lesson_completed: 'lesson',
    assessment_passed: 'assessment',
    assignment_approved: 'assignment',
    enrollment_delay_days: null,
    fixed_datetime: null,
})[rule];

export default function LearningAccessIndex({ course, targets, rules }: Props) {
    const [targetKey, setTargetKey] = useState(targets[0] ? `${targets[0].type}:${targets[0].id}` : '');
    const [ruleType, setRuleType] = useState<RuleType>('enrollment_delay_days');
    const [sourceId, setSourceId] = useState('');
    const [delayDays, setDelayDays] = useState('7');
    const [availableAt, setAvailableAt] = useState('');

    const expectedSourceType = sourceTypeFor(ruleType);
    const sourceChoices = useMemo(
        () => targets.filter((target) => target.type === expectedSourceType),
        [expectedSourceType, targets],
    );

    const create = () => {
        if (!targetKey) return;
        const [target_type, rawId] = targetKey.split(':');
        router.post(`/trainer/courses/${course.id}/learning-access`, {
            target_type,
            target_id: Number(rawId),
            rule_type: ruleType,
            source_id: expectedSourceType && sourceId ? Number(sourceId) : null,
            delay_days: ruleType === 'enrollment_delay_days' ? Number(delayDays || 0) : null,
            available_at: ruleType === 'fixed_datetime' ? availableAt || null : null,
            is_enabled: true,
        }, { preserveScroll: true });
    };

    return <>
        <Head title={`Drip & prérequis — ${course.title}`} />
        <div className="mx-auto w-full max-w-[1180px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Link href={`/trainer/courses/${course.id}/edit`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Course Builder
            </Link>
            <DashboardHero
                eyebrow="Learning Access · M15.1"
                title="Drip & prérequis"
                description={`Séquencez « ${course.title} » sans créer un second système de progression. Toutes les règles actives d’une cible doivent être satisfaites.`}
            />

            <section className="academy-surface space-y-5 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-brand-primary/10 p-2 text-brand-primary"><CalendarClock className="size-5" /></div>
                    <div><h2 className="font-semibold">Nouvelle règle</h2><p className="text-sm text-muted-foreground">Le backend vérifie que les prérequis appartiennent à cette formation et précèdent la cible.</p></div>
                </div>
                {targets.length === 0 ? <p className="rounded-xl border p-4 text-sm text-muted-foreground">Ajoutez d’abord au moins un module ou une activité pédagogique.</p> : <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2"><Label>Cible à déverrouiller</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={targetKey} onChange={(event) => setTargetKey(event.target.value)}>{targets.map((target) => <option key={`${target.type}:${target.id}`} value={`${target.type}:${target.id}`}>{target.label}</option>)}</select></div>
                    <div className="space-y-2"><Label>Condition</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={ruleType} onChange={(event) => { setRuleType(event.target.value as RuleType); setSourceId(''); }}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                    {ruleType === 'enrollment_delay_days' ? <div className="space-y-2"><Label>Nombre de jours après inscription</Label><Input type="number" min={0} max={3650} value={delayDays} onChange={(event) => setDelayDays(event.target.value)} /></div> : null}
                    {ruleType === 'fixed_datetime' ? <div className="space-y-2"><Label>Date et heure de disponibilité</Label><Input type="datetime-local" value={availableAt} onChange={(event) => setAvailableAt(event.target.value)} /></div> : null}
                    {expectedSourceType ? <div className="space-y-2 lg:col-span-2"><Label>Prérequis</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={sourceId} onChange={(event) => setSourceId(event.target.value)}><option value="">Choisir un prérequis</option>{sourceChoices.map((target) => <option key={`${target.type}:${target.id}`} value={target.id}>{target.label}</option>)}</select></div> : null}
                </div>}
                {targets.length > 0 ? <Button type="button" onClick={create}><Plus className="mr-2 size-4" />Ajouter la règle</Button> : null}
            </section>

            <section className="academy-surface rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2"><LockKeyhole className="size-5 text-brand-primary" /><h2 className="font-semibold">Règles actives</h2></div>
                <p className="mt-1 text-sm text-muted-foreground">Plusieurs règles sur la même cible sont cumulatives : elles fonctionnent en AND.</p>
                <div className="mt-4 space-y-3">
                    {rules.length === 0 ? <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">Aucune règle : l’accès repose uniquement sur le tier acheté.</p> : rules.map((rule) => <div key={rule.id} className="rounded-xl border p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div><p className="font-medium">{rule.targetLabel}</p><p className="mt-1 text-sm text-muted-foreground">{labels[rule.ruleType]}{rule.sourceLabel ? ` · ${rule.sourceLabel}` : ''}{rule.delayDays !== null ? ` · ${rule.delayDays} jour(s)` : ''}{rule.availableAt ? ` · ${new Date(rule.availableAt).toLocaleString('fr-FR')}` : ''}</p></div>
                            <div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => router.patch(`/trainer/courses/${course.id}/learning-access/${rule.id}`, { is_enabled: !rule.isEnabled }, { preserveScroll: true })}><CheckCircle2 className="mr-2 size-4" />{rule.isEnabled ? 'Active' : 'Inactive'}</Button><Button type="button" size="icon" variant="ghost" onClick={() => router.delete(`/trainer/courses/${course.id}/learning-access/${rule.id}`, { preserveScroll: true })}><Trash2 className="size-4" /></Button></div>
                        </div>
                    </div>)}
                </div>
            </section>
        </div>
    </>;
}
