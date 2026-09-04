import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Eye, FileText, LayoutTemplate, Plus } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import trainer from '@/routes/trainer';

type PageItem = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    pageType: string;
    sectionsCount: number;
    publicUrl: string;
};

type Props = { pages: PageItem[] };

export default function PagesIndex() {
    const { pages } = usePage<Props>().props;

    return (
        <>
            <Head title="Pages" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Page Builder"
                    description="Composez des pages premium avec des blocs structurés reliés aux vraies formations et offres de votre Academy."
                />
                <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                    <DashboardSection
                        title="Nouvelle page"
                        description="Créez un brouillon avec une structure de départ éditable."
                    >
                        <Form
                            action="/trainer/pages"
                            method="post"
                            className="academy-panel space-y-3 rounded-2xl p-5"
                        >
                            <Input
                                name="title"
                                required
                                placeholder="Ex. AI Business Mastery"
                            />
                            <Input
                                name="slug"
                                placeholder="ai-business-mastery"
                            />
                            <select
                                name="page_type"
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                            >
                                <option value="landing">Landing page</option>
                                <option value="sales">Page de vente</option>
                                <option value="course">Page formation</option>
                                <option value="about">À propos</option>
                            </select>
                            <Button className="w-full">
                                <Plus className="mr-2 size-4" />
                                Créer la page
                            </Button>
                        </Form>
                    </DashboardSection>
                    <DashboardSection
                        title="Vos pages"
                        description={`${pages.length} page(s) dans ce workspace.`}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {pages.map((page) => (
                                <div
                                    key={page.id}
                                    className="academy-panel rounded-2xl p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                                                <LayoutTemplate className="size-3.5" />
                                                {page.pageType}
                                            </div>
                                            <h3 className="mt-2 text-lg font-semibold">
                                                {page.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                /p/{page.slug} ·{' '}
                                                {page.sectionsCount} blocs
                                            </p>
                                        </div>
                                        <span className="rounded-full border px-2.5 py-1 text-xs">
                                            {page.status === 'published'
                                                ? 'Publié'
                                                : 'Brouillon'}
                                        </span>
                                    </div>
                                    <div className="mt-5 flex gap-2">
                                        <Button asChild size="sm">
                                            <Link
                                                href={`/trainer/pages/${page.id}/edit`}
                                            >
                                                <FileText className="mr-2 size-4" />
                                                Éditer
                                            </Link>
                                        </Button>
                                        {page.status === 'published' && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <a
                                                    href={page.publicUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Eye className="mr-2 size-4" />
                                                    Voir
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {pages.length === 0 && (
                                <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                    Aucune page pour le moment.
                                </div>
                            )}
                        </div>
                    </DashboardSection>
                </div>
            </div>
        </>
    );
}

PagesIndex.layout = {
    breadcrumbs: [
        { title: 'Creator Studio', href: trainer.dashboard() },
        { title: 'Pages', href: '/trainer/pages' },
    ],
};
