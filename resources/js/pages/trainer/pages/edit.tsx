import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Eye,
    GripVertical,
    LayoutPanelLeft,
    Plus,
    Save,
    Send,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageRenderer } from '@/components/page-builder/page-renderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import trainer from '@/routes/trainer';

type Block = { type: string; label: string; variants: string[] };
type Course = {
    id: number;
    title: string;
    offers: Array<{
        id: number;
        name: string;
        amount: number;
        currency: string;
    }>;
};
type Section = {
    id: number;
    type: string;
    variant: string;
    settings: Record<string, any>;
    data: Record<string, any>;
};
type Props = {
    page: {
        id: number;
        title: string;
        slug: string;
        pageType: string;
        status: string;
        metaTitle?: string;
        metaDescription?: string;
        publicUrl: string;
        previewUrl: string;
    };
    sections: Section[];
    blocks: Block[];
    courses: Course[];
};

function itemsToText(
    type: string,
    items: Array<Record<string, any>> | string[] = [],
) {
    return items
        .map((item: any) => {
            if (typeof item === 'string') {
                return item;
            }

            if (type === 'testimonials') {
                return `${item.name || ''} | ${item.quote || ''}`;
            }

            if (type === 'faq') {
                return `${item.question || ''} | ${item.answer || ''}`;
            }

            if (type === 'footer') {
                return `${item.label || ''} | ${item.url || ''}`;
            }

            return `${item.title || ''} | ${item.description || ''}`;
        })
        .join('\n');
}

function textToItems(type: string, value: string) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [left, ...rest] = line.split('|');
            const right = rest.join('|').trim();

            if (type === 'testimonials') {
                return { name: left.trim(), quote: right };
            }

            if (type === 'faq') {
                return { question: left.trim(), answer: right };
            }

            if (type === 'footer') {
                return { label: left.trim(), url: right };
            }

            return right
                ? { title: left.trim(), description: right }
                : left.trim();
        });
}

export default function PageEdit() {
    const { page, sections, blocks, courses } = usePage<Props>().props;
    const [selectedId, setSelectedId] = useState<number | null>(
        sections[0]?.id ?? null,
    );
    const [dragId, setDragId] = useState<number | null>(null);
    const selected = useMemo(
        () => sections.find((s) => s.id === selectedId) ?? null,
        [sections, selectedId],
    );
    const meta = useForm({
        title: page.title,
        slug: page.slug,
        page_type: page.pageType,
        meta_title: page.metaTitle || '',
        meta_description: page.metaDescription || '',
    });
    const [draftSettings, setDraftSettings] = useState<Record<string, any>>(
        selected?.settings ?? {},
    );
    const selectSection = (s: Section) => {
        setSelectedId(s.id);
        setDraftSettings(s.settings ?? {});
    };
    const patch = (key: string, value: any) =>
        setDraftSettings((old) => ({ ...old, [key]: value }));
    const saveSection = () =>
        selected &&
        router.patch(
            `/trainer/pages/${page.id}/sections/${selected.id}`,
            {
                variant: selected.variant,
                settings: draftSettings,
                is_visible: true,
            },
            { preserveScroll: true },
        );
    const reorder = (targetId: number) => {
        if (!dragId || dragId === targetId) {
            return;
        }

        const ids = sections.map((s) => s.id);
        const from = ids.indexOf(dragId);
        const to = ids.indexOf(targetId);
        ids.splice(to, 0, ids.splice(from, 1)[0]);
        router.post(
            `/trainer/pages/${page.id}/sections/reorder`,
            { section_ids: ids },
            { preserveScroll: true },
        );
        setDragId(null);
    };

    return (
        <>
            <Head title={`Builder — ${page.title}`} />
            <div className="min-h-screen bg-muted/20">
                <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Page Builder
                        </p>
                        <h1 className="font-semibold">{page.title}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <a
                                href={page.previewUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Eye className="mr-2 size-4" />
                                Aperçu
                            </a>
                        </Button>
                        {page.status === 'published' ? (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    router.post(
                                        `/trainer/pages/${page.id}/unpublish`,
                                    )
                                }
                            >
                                Dépublier
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() =>
                                    router.post(
                                        `/trainer/pages/${page.id}/publish`,
                                    )
                                }
                            >
                                <Send className="mr-2 size-4" />
                                Publier
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid min-h-[calc(100vh-65px)] xl:grid-cols-[260px_minmax(0,1fr)_320px]">
                    <aside className="border-r bg-background p-4">
                        <p className="mb-3 text-xs font-semibold tracking-[.16em] text-muted-foreground uppercase">
                            Blocs
                        </p>
                        <div className="space-y-2">
                            {blocks.map((block) => (
                                <button
                                    key={block.type}
                                    className="flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm hover:bg-muted"
                                    onClick={() =>
                                        router.post(
                                            `/trainer/pages/${page.id}/sections`,
                                            {
                                                type: block.type,
                                                variant: block.variants[0],
                                                settings: {},
                                            },
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    <Plus className="size-4" />
                                    {block.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-7 border-t pt-5">
                            <p className="mb-3 text-xs font-semibold tracking-[.16em] text-muted-foreground uppercase">
                                Sections
                            </p>
                            <div className="space-y-2">
                                {sections.map((s) => (
                                    <button
                                        draggable
                                        onDragStart={() => setDragId(s.id)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => reorder(s.id)}
                                        key={s.id}
                                        onClick={() => selectSection(s)}
                                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${selectedId === s.id ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                                    >
                                        <GripVertical className="size-4 shrink-0" />
                                        <span className="truncate">
                                            {s.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                    <main className="overflow-auto p-4 sm:p-7">
                        <div className="mx-auto max-w-[1180px] shadow-sm">
                            <PageRenderer sections={sections} editor />
                        </div>
                    </main>
                    <aside className="border-l bg-background p-4">
                        <p className="mb-4 text-xs font-semibold tracking-[.16em] text-muted-foreground uppercase">
                            Inspector
                        </p>
                        {selected ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-muted-foreground">
                                        Bloc
                                    </label>
                                    <p className="font-medium capitalize">
                                        {selected.type}
                                    </p>
                                </div>
                                <select
                                    value={selected.variant}
                                    onChange={(e) =>
                                        router.patch(
                                            `/trainer/pages/${page.id}/sections/${selected.id}`,
                                            {
                                                variant: e.target.value,
                                                settings: draftSettings,
                                                is_visible: true,
                                            },
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                                >
                                    {blocks
                                        .find((b) => b.type === selected.type)
                                        ?.variants.map((v) => (
                                            <option key={v}>{v}</option>
                                        ))}
                                </select>
                                {[
                                    'headline',
                                    'subheadline',
                                    'title',
                                    'description',
                                    'tagline',
                                    'button_label',
                                    'button_url',
                                    'primary_label',
                                    'primary_url',
                                ].map((key) => (
                                    <div key={key}>
                                        <label className="text-xs text-muted-foreground">
                                            {key.replaceAll('_', ' ')}
                                        </label>
                                        {key.includes('description') ||
                                        key === 'subheadline' ? (
                                            <Textarea
                                                value={draftSettings[key] ?? ''}
                                                onChange={(e) =>
                                                    patch(key, e.target.value)
                                                }
                                            />
                                        ) : (
                                            <Input
                                                value={draftSettings[key] ?? ''}
                                                onChange={(e) =>
                                                    patch(key, e.target.value)
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                                {[
                                    'course',
                                    'curriculum',
                                    'pricing',
                                    'instructor',
                                    'hero',
                                ].includes(selected.type) && (
                                    <div>
                                        <label className="text-xs text-muted-foreground">
                                            Formation liée
                                        </label>
                                        <select
                                            value={
                                                draftSettings.course_id ?? ''
                                            }
                                            onChange={(e) =>
                                                patch(
                                                    'course_id',
                                                    Number(e.target.value) ||
                                                        null,
                                                )
                                            }
                                            className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">Aucune</option>
                                            {courses.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {[
                                    'features',
                                    'testimonials',
                                    'faq',
                                    'footer',
                                ].includes(selected.type) && (
                                    <div>
                                        <label className="text-xs text-muted-foreground">
                                            {selected.type === 'faq'
                                                ? 'Questions (question | réponse)'
                                                : selected.type ===
                                                    'testimonials'
                                                  ? 'Témoignages (nom | citation)'
                                                  : selected.type === 'footer'
                                                    ? 'Liens (label | URL)'
                                                    : 'Éléments (titre | description)'}
                                        </label>
                                        <Textarea
                                            className="mt-1 min-h-32"
                                            value={itemsToText(
                                                selected.type,
                                                draftSettings.items ??
                                                    draftSettings.links ??
                                                    [],
                                            )}
                                            onChange={(event) =>
                                                patch(
                                                    selected.type === 'footer'
                                                        ? 'links'
                                                        : 'items',
                                                    textToItems(
                                                        selected.type,
                                                        event.target.value,
                                                    ),
                                                )
                                            }
                                            placeholder="Une ligne par élément"
                                        />
                                    </div>
                                )}
                                <Button
                                    className="w-full"
                                    onClick={saveSection}
                                >
                                    <Save className="mr-2 size-4" />
                                    Enregistrer le bloc
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-destructive"
                                    onClick={() =>
                                        router.delete(
                                            `/trainer/pages/${page.id}/sections/${selected.id}`,
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Supprimer
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                <LayoutPanelLeft className="mx-auto mb-3 size-6" />
                                Sélectionnez un bloc.
                            </div>
                        )}
                        <div className="mt-8 border-t pt-5">
                            <p className="mb-3 text-xs font-semibold tracking-[.16em] text-muted-foreground uppercase">
                                SEO & Page
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    meta.patch(`/trainer/pages/${page.id}`);
                                }}
                                className="space-y-3"
                            >
                                <Input
                                    value={meta.data.title}
                                    onChange={(e) =>
                                        meta.setData('title', e.target.value)
                                    }
                                    placeholder="Titre"
                                />
                                <Input
                                    value={meta.data.slug}
                                    onChange={(e) =>
                                        meta.setData('slug', e.target.value)
                                    }
                                    placeholder="slug"
                                />
                                <Input
                                    value={meta.data.meta_title}
                                    onChange={(e) =>
                                        meta.setData(
                                            'meta_title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Meta title"
                                />
                                <Textarea
                                    value={meta.data.meta_description}
                                    onChange={(e) =>
                                        meta.setData(
                                            'meta_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Meta description"
                                />
                                <Button variant="outline" className="w-full">
                                    Enregistrer la page
                                </Button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
PageEdit.layout = {
    breadcrumbs: [
        { title: 'Creator Studio', href: trainer.dashboard() },
        { title: 'Pages', href: '/trainer/pages' },
    ],
};
