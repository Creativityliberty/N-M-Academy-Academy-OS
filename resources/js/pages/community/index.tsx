import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    MessageSquareText,
    Paperclip,
    Plus,
    Search,
    ShieldCheck,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CommunityPostCard } from '@/features/community/community-post-card';
import type { CommunityPageProps } from '@/features/community/types';
import { cn } from '@/lib/utils';

export default function CommunityIndex() {
    const { spaces, posts, filters, canModerate } =
        usePage<CommunityPageProps>().props;
    const searchForm = useForm({ q: filters.q ?? '' });
    const postForm = useForm<{
        community_space_id: number | '';
        title: string;
        body: string;
        attachments: File[];
    }>({
        community_space_id: spaces[0]?.id ?? '',
        title: '',
        body: '',
        attachments: [],
    });
    const spaceForm = useForm({ name: '', description: '' });

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            '/communaute/forum',
            {
                q: searchForm.data.q || undefined,
                space: filters.space || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const submitPost = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!postForm.data.community_space_id) {
            return;
        }

        postForm.post('/communaute/forum/posts', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => postForm.reset('title', 'body', 'attachments'),
        });
    };

    const submitSpace = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        spaceForm.post('/communaute/forum/spaces', {
            preserveScroll: true,
            onSuccess: () => spaceForm.reset(),
        });
    };

    const filterHref = (slug?: string) => {
        const params = new URLSearchParams();

        if (slug) {
            params.set('space', slug);
        }

        if (filters.q) {
            params.set('q', filters.q);
        }

        const query = params.toString();

        return `/communaute/forum${query ? `?${query}` : ''}`;
    };

    return (
        <>
            <Head title="Communauté" />

            <div className="mx-auto w-full max-w-[1480px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="La communauté"
                    description="Posez une question, partagez une avancée et gardez les échanges utiles au même endroit que vos formations."
                />

                <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)_290px]">
                    <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
                        <div className="rounded-[var(--academy-radius)] border border-border/60 bg-background/80 p-3 shadow-sm">
                            <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                                Espaces
                            </p>
                            <div className="space-y-1">
                                <Link
                                    href={filterHref()}
                                    preserveScroll
                                    className={cn(
                                        'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                        !filters.space
                                            ? 'bg-brand-primary-soft text-brand-secondary'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                    )}
                                >
                                    <span>Tous les sujets</span>
                                    <span className="text-xs">
                                        {posts.total}
                                    </span>
                                </Link>
                                {spaces.map((space) => (
                                    <Link
                                        key={space.id}
                                        href={filterHref(space.slug)}
                                        preserveScroll
                                        className={cn(
                                            'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                            filters.space === space.slug
                                                ? 'bg-brand-primary-soft text-brand-secondary'
                                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                        )}
                                    >
                                        <span className="truncate">
                                            {space.name}
                                        </span>
                                        <span className="text-xs">
                                            {space.postsCount ?? 0}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="min-w-0 space-y-4">
                        <form onSubmit={submitSearch} className="relative">
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchForm.data.q}
                                onChange={(event) =>
                                    searchForm.setData('q', event.target.value)
                                }
                                placeholder="Rechercher un sujet, un mot-clé ou un membre…"
                                className="h-11 rounded-xl bg-background/85 pl-10"
                            />
                        </form>

                        <form
                            onSubmit={submitPost}
                            className="rounded-[var(--academy-radius)] border border-border/60 bg-background/85 p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-secondary">
                                    <MessageSquareText className="size-4.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-semibold">
                                        Créer un sujet
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Une question claire obtient généralement
                                        de meilleures réponses.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3">
                                <select
                                    value={postForm.data.community_space_id}
                                    onChange={(event) =>
                                        postForm.setData(
                                            'community_space_id',
                                            event.target.value
                                                ? Number(event.target.value)
                                                : '',
                                        )
                                    }
                                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                >
                                    {spaces.map((space) => (
                                        <option key={space.id} value={space.id}>
                                            {space.name}
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    value={postForm.data.title}
                                    onChange={(event) =>
                                        postForm.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Titre du sujet"
                                    maxLength={180}
                                />
                                <Textarea
                                    value={postForm.data.body}
                                    onChange={(event) =>
                                        postForm.setData(
                                            'body',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Décrivez votre question, votre retour ou votre avancée…"
                                    rows={4}
                                    className="resize-y rounded-xl"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                                    <Paperclip className="size-3.5" />
                                    {postForm.data.attachments.length > 0
                                        ? `${postForm.data.attachments.length} fichier(s)`
                                        : 'Ajouter images / PDF'}
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                                        className="sr-only"
                                        onChange={(event) =>
                                            postForm.setData(
                                                'attachments',
                                                Array.from(
                                                    event.target.files ?? [],
                                                ).slice(0, 4),
                                            )
                                        }
                                    />
                                </label>
                                <Button
                                    type="submit"
                                    disabled={
                                        postForm.processing ||
                                        !postForm.data.community_space_id ||
                                        !postForm.data.title.trim() ||
                                        !postForm.data.body.trim()
                                    }
                                    className="rounded-xl"
                                >
                                    <Plus className="size-4" /> Publier
                                </Button>
                            </div>
                        </form>

                        {posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <CommunityPostCard
                                    key={post.id}
                                    post={post}
                                    interactive
                                    canModerate={canModerate}
                                />
                            ))
                        ) : (
                            <div className="rounded-[var(--academy-radius)] border border-dashed border-border/70 bg-muted/15 px-6 py-16 text-center">
                                <MessageSquareText className="mx-auto size-8 text-muted-foreground/60" />
                                <h2 className="mt-4 font-semibold">
                                    Aucun sujet ici pour le moment
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Lancez la première conversation utile dans
                                    cet espace.
                                </p>
                            </div>
                        )}

                        {posts.last_page > 1 ? (
                            <div className="flex items-center justify-between gap-3 pt-2">
                                {posts.prev_page_url ? (
                                    <Button variant="outline" asChild>
                                        <Link
                                            href={posts.prev_page_url}
                                            preserveScroll
                                        >
                                            Précédent
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled>
                                        Précédent
                                    </Button>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    Page {posts.current_page} /{' '}
                                    {posts.last_page}
                                </span>
                                {posts.next_page_url ? (
                                    <Button variant="outline" asChild>
                                        <Link
                                            href={posts.next_page_url}
                                            preserveScroll
                                        >
                                            Suivant
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled>
                                        Suivant
                                    </Button>
                                )}
                            </div>
                        ) : null}
                    </main>

                    <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
                        <div className="rounded-[var(--academy-radius)] border border-border/60 bg-brand-primary-soft/55 p-5">
                            <ShieldCheck className="size-5 text-brand-secondary" />
                            <h2 className="mt-3 font-semibold">
                                Une communauté utile
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Restez précis, respectueux et partagez assez de
                                contexte pour aider les autres à vous répondre.
                            </p>
                        </div>

                        {canModerate ? (
                            <form
                                onSubmit={submitSpace}
                                className="rounded-[var(--academy-radius)] border border-border/60 bg-background/85 p-5"
                            >
                                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                                    Modération
                                </p>
                                <h2 className="mt-2 font-semibold">
                                    Nouvel espace
                                </h2>
                                <div className="mt-3 space-y-2.5">
                                    <Input
                                        value={spaceForm.data.name}
                                        onChange={(event) =>
                                            spaceForm.setData(
                                                'name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Ex. Acquisition"
                                    />
                                    <Textarea
                                        value={spaceForm.data.description}
                                        onChange={(event) =>
                                            spaceForm.setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="À quoi sert cet espace ?"
                                        rows={3}
                                        className="resize-none"
                                    />
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        className="w-full"
                                        disabled={
                                            spaceForm.processing ||
                                            !spaceForm.data.name.trim()
                                        }
                                    >
                                        Créer l’espace
                                    </Button>
                                </div>
                            </form>
                        ) : null}
                    </aside>
                </div>
            </div>
        </>
    );
}
