import { Link, router, useForm } from '@inertiajs/react';
import {
    FileText,
    Heart,
    Lightbulb,
    Lock,
    MessageCircle,
    MoreHorizontal,
    PartyPopper,
    Pin,
    ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import type {
    CommunityComment,
    CommunityPost,
    CommunityReactionType,
} from '@/features/community/types';
import { cn } from '@/lib/utils';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

const reactionConfig: Record<
    CommunityReactionType,
    { label: string; icon: typeof Heart }
> = {
    like: { label: 'J’aime', icon: Heart },
    celebrate: { label: 'Bravo', icon: PartyPopper },
    insightful: { label: 'Utile', icon: Lightbulb },
};

function initials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

function formatDate(value: string | null) {
    if (!value) {
        return '';
    }

    try {
        return dateFormatter.format(new Date(value));
    } catch {
        return '';
    }
}

function formatBytes(bytes: number) {
    if (bytes < 1024) {
        return `${bytes} o`;
    }

    if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} Ko`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function ReactionBar({
    targetType,
    targetId,
    reactions,
    interactive,
}: {
    targetType: 'post' | 'comment';
    targetId: number;
    reactions: CommunityPost['reactions'];
    interactive: boolean;
}) {
    const toggle = (type: CommunityReactionType) => {
        if (!interactive) {
            return;
        }

        router.post(
            '/communaute/forum/reactions',
            {
                target_type: targetType,
                target_id: targetId,
                type,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {(Object.keys(reactionConfig) as CommunityReactionType[]).map(
                (type) => {
                    const config = reactionConfig[type];
                    const Icon = config.icon;
                    const state = reactions[type];

                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggle(type)}
                            disabled={!interactive}
                            className={cn(
                                'inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors',
                                state.reacted
                                    ? 'border-brand-primary/30 bg-brand-primary-soft text-brand-secondary'
                                    : 'border-border/60 bg-background/70 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                !interactive && 'cursor-default',
                            )}
                            aria-label={`${config.label}: ${state.count}`}
                        >
                            <Icon className="size-3.5" />
                            <span>{config.label}</span>
                            {state.count > 0 ? (
                                <span>{state.count}</span>
                            ) : null}
                        </button>
                    );
                },
            )}
        </div>
    );
}

function CommentRow({
    comment,
    interactive,
    canModerate,
}: {
    comment: CommunityComment;
    interactive: boolean;
    canModerate: boolean;
}) {
    const moderate = (action: 'hide' | 'restore') => {
        router.patch(
            `/communaute/forum/comments/${comment.id}/moderation`,
            { action },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <div
            className={cn(
                'rounded-xl border border-border/50 bg-muted/20 p-3.5',
                comment.isHidden && 'border-destructive/30 bg-destructive/5',
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-[11px] font-semibold text-brand-secondary">
                        {initials(comment.author.name)}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold">
                                {comment.author.name}
                            </span>
                            {comment.isHidden ? (
                                <Badge variant="destructive">Masqué</Badge>
                            ) : null}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            {formatDate(comment.createdAt)}
                        </p>
                    </div>
                </div>

                {canModerate ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                            >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">
                                    Modérer le commentaire
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={() =>
                                    moderate(
                                        comment.isHidden ? 'restore' : 'hide',
                                    )
                                }
                            >
                                <ShieldCheck className="size-4" />
                                {comment.isHidden ? 'Restaurer' : 'Masquer'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}
            </div>

            <p className="mt-3 text-sm leading-6 whitespace-pre-wrap text-foreground/80">
                {comment.body}
            </p>

            <div className="mt-3">
                <ReactionBar
                    targetType="comment"
                    targetId={comment.id}
                    reactions={comment.reactions}
                    interactive={interactive}
                />
            </div>
        </div>
    );
}

export function CommunityPostCard({
    post,
    interactive,
    canModerate,
}: {
    post: CommunityPost;
    interactive: boolean;
    canModerate: boolean;
}) {
    const commentForm = useForm({ body: '' });

    const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!commentForm.data.body.trim()) {
            return;
        }

        commentForm.post(`/communaute/forum/posts/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    const moderate = (
        action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'hide' | 'restore',
    ) => {
        router.patch(
            `/communaute/forum/posts/${post.id}/moderation`,
            { action },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <article
            className={cn(
                'rounded-[var(--academy-radius)] border border-border/60 bg-background/85 p-5 shadow-[0_16px_44px_-34px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6',
                post.isPinned && 'border-brand-primary/30',
                post.isHidden && 'border-destructive/35 bg-destructive/[0.025]',
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-xs font-semibold text-brand-secondary">
                        {initials(post.author.name)}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                {post.author.name}
                            </span>
                            <span>•</span>
                            <span>{formatDate(post.createdAt)}</span>
                            <Badge
                                variant="outline"
                                className="border-brand-primary/20 bg-brand-primary-soft/60 text-brand-secondary"
                            >
                                {post.space.name}
                            </Badge>
                            {post.isPinned ? (
                                <Badge variant="secondary" className="gap-1">
                                    <Pin className="size-3" /> Épinglé
                                </Badge>
                            ) : null}
                            {post.isLocked ? (
                                <Badge variant="secondary" className="gap-1">
                                    <Lock className="size-3" /> Fermé
                                </Badge>
                            ) : null}
                            {post.isHidden ? (
                                <Badge variant="destructive">Masqué</Badge>
                            ) : null}
                        </div>
                    </div>
                </div>

                {canModerate ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-9"
                            >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">
                                    Options de modération
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                                onSelect={() =>
                                    moderate(post.isPinned ? 'unpin' : 'pin')
                                }
                            >
                                <Pin className="size-4" />
                                {post.isPinned ? 'Désépingler' : 'Épingler'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    moderate(post.isLocked ? 'unlock' : 'lock')
                                }
                            >
                                <Lock className="size-4" />
                                {post.isLocked
                                    ? 'Rouvrir'
                                    : 'Fermer les réponses'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant={
                                    post.isHidden ? 'default' : 'destructive'
                                }
                                onSelect={() =>
                                    moderate(post.isHidden ? 'restore' : 'hide')
                                }
                            >
                                <ShieldCheck className="size-4" />
                                {post.isHidden ? 'Restaurer' : 'Masquer'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}
            </div>

            <div className="mt-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-foreground/75 sm:text-[15px]">
                    {post.body}
                </p>
            </div>

            {post.attachments.length > 0 ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {post.attachments.map((attachment) =>
                        attachment.mimeType.startsWith('image/') ? (
                            <a
                                key={attachment.id}
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="overflow-hidden rounded-xl border border-border/60 bg-muted/20"
                            >
                                <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="aspect-[16/9] w-full object-cover"
                                />
                                <div className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                                    <span className="truncate font-medium">
                                        {attachment.name}
                                    </span>
                                    <span className="shrink-0 text-muted-foreground">
                                        {formatBytes(attachment.size)}
                                    </span>
                                </div>
                            </a>
                        ) : (
                            <a
                                key={attachment.id}
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-sm transition-colors hover:bg-muted/40"
                            >
                                <div className="flex size-9 items-center justify-center rounded-lg bg-brand-primary-soft text-brand-secondary">
                                    <FileText className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {attachment.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatBytes(attachment.size)}
                                    </p>
                                </div>
                            </a>
                        ),
                    )}
                </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                <ReactionBar
                    targetType="post"
                    targetId={post.id}
                    reactions={post.reactions}
                    interactive={interactive}
                />
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MessageCircle className="size-3.5" />
                    {post.commentsCount} réponse
                    {post.commentsCount > 1 ? 's' : ''}
                </div>
            </div>

            {post.comments.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                    {post.comments.map((comment) => (
                        <CommentRow
                            key={comment.id}
                            comment={comment}
                            interactive={interactive}
                            canModerate={canModerate}
                        />
                    ))}
                    {post.commentsCount > post.comments.length ? (
                        <p className="px-1 text-xs text-muted-foreground">
                            {post.commentsCount - post.comments.length}{' '}
                            réponse(s) plus ancienne(s) non affichée(s) dans ce
                            feed.
                        </p>
                    ) : null}
                </div>
            ) : null}

            {interactive && !post.isLocked && !post.isHidden ? (
                <form onSubmit={submitComment} className="mt-4 flex gap-2.5">
                    <Textarea
                        value={commentForm.data.body}
                        onChange={(event) =>
                            commentForm.setData('body', event.target.value)
                        }
                        placeholder="Écrire une réponse…"
                        rows={2}
                        className="min-h-20 resize-none rounded-xl"
                    />
                    <Button
                        type="submit"
                        disabled={
                            commentForm.processing ||
                            !commentForm.data.body.trim()
                        }
                        className="self-end rounded-xl"
                    >
                        Répondre
                    </Button>
                </form>
            ) : !interactive ? (
                <div className="mt-4 rounded-xl border border-dashed border-border/70 bg-muted/15 px-4 py-3 text-sm text-muted-foreground">
                    <Link
                        href="/login"
                        className="font-semibold text-foreground hover:underline"
                    >
                        Connectez-vous
                    </Link>{' '}
                    pour réagir et participer à la discussion.
                </div>
            ) : null}
        </article>
    );
}
