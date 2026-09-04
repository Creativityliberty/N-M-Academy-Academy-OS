import {
    BrainCircuit,
    CheckCircle2,
    LoaderCircle,
    Send,
    Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Source = {
    label: string;
    chunkId: number;
    title: string;
    sourceType: string;
    lessonId: number | null;
    snippet: string;
};

type TutorMessage = {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
};

type QuizQuestion = {
    index: number;
    type: 'mcq' | 'true_false' | 'short';
    question: string;
    options: string[];
};

type Quiz = {
    id: number;
    title: string;
    questions: QuizQuestion[];
};

type Props = {
    courseId: number;
    lessonId?: number;
    lessonTitle: string;
    enabled: boolean;
    initialThreadId: number | null;
    initialMessages: TutorMessage[];
};

function csrfToken() {
    return document
        .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.getAttribute('content');
}

export function AiTutorPanel({
    courseId,
    lessonId,
    lessonTitle,
    enabled,
    initialThreadId,
    initialMessages,
}: Props) {
    const [threadId, setThreadId] = useState<number | null>(initialThreadId);
    const [messages, setMessages] = useState<TutorMessage[]>(initialMessages);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [pendingGeneral, setPendingGeneral] = useState<{
        capability: string;
        prompt: string;
    } | null>(null);
    const [quizResult, setQuizResult] = useState<{
        score: number;
        maxScore: number;
    } | null>(null);

    const suggestions = useMemo(
        () => [
            {
                capability: 'tutor.explain',
                label: 'Explique autrement',
                prompt: `Explique autrement la leçon « ${lessonTitle} » avec un exemple concret.`,
            },
            {
                capability: 'tutor.summarize',
                label: 'Résume',
                prompt: `Résume les points essentiels de la leçon « ${lessonTitle} ».`,
            },
            {
                capability: 'tutor.quiz',
                label: 'Quiz-moi',
                prompt: `Crée un quiz de révision sur la leçon « ${lessonTitle} ».`,
            },
            {
                capability: 'tutor.study_plan',
                label: 'Plan de révision',
                prompt: 'Crée un plan de révision réaliste pour progresser sur cette formation.',
            },
        ],
        [lessonTitle],
    );

    async function run(capability: string, text: string, allowGeneral = false) {
        if (!enabled || !text.trim() || loading) {
            return;
        }

        setLoading(true);
        setError(null);
        setQuizResult(null);
        setPendingGeneral(null);
        setMessages((items) => [
            ...items,
            { role: 'user', content: text.trim() },
        ]);

        try {
            const response = await fetch(`/student/courses/${courseId}/tutor`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken() ?? '',
                },
                body: JSON.stringify({
                    capability,
                    prompt: text.trim(),
                    lesson_id: lessonId ?? null,
                    thread_id: threadId,
                    allow_general: allowGeneral,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ??
                        data?.errors?.limit?.[0] ??
                        'Le Tutor est indisponible.',
                );
            }

            setThreadId(data.threadId);
            setMessages((items) => [
                ...items,
                {
                    role: 'assistant',
                    content: data.answer,
                    sources: data.sources ?? [],
                },
            ]);

            if (data.needsGeneralPermission) {
                setPendingGeneral({ capability, prompt: text.trim() });
            }

            if (data.quiz) {
                setQuiz(data.quiz);
                setQuizAnswers({});
            }

            setPrompt('');
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : 'Le Tutor est indisponible.',
            );
        } finally {
            setLoading(false);
        }
    }

    async function submitQuiz() {
        if (!quiz || loading) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/student/tutor/quizzes/${quiz.id}/submit`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken() ?? '',
                    },
                    body: JSON.stringify({ answers: quizAnswers }),
                },
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message ?? 'Quiz invalide.');
            }

            setQuizResult({ score: data.score, maxScore: data.maxScore });
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : 'Quiz invalide.',
            );
        } finally {
            setLoading(false);
        }
    }

    if (!enabled) {
        return (
            <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
                <BrainCircuit className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-semibold">
                    AI Tutor indisponible
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Cette formation n’utilise pas encore le Tutor privé de
                    l’Academy.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5 py-5">
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                    <Button
                        key={suggestion.capability}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        disabled={loading}
                        onClick={() =>
                            run(suggestion.capability, suggestion.prompt)
                        }
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        {suggestion.label}
                    </Button>
                ))}
            </div>

            <div className="max-h-[520px] space-y-3 overflow-y-auto rounded-xl border border-border/50 bg-background/65 p-3 sm:p-4">
                {messages.length === 0 && (
                    <div className="py-10 text-center">
                        <BrainCircuit className="mx-auto h-8 w-8 text-primary/60" />
                        <p className="mt-3 text-sm font-semibold">
                            Posez une question sur votre formation
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Les réponses utilisent uniquement les contenus
                            auxquels vous avez accès.
                        </p>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={
                            message.role === 'user'
                                ? 'ml-auto max-w-[88%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground'
                                : 'max-w-[94%] rounded-2xl border border-border/50 bg-card px-4 py-3 text-sm leading-6'
                        }
                    >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.sources && message.sources.length > 0 && (
                            <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
                                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                    Sources Academy
                                </p>
                                {message.sources.map((source) => (
                                    <div
                                        key={`${source.label}-${source.chunkId}`}
                                        className="text-xs text-muted-foreground"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="mr-2 px-1.5 py-0 text-[10px]"
                                        >
                                            {source.label}
                                        </Badge>
                                        {source.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Le Tutor consulte votre formation…
                    </div>
                )}
            </div>

            {quiz && (
                <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold">
                                {quiz.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {quiz.questions.length} questions
                            </p>
                        </div>
                        {quizResult && (
                            <Badge className="gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {quizResult.score}/{quizResult.maxScore}
                            </Badge>
                        )}
                    </div>
                    {quiz.questions.map((question) => (
                        <div
                            key={question.index}
                            className="space-y-2 rounded-xl bg-background/75 p-3"
                        >
                            <p className="text-sm font-medium">
                                {question.index + 1}. {question.question}
                            </p>
                            {question.options.length > 0 ? (
                                <div className="grid gap-2">
                                    {question.options.map((option) => (
                                        <label
                                            key={option}
                                            className="flex cursor-pointer items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${question.index}`}
                                                value={option}
                                                checked={
                                                    quizAnswers[
                                                        question.index
                                                    ] === option
                                                }
                                                onChange={() =>
                                                    setQuizAnswers(
                                                        (answers) => ({
                                                            ...answers,
                                                            [question.index]:
                                                                option,
                                                        }),
                                                    )
                                                }
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <Input
                                    value={quizAnswers[question.index] ?? ''}
                                    onChange={(event) =>
                                        setQuizAnswers((answers) => ({
                                            ...answers,
                                            [question.index]:
                                                event.target.value,
                                        }))
                                    }
                                    placeholder="Votre réponse"
                                />
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={submitQuiz}
                        disabled={loading}
                        className="rounded-full"
                    >
                        Corriger mon quiz
                    </Button>
                </div>
            )}

            {pendingGeneral && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
                    <p className="text-xs text-muted-foreground">
                        La réponse générale sortira du contenu de cette Academy
                        et n’aura pas de source de cours.
                    </p>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() =>
                            run(
                                pendingGeneral.capability,
                                pendingGeneral.prompt,
                                true,
                            )
                        }
                    >
                        Autoriser une explication générale
                    </Button>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
                <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Je n’ai pas compris…"
                    className="min-h-20 resize-none bg-background/80"
                />
                <Button
                    type="button"
                    size="icon"
                    className="mt-auto shrink-0 rounded-full"
                    disabled={!prompt.trim() || loading}
                    onClick={() => run('tutor.ask', prompt)}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
