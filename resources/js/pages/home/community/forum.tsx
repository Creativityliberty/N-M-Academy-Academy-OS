import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, MessageSquareText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommunityPostCard } from '@/features/community/community-post-card';
import type { CommunityPageProps } from '@/features/community/types';
import { cn } from '@/lib/utils';

export default function Forum() {
    const { spaces, posts, filters } = usePage<CommunityPageProps>().props;
    const searchForm = useForm({ q: filters.q ?? '' });

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

            <div className="relative min-h-screen pt-20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.025] blur-[120px] dark:bg-primary/[0.04]" />
                </div>

                <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                            Des échanges qui restent utiles après le cours
                        </h1>
                        <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">
                            Questions, retours d’expérience, projets et
                            opportunités : la communauté rassemble les
                            conversations qui font progresser les membres.
                        </p>
                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            <Button asChild className="rounded-full px-5">
                                <Link href="/login">
                                    Rejoindre les échanges{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full px-5"
                            >
                                <Link href="/courses">
                                    Découvrir les formations
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
                            <div className="rounded-2xl border border-border/50 bg-background/70 p-3 backdrop-blur-sm">
                                <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                                    Espaces
                                </p>
                                <div className="space-y-1">
                                    <Link
                                        href={filterHref()}
                                        className={cn(
                                            'block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                            !filters.space
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                        )}
                                    >
                                        Tous les sujets
                                    </Link>
                                    {spaces.map((space) => (
                                        <Link
                                            key={space.id}
                                            href={filterHref(space.slug)}
                                            className={cn(
                                                'flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                                filters.space === space.slug
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                            )}
                                        >
                                            <span className="truncate">
                                                {space.name}
                                            </span>
                                            <span className="text-xs opacity-70">
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
                                        searchForm.setData(
                                            'q',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Rechercher dans la communauté…"
                                    className="h-11 rounded-full border-border/50 bg-background/70 pl-10 backdrop-blur-sm"
                                />
                            </form>

                            {posts.data.length > 0 ? (
                                posts.data.map((post) => (
                                    <CommunityPostCard
                                        key={post.id}
                                        post={post}
                                        interactive={false}
                                        canModerate={false}
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-6 py-16 text-center backdrop-blur-sm">
                                    <MessageSquareText className="mx-auto size-8 text-muted-foreground/50" />
                                    <h2 className="mt-4 font-semibold">
                                        Aucun échange trouvé
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Essayez un autre espace ou un autre
                                        mot-clé.
                                    </p>
                                </div>
                            )}

                            {posts.last_page > 1 ? (
                                <div className="flex items-center justify-between gap-3 pt-2">
                                    {posts.prev_page_url ? (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            <Link href={posts.prev_page_url}>
                                                Précédent
                                            </Link>
                                        </Button>
                                    ) : (
                                        <span />
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        Page {posts.current_page} /{' '}
                                        {posts.last_page}
                                    </span>
                                    {posts.next_page_url ? (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            <Link href={posts.next_page_url}>
                                                Suivant
                                            </Link>
                                        </Button>
                                    ) : (
                                        <span />
                                    )}
                                </div>
                            ) : null}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
