import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type OptionDraft = { text: string; is_correct: boolean };
type QuestionDraft = { type: 'single_choice' | 'multiple_choice' | 'true_false'; prompt: string; explanation: string; points: number; options: OptionDraft[] };
type AssessmentDraft = {
    id?: number; title: string; description: string; kind: 'quiz' | 'assessment'; module_id: number | null; lesson_id: number | null;
    passing_score_percent: number; max_attempts: number | null; shuffle_questions: boolean; shuffle_options: boolean; show_explanations: boolean; is_enabled: boolean; questions: QuestionDraft[];
};
type Assessment = {
    id: number; title: string; description: string | null; kind: 'quiz' | 'assessment'; moduleId: number | null; lessonId: number | null;
    passingScorePercent: number; maxAttempts: number | null; shuffleQuestions: boolean; shuffleOptions: boolean; showExplanations: boolean; isEnabled: boolean; attemptCount: number;
    questions: Array<{ id: number; type: QuestionDraft['type']; prompt: string; explanation: string | null; points: number; options: Array<{ id: number; text: string; isCorrect: boolean }> }>;
};
type Props = {
    course: { id: number; title: string; modules: Array<{ id: number; title: string; lessons: Array<{ id: number; title: string }> }> };
    assessments: Assessment[];
    recentAiRuns: Array<{ id: number; status: string; prompt: string; output: Record<string, unknown> | null; appliedAt: string | null }>;
};
const blankQuestion = (): QuestionDraft => ({ type: 'single_choice', prompt: '', explanation: '', points: 1, options: [{ text: '', is_correct: true }, { text: '', is_correct: false }] });
const blankAssessment = (): AssessmentDraft => ({ title: '', description: '', kind: 'quiz', module_id: null, lesson_id: null, passing_score_percent: 70, max_attempts: 3, shuffle_questions: false, shuffle_options: false, show_explanations: true, is_enabled: true, questions: [blankQuestion()] });

export default function AssessmentWorkspace({ course, assessments, recentAiRuns }: Props) {
    const [draft, setDraft] = useState<AssessmentDraft>(blankAssessment());
    const [aiPrompt, setAiPrompt] = useState('Crée un quiz de 5 questions qui vérifie les notions essentielles de ce module.');
    const lessonChoices = useMemo(() => course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id }))), [course.modules]);

    const edit = (assessment: Assessment) => setDraft({
        id: assessment.id, title: assessment.title, description: assessment.description ?? '', kind: assessment.kind,
        module_id: assessment.moduleId, lesson_id: assessment.lessonId, passing_score_percent: assessment.passingScorePercent,
        max_attempts: assessment.maxAttempts, shuffle_questions: assessment.shuffleQuestions, shuffle_options: assessment.shuffleOptions,
        show_explanations: assessment.showExplanations, is_enabled: assessment.isEnabled,
        questions: assessment.questions.map((question) => ({ type: question.type, prompt: question.prompt, explanation: question.explanation ?? '', points: question.points, options: question.options.map((option) => ({ text: option.text, is_correct: option.isCorrect })) })),
    });

    const submit = () => {
        const url = draft.id ? `/trainer/courses/${course.id}/assessments/${draft.id}` : `/trainer/courses/${course.id}/assessments`;
        const method = draft.id ? router.patch : router.post;
        method(url, draft as never, { preserveScroll: true, onSuccess: () => setDraft(blankAssessment()) });
    };

    const updateQuestion = (index: number, patch: Partial<QuestionDraft>) => setDraft((current) => ({ ...current, questions: current.questions.map((question, i) => i === index ? { ...question, ...patch } : question) }));
    const updateOption = (questionIndex: number, optionIndex: number, patch: Partial<OptionDraft>) => setDraft((current) => ({ ...current, questions: current.questions.map((question, qi) => qi === questionIndex ? { ...question, options: question.options.map((option, oi) => oi === optionIndex ? { ...option, ...patch } : option) } : question) }));
    const moveQuestion = (index: number, direction: -1 | 1) => setDraft((current) => { const questions = [...current.questions]; const target = index + direction; if (target < 0 || target >= questions.length) return current; [questions[index], questions[target]] = [questions[target], questions[index]]; return { ...current, questions }; });

    return <>
        <Head title={`Quiz & évaluations — ${course.title}`} />
        <div className="mx-auto w-full max-w-[1180px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Link href={`/trainer/courses/${course.id}/edit`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Course Builder</Link>
            <DashboardHero eyebrow="Learning Primitives · M14.1" title="Quiz & évaluations" description={`Créez des évaluations auto-corrigées pour « ${course.title} », sans modifier la logique de progression actuelle.`} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]">
                <section className="academy-surface space-y-5 rounded-[calc(var(--radius)*1.25)] p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">{draft.id ? 'Modifier l’évaluation' : 'Nouvelle évaluation'}</h2><p className="text-sm text-muted-foreground">QCM simple, multiple ou vrai/faux. La correction reste côté serveur.</p></div>{draft.id && <Button type="button" variant="outline" onClick={() => setDraft(blankAssessment())}>Nouvelle</Button>}</div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><Label>Titre</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div><div><Label>Type</Label><select className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as AssessmentDraft['kind'] })}><option value="quiz">Quiz</option><option value="assessment">Évaluation</option></select></div></div>
                    <div><Label>Description</Label><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
                    <div className="grid gap-4 sm:grid-cols-3"><div><Label>Module cible</Label><select className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" value={draft.module_id ?? ''} onChange={(e) => setDraft({ ...draft, module_id: e.target.value ? Number(e.target.value) : null, lesson_id: null })}><option value="">Formation entière</option>{course.modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select></div><div><Label>Leçon cible</Label><select className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" value={draft.lesson_id ?? ''} onChange={(e) => { const id = e.target.value ? Number(e.target.value) : null; const lesson = lessonChoices.find((item) => item.id === id); setDraft({ ...draft, lesson_id: id, module_id: lesson?.moduleId ?? draft.module_id }); }}><option value="">Aucune</option>{lessonChoices.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></div><div><Label>Score de réussite (%)</Label><Input type="number" min={0} max={100} value={draft.passing_score_percent} onChange={(e) => setDraft({ ...draft, passing_score_percent: Number(e.target.value) })} /></div></div>
                    <div className="grid gap-4 sm:grid-cols-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.shuffle_questions} onChange={(e) => setDraft({ ...draft, shuffle_questions: e.target.checked })} /> Mélanger questions</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.shuffle_options} onChange={(e) => setDraft({ ...draft, shuffle_options: e.target.checked })} /> Mélanger choix</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.show_explanations} onChange={(e) => setDraft({ ...draft, show_explanations: e.target.checked })} /> Explications après réponse</label><div><Label>Tentatives max</Label><Input type="number" min={1} max={100} value={draft.max_attempts ?? ''} placeholder="Illimité" onChange={(e) => setDraft({ ...draft, max_attempts: e.target.value ? Number(e.target.value) : null })} /></div></div>

                    <div className="space-y-4">{draft.questions.map((question, qi) => <div key={qi} className="rounded-xl border p-4"><div className="mb-3 flex items-center justify-between"><strong className="text-sm">Question {qi + 1}</strong><div className="flex gap-1"><Button type="button" size="icon" variant="ghost" onClick={() => moveQuestion(qi, -1)}><ArrowUp className="size-4" /></Button><Button type="button" size="icon" variant="ghost" onClick={() => moveQuestion(qi, 1)}><ArrowDown className="size-4" /></Button><Button type="button" size="icon" variant="ghost" disabled={draft.questions.length === 1} onClick={() => setDraft((current) => ({ ...current, questions: current.questions.filter((_, i) => i !== qi) }))}><Trash2 className="size-4" /></Button></div></div><div className="grid gap-3 sm:grid-cols-[180px_1fr_100px]"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={question.type} onChange={(e) => updateQuestion(qi, { type: e.target.value as QuestionDraft['type'] })}><option value="single_choice">Choix unique</option><option value="multiple_choice">Choix multiples</option><option value="true_false">Vrai / Faux</option></select><Input value={question.prompt} placeholder="Question" onChange={(e) => updateQuestion(qi, { prompt: e.target.value })} /><Input type="number" min={1} max={100} value={question.points} onChange={(e) => updateQuestion(qi, { points: Number(e.target.value) })} /></div><Textarea className="mt-3" value={question.explanation} placeholder="Explication affichée après la correction" onChange={(e) => updateQuestion(qi, { explanation: e.target.value })} /><div className="mt-3 space-y-2">{question.options.map((option, oi) => <div key={oi} className="flex items-center gap-2"><input type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'} name={`correct-${qi}`} checked={option.is_correct} onChange={(e) => { if (question.type === 'multiple_choice') updateOption(qi, oi, { is_correct: e.target.checked }); else setDraft((current) => ({ ...current, questions: current.questions.map((item, index) => index === qi ? { ...item, options: item.options.map((candidate, optionIndex) => ({ ...candidate, is_correct: optionIndex === oi })) } : item) })); }} /><Input value={option.text} placeholder={`Réponse ${oi + 1}`} onChange={(e) => updateOption(qi, oi, { text: e.target.value })} /><Button type="button" size="icon" variant="ghost" disabled={question.options.length <= 2} onClick={() => updateQuestion(qi, { options: question.options.filter((_, index) => index !== oi) })}><Trash2 className="size-4" /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => updateQuestion(qi, { options: [...question.options, { text: '', is_correct: false }] })}><Plus className="mr-2 size-4" />Réponse</Button></div></div>)}</div>
                    <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setDraft((current) => ({ ...current, questions: [...current.questions, blankQuestion()] }))}><Plus className="mr-2 size-4" />Question</Button><Button type="button" onClick={submit}><CheckCircle2 className="mr-2 size-4" />{draft.id ? 'Enregistrer' : 'Créer'}</Button></div>
                </section>

                <aside className="space-y-6"><section className="academy-surface rounded-[calc(var(--radius)*1.25)] p-5"><div className="flex items-center gap-2"><Sparkles className="size-5 text-brand-primary" /><h2 className="font-semibold">Générer avec Academy AI</h2></div><p className="mt-2 text-sm text-muted-foreground">La génération reste une proposition : rien n’est matérialisé avant « Appliquer ».</p><Textarea className="mt-4" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} /><Button className="mt-3 w-full" type="button" onClick={() => router.post('/trainer/academy-ai/run', { capability: 'assessment.generate', prompt: aiPrompt, input: { course_id: course.id, module_id: draft.module_id, lesson_id: draft.lesson_id } }, { preserveScroll: true })}><Sparkles className="mr-2 size-4" />Générer une proposition</Button><div className="mt-4 space-y-2">{recentAiRuns.map((run) => <div key={run.id} className="rounded-lg border p-3 text-sm"><div className="flex items-center justify-between"><span className="font-medium">Run #{run.id}</span><span className="text-xs uppercase text-muted-foreground">{run.status}</span></div><p className="mt-1 line-clamp-2 text-muted-foreground">{run.prompt}</p>{run.status === 'succeeded' && !run.appliedAt && <Button size="sm" className="mt-2" type="button" onClick={() => router.post(`/trainer/academy-ai/runs/${run.id}/apply`, {}, { preserveScroll: true })}>Appliquer</Button>}</div>)}</div></section><section className="academy-surface rounded-[calc(var(--radius)*1.25)] p-5"><h2 className="font-semibold">Évaluations existantes</h2><div className="mt-4 space-y-3">{assessments.length === 0 && <p className="text-sm text-muted-foreground">Aucune évaluation pour le moment.</p>}{assessments.map((assessment) => <div key={assessment.id} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-2"><button className="text-left" type="button" onClick={() => edit(assessment)}><div className="font-medium">{assessment.title}</div><div className="text-xs text-muted-foreground">{assessment.questions.length} questions · {assessment.passingScorePercent}% · {assessment.attemptCount} tentative(s)</div></button><Button type="button" size="icon" variant="ghost" onClick={() => router.delete(`/trainer/courses/${course.id}/assessments/${assessment.id}`, { preserveScroll: true })}><Trash2 className="size-4" /></Button></div></div>)}</div></section></aside>
            </div>
        </div>
    </>;
}
