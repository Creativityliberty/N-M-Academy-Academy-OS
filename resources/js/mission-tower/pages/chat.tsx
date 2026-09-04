import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Bot,
    Check,
    CheckCircle2,
    CircleAlert,
    Copy,
    MessageSquarePlus,
    RotateCcw,
    Sparkles,
    UserRound,
} from 'lucide-react';
import {
    type FormEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { ThinkingOrbVisual } from '@/components/ai/thinking-orb-visual';
import { Button } from '@/components/ui/button';
import { RichMarkdown } from '@/mission-tower/components/rich-markdown';
import { TowerActivityOrb } from '@/mission-tower/components/tower-activity-orb';
import {
    TowerApprovalCard,
    type TowerApproval,
} from '@/mission-tower/components/tower-approval-card';
import { TowerComposer } from '@/mission-tower/components/tower-composer';
import {
    TowerEvidenceCard,
    type TowerEvidenceItem,
} from '@/mission-tower/components/tower-evidence-card';
import { TowerMissionCard } from '@/mission-tower/components/tower-mission-card';
import {
    TowerToolCard,
    type TowerToolStep,
} from '@/mission-tower/components/tower-tool-card';
import { TowerNav } from '@/mission-tower/components/tower-nav';

type Thread = {
    id: number;
    title: string;
    status: string;
    lastMessageAt?: string | null;
};

type Message = {
    id: number;
    role: 'user' | 'assistant';
    type: string;
    status: string;
    content: string;
    metadata: Record<string, unknown> & {
        tool?: string;
        risk?: string;
        arguments?: Record<string, unknown>;
        required_phrase?: string | null;
        expires_at?: string | null;
        receipt_id?: string | null;
        run_status?: string;
    };
    mission?: { id: number; title: string; status: string } | null;
    run?: { id: number; status: string } | null;
    approval?: TowerApproval | null;
    tools?: TowerToolStep[];
    evidence?: TowerEvidenceItem[];
    evidenceCount?: number;
    createdAt?: string | null;
};

type Connection = {
    ready: boolean;
    tools: number;
    read: number;
    write: number;
    sensitive: number;
};

type MessageActionsProps = {
    message: Message;
    previousUserContent?: string;
    copied: boolean;
    retrying: boolean;
    copyMessage: (message: Message) => void;
    retryMessage: (message: Message, prompt: string) => void;
};

function MessageActions({
    message,
    previousUserContent,
    copied,
    retrying,
    copyMessage,
    retryMessage,
}: MessageActionsProps) {
    return (
        <div className="mt-1.5 flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs text-muted-foreground"
                onClick={() => copyMessage(message)}
            >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? 'Copié' : 'Copier'}
            </Button>
            {previousUserContent ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2 text-xs text-muted-foreground"
                    disabled={retrying}
                    onClick={() => retryMessage(message, previousUserContent)}
                >
                    <RotateCcw className={retrying ? 'size-3.5 motion-safe:animate-spin motion-reduce:animate-none' : 'size-3.5'} />
                    {retrying ? 'Relance…' : 'Réessayer'}
                </Button>
            ) : null}
        </div>
    );
}

function ChatMessage({
    threadId,
    message,
    previousUserContent,
    copied,
    retrying,
    copyMessage,
    retryMessage,
}: {
    threadId: number;
    message: Message;
    previousUserContent?: string;
    copied: boolean;
    retrying: boolean;
    copyMessage: (message: Message) => void;
    retryMessage: (message: Message, prompt: string) => void;
}) {
    const user = message.role === 'user';
    const toolSteps =
        message.tools && message.tools.length > 0
            ? message.tools
            : message.metadata.tool
              ? [
                    {
                        tool: message.metadata.tool,
                        risk: message.metadata.risk,
                        status:
                            message.type === 'approval_required'
                                ? 'awaiting_approval'
                                : message.status,
                    },
                ]
              : [];

    if (user) {
        return (
            <div className="flex justify-end gap-2.5">
                <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-brand-primary px-4 py-3 text-sm leading-6 text-white shadow-sm sm:max-w-[72%]">
                    <p className="whitespace-pre-line break-words">{message.content}</p>
                </div>
                <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-muted text-foreground">
                    <UserRound className="size-3.5" />
                </div>
            </div>
        );
    }

    return (
        <div className="group flex gap-3">
            <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                <Bot className="size-3.5" />
            </div>
            <article className="min-w-0 max-w-[980px] flex-1 pb-2">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="text-foreground">Tower</span>
                    {message.status !== 'complete' ? <span>· {message.status.replaceAll('_', ' ')}</span> : null}
                </div>

                {message.type === 'error' ? (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                        <RichMarkdown content={message.content} />
                    </div>
                ) : (
                    <RichMarkdown content={message.content} />
                )}

                {toolSteps.length > 0 ? (
                    <details className="mt-4" open={toolSteps.length <= 2}>
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            Exécution · {toolSteps.length} tool(s)
                        </summary>
                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                            {toolSteps.map((step, index) => (
                                <TowerToolCard key={`${step.tool}-${step.position ?? index}`} step={step} />
                            ))}
                        </div>
                    </details>
                ) : null}

                {message.type === 'approval_required' && message.approval ? (
                    <div className="mt-4">
                        <TowerApprovalCard
                            threadId={threadId}
                            approval={message.approval}
                            arguments={message.metadata.arguments}
                            requiredPhrase={message.metadata.required_phrase}
                        />
                    </div>
                ) : null}

                {message.mission ? (
                    <div className="mt-4">
                        <TowerMissionCard mission={message.mission} run={message.run} />
                    </div>
                ) : null}

                {message.evidence && (message.evidence.length > 0 || message.evidenceCount) ? (
                    <div className="mt-3">
                        <TowerEvidenceCard items={message.evidence} count={message.evidenceCount} />
                    </div>
                ) : null}

                <MessageActions
                    message={message}
                    previousUserContent={previousUserContent}
                    copied={copied}
                    retrying={retrying}
                    copyMessage={copyMessage}
                    retryMessage={retryMessage}
                />
            </article>
        </div>
    );
}

export default function TowerChat({
    thread,
    threads,
    messages,
    connection,
    maxMessageLength,
}: {
    thread?: Thread | null;
    threads: Thread[];
    messages: Message[];
    connection: Connection;
    maxMessageLength: number;
}) {
    const form = useForm({ message: '' });
    const messagesAreaRef = useRef<HTMLDivElement>(null);
    const nearBottomRef = useRef(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [retryingId, setRetryingId] = useState<number | null>(null);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.data.message.trim()) return;

        nearBottomRef.current = true;
        form.post(
            thread
                ? `/tower/chat/${thread.id}/messages`
                : '/tower/chat/messages',
            {
                preserveScroll: true,
                onSuccess: () => form.reset('message'),
            },
        );
    };

    const copyMessage = async (message: Message) => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopiedId(message.id);
            window.setTimeout(() => setCopiedId(null), 1400);
        } catch {
            setCopiedId(null);
        }
    };

    const retryMessage = (message: Message, prompt: string) => {
        if (!thread || retryingId !== null) return;
        setRetryingId(message.id);
        nearBottomRef.current = true;
        router.post(
            `/tower/chat/${thread.id}/messages`,
            { message: prompt },
            {
                preserveScroll: true,
                onFinish: () => setRetryingId(null),
            },
        );
    };

    const handleConversationScroll = () => {
        const area = messagesAreaRef.current;
        if (!area) return;
        nearBottomRef.current = area.scrollHeight - area.scrollTop - area.clientHeight < 180;
    };

    useEffect(() => {
        const area = messagesAreaRef.current;
        if (area && nearBottomRef.current) {
            area.scrollTo({ top: area.scrollHeight, behavior: 'smooth' });
        }
    }, [messages.length, form.processing]);

    return (
        <>
            <Head title="Mission Tower — Chat" />
            <div className="mx-auto w-full max-w-[1540px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/60 to-background/80 p-6 backdrop-blur-xl shadow-lg sm:p-8">
                    <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Tower Chat
                                </h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-brand-primary"></span>
                                    </span>
                                    {connection.ready ? `${connection.tools} Outils MCP Prêts` : 'MCP Initialisation'}
                                </span>
                            </div>
                            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Dialoguez directement avec l'IA de votre Academy. Tower orchestre vos missions, exécute les tools MCP autorisés et soumet les approvals métier.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center justify-center p-2 rounded-2xl bg-muted/20 border border-border/40 backdrop-blur-md">
                            <ThinkingOrbVisual state={form.processing ? 'working' : 'breathing'} size={64} label="Orb Chat State" />
                        </div>
                    </div>
                </div>
                <TowerNav />

                <div className="grid min-h-[680px] gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="academy-panel overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        <div className="border-b border-border/70 p-4">
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/tower/chat">
                                    <MessageSquarePlus className="mr-2 size-4" />
                                    Nouvelle conversation
                                </Link>
                            </Button>
                        </div>
                        <div className="max-h-[650px] overflow-y-auto p-2">
                            {threads.length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">Votre première conversation apparaîtra ici.</p>
                            ) : (
                                threads.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/tower/chat/${item.id}`}
                                        className={`block rounded-xl px-3 py-3 text-sm transition-colors ${
                                            thread?.id === item.id
                                                ? 'bg-brand-primary-soft text-brand-primary'
                                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                        }`}
                                    >
                                        <p className="line-clamp-2 font-medium">{item.title}</p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </aside>

                    <section className="academy-panel flex min-h-[680px] flex-col overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
                            <div>
                                <p className="text-sm font-semibold">{thread?.title ?? 'Nouvelle conversation'}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {connection.tools} tools accessibles · {connection.read} READ · {connection.write} WRITE · {connection.sensitive} SENSITIVE
                                </p>
                            </div>
                            <div
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                                    connection.ready
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                }`}
                            >
                                {connection.ready ? <CheckCircle2 className="size-3.5" /> : <CircleAlert className="size-3.5" />}
                                {connection.ready ? 'Tower connectée' : 'Configuration à vérifier'}
                            </div>
                        </div>

                        <div
                            ref={messagesAreaRef}
                            onScroll={handleConversationScroll}
                            className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8"
                        >
                            {messages.length === 0 ? (
                                <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
                                    <div className="grid size-14 place-items-center rounded-2xl bg-brand-primary-soft text-brand-primary">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <h2 className="mt-5 text-xl font-semibold">Que veux-tu faire ?</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Demande une analyse, une action ou un résultat. Les lectures sont exécutées automatiquement ; les actions gouvernées apparaissent ici pour validation.
                                    </p>
                                    <div className="mt-5 grid gap-2 text-left text-sm text-muted-foreground sm:grid-cols-2">
                                        <span className="rounded-xl border border-border/70 p-3">« Qu’est-ce qui nécessite mon attention ? »</span>
                                        <span className="rounded-xl border border-border/70 p-3">« Analyse mes ventes cette semaine. »</span>
                                        <span className="rounded-xl border border-border/70 p-3">« Prépare un événement jeudi. »</span>
                                        <span className="rounded-xl border border-border/70 p-3">« Rembourse cette commande. »</span>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message, index) => {
                                    let previousUserContent: string | undefined;
                                    if (message.role === 'assistant') {
                                        for (let cursor = index - 1; cursor >= 0; cursor--) {
                                            if (messages[cursor].role === 'user' && messages[cursor].type === 'text') {
                                                previousUserContent = messages[cursor].content;
                                                break;
                                            }
                                        }
                                    }

                                    return (
                                        <ChatMessage
                                            key={message.id}
                                            threadId={thread!.id}
                                            message={message}
                                            previousUserContent={previousUserContent}
                                            copied={copiedId === message.id}
                                            retrying={retryingId === message.id}
                                            copyMessage={copyMessage}
                                            retryMessage={retryMessage}
                                        />
                                    );
                                })
                            )}

                            {form.processing ? (
                                <div className="ml-11 max-w-[760px]">
                                    <TowerActivityOrb />
                                </div>
                            ) : null}
                        </div>

                        <TowerComposer
                            value={form.data.message}
                            onChange={(value) => form.setData('message', value)}
                            onSubmit={submit}
                            processing={form.processing}
                            maxLength={maxMessageLength}
                            error={form.errors.message}
                        />
                    </section>
                </div>
            </div>
        </>
    );
}
