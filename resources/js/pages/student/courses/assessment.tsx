import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, CircleAlert, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Question = { id: number; type: 'single_choice' | 'multiple_choice' | 'true_false'; prompt: string; points: number; options: Array<{ id: number; text: string }> };
type Attempt = { id: number; attemptNumber: number; scorePoints: number; maxPoints: number; scorePercent: number; passed: boolean; completedAt: string | null; answers: Array<{ questionId: number; selectedOptionIds: number[]; isCorrect: boolean; awardedPoints: number; correctOptionIds: number[]; explanation: string | null }> };
type Props = {
    course: { id: number; title: string };
    assessment: { id: number; title: string; description: string | null; kind: 'quiz' | 'assessment'; passingScorePercent: number; maxAttempts: number | null; remainingAttempts: number | null; questionCount: number; questions: Question[] };
    lastAttempt: Attempt | null;
    attemptHistory: Array<{ id: number; attemptNumber: number; scorePercent: number; passed: boolean; completedAt: string | null }>;
};

export default function StudentAssessment({ course, assessment, lastAttempt, attemptHistory }: Props) {
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [processing, setProcessing] = useState(false);
    const resultByQuestion = new Map(lastAttempt?.answers.map((answer) => [answer.questionId, answer]) ?? []);
    const canAttempt = assessment.remainingAttempts === null || assessment.remainingAttempts > 0;

    const choose = (question: Question, optionId: number, checked: boolean) => setAnswers((current) => {
        if (question.type === 'multiple_choice') {
            const existing = current[question.id] ?? [];
            return { ...current, [question.id]: checked ? [...new Set([...existing, optionId])] : existing.filter((id) => id !== optionId) };
        }
        return { ...current, [question.id]: [optionId] };
    });

    const submit = () => {
        if (!canAttempt || processing) return;
        setProcessing(true);
        router.post(`/student/courses/${course.id}/assessments/${assessment.id}`, { answers }, { preserveScroll: true, onFinish: () => setProcessing(false) });
    };

    return <>
        <Head title={`${assessment.title} — ${course.title}`} />
        <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Link href={`/student/courses/${course.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Retour à la formation</Link>
            <section className="academy-surface rounded-[calc(var(--radius)*1.25)] p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4"><div><Badge variant="secondary">{assessment.kind === 'quiz' ? 'Quiz' : 'Évaluation'}</Badge><h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{assessment.title}</h1>{assessment.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{assessment.description}</p>}</div><ClipboardCheck className="size-8 text-primary" /></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border p-3 text-sm"><span className="text-muted-foreground">Questions</span><strong className="mt-1 block">{assessment.questionCount}</strong></div><div className="rounded-xl border p-3 text-sm"><span className="text-muted-foreground">Réussite</span><strong className="mt-1 block">{assessment.passingScorePercent}%</strong></div><div className="rounded-xl border p-3 text-sm"><span className="text-muted-foreground">Tentatives restantes</span><strong className="mt-1 block">{assessment.remainingAttempts === null ? 'Illimitées' : assessment.remainingAttempts}</strong></div></div>
            </section>

            {lastAttempt && <section className={cn('rounded-[calc(var(--radius)*1.25)] border p-5', lastAttempt.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5')}><div className="flex items-center gap-3">{lastAttempt.passed ? <CheckCircle2 className="size-6 text-emerald-600" /> : <CircleAlert className="size-6 text-amber-600" />}<div><h2 className="font-semibold">Dernière tentative · {lastAttempt.scorePercent}%</h2><p className="text-sm text-muted-foreground">{lastAttempt.scorePoints}/{lastAttempt.maxPoints} points · {lastAttempt.passed ? 'Réussi' : 'À revoir'}</p></div></div><Progress className="mt-4 h-2" value={lastAttempt.scorePercent} /></section>}

            <div className="space-y-4">{assessment.questions.map((question, index) => { const result = resultByQuestion.get(question.id); return <section key={question.id} className="academy-surface rounded-[calc(var(--radius)*1.1)] p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Question {index + 1}</p><h2 className="mt-2 font-semibold leading-6">{question.prompt}</h2></div><Badge variant="outline">{question.points} pt{question.points > 1 ? 's' : ''}</Badge></div><div className="mt-4 space-y-2">{question.options.map((option) => { const selected = (answers[question.id] ?? []).includes(option.id); const wasSelected = result?.selectedOptionIds.includes(option.id); const isCorrectAnswer = result?.correctOptionIds.includes(option.id); return <label key={option.id} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition', result && isCorrectAnswer && 'border-emerald-500/40 bg-emerald-500/5', result && wasSelected && !isCorrectAnswer && 'border-red-500/30 bg-red-500/5')}><input type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'} name={`question-${question.id}`} checked={selected} disabled={!canAttempt || processing} onChange={(e) => choose(question, option.id, e.target.checked)} /><span>{option.text}</span></label>; })}</div>{result?.explanation && <div className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground"><strong className="text-foreground">Explication :</strong> {result.explanation}</div>}</section>; })}</div>

            <div className="flex items-center justify-between gap-4 pb-8"><span className="text-sm text-muted-foreground">{attemptHistory.length} tentative{attemptHistory.length > 1 ? 's' : ''} enregistrée{attemptHistory.length > 1 ? 's' : ''}.</span><Button onClick={submit} disabled={!canAttempt || processing || assessment.questions.some((question) => (answers[question.id] ?? []).length === 0)}>{processing ? 'Correction…' : 'Corriger mon évaluation'}</Button></div>
        </div>
    </>;
}
