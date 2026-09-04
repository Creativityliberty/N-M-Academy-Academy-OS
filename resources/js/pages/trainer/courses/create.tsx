import { useState } from 'react';
import { Form, Head, usePage } from '@inertiajs/react';
import { ModulesLessons } from './partials/modules-lessons';
import trainer from '@/routes/trainer';
import { ImageUpload } from '@/components/image-upload';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import type { Category } from '@/types/category';
import type { Lesson } from '@/types/lesson';
import type { Module } from '@/types/module';
import CourseController from '@/actions/App/Http/Controllers/Trainer/Courses/CourseController';

type PageProps = {
    categories: Category[];
};

export default function CourseCreate() {
    const { categories } = usePage<PageProps>().props;

    const [categoryId, setCategoryId] = useState('');
    const [benefits, setBenefits] = useState<string[]>([]);
    const [objectives, setObjectives] = useState<
        { title: string; description: string }[]
    >([]);
    const [prerequisites, setPrerequisites] = useState<string[]>([]);
    const [modules, setModules] = useState<Module[]>([]);

    const addModule = () =>
        setModules((p) => [...p, { title: '', description: '', duration: 60, minimum_access_rank: 0, lessons: [] }]);
    const removeModule = (mi: number) =>
        setModules((p) => p.filter((_, i) => i !== mi));
    const updateModule = (
        mi: number,
        field: 'title' | 'description' | 'duration' | 'minimum_access_rank',
        value: string | number,
    ) =>
        setModules((p) =>
            p.map((m, i) => (i === mi ? { ...m, [field]: value } : m)),
        );

    const addLesson = (mi: number) =>
        setModules((p) =>
            p.map((m, i) =>
                i === mi
                    ? {
                          ...m,
                          lessons: [
                              ...m.lessons,
                              {
                                  title: '',
                                  duration: 15,
                                  is_free: false,
                                  type: 'text' as const,
                              },
                          ],
                      }
                    : m,
            ),
        );
    const removeLesson = (mi: number, li: number) =>
        setModules((p) =>
            p.map((m, i) =>
                i === mi
                    ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) }
                    : m,
            ),
        );
    const updateLesson = (
        mi: number,
        li: number,
        field: keyof Lesson,
        value: string | number | boolean | null,
    ) =>
        setModules((p) =>
            p.map((m, i) =>
                i === mi
                    ? {
                          ...m,
                          lessons: m.lessons.map((l, j) =>
                              j === li ? { ...l, [field]: value } : l,
                          ),
                      }
                    : m,
            ),
        );

    return (
        <>
            <Head title="Créer une formation" />

            <div className="mx-auto w-full max-w-[1180px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <div className="academy-surface rounded-[calc(var(--radius)*1.25)] p-6 sm:p-7">
                    <p className="text-xs font-semibold tracking-[0.16em] text-brand-primary uppercase">
                        Creator Studio
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
                        Nouvelle formation
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Structurez le programme, les modules et les leçons dans
                        le Course Builder.
                    </p>
                </div>

                <Form {...CourseController.store.form()} className="space-y-8">
                    {({ processing, errors, clearErrors }) => (
                        <>
                            <input
                                type="hidden"
                                name="category_id"
                                value={categoryId}
                            />
                            <input type="hidden" name="status" value="draft" />
                            {benefits.map((b, i) => (
                                <input
                                    key={i}
                                    type="hidden"
                                    name={`benefits[${i}]`}
                                    value={b}
                                />
                            ))}
                            {objectives.map((o, i) => (
                                <span key={i}>
                                    <input
                                        type="hidden"
                                        name={`objectives[${i}][title]`}
                                        value={o.title}
                                    />
                                    <input
                                        type="hidden"
                                        name={`objectives[${i}][description]`}
                                        value={o.description}
                                    />
                                </span>
                            ))}
                            {prerequisites.map((p, i) => (
                                <input
                                    key={i}
                                    type="hidden"
                                    name={`prerequisites[${i}]`}
                                    value={p}
                                />
                            ))}
                            {modules.map((mod, mi) => (
                                <span key={mi}>
                                    <input
                                        type="hidden"
                                        name={`modules[${mi}][title]`}
                                        value={mod.title}
                                    />
                                    <input type="hidden" name={`modules[${mi}][description]`} value={mod.description ?? ''} />
                                    <input type="hidden" name={`modules[${mi}][minimum_access_rank]`} value={mod.minimum_access_rank ?? 0} />
                                    <input
                                        type="hidden"
                                        name={`modules[${mi}][duration]`}
                                        value={mod.duration}
                                    />
                                    {mod.lessons.map((l, li) => (
                                        <span key={li}>
                                            <input
                                                type="hidden"
                                                name={`modules[${mi}][lessons][${li}][title]`}
                                                value={l.title}
                                            />
                                            <input type="hidden" name={`modules[${mi}][lessons][${li}][content]`} value={l.content ?? ''} />
                                            <input type="hidden" name={`modules[${mi}][lessons][${li}][transcript]`} value={l.transcript ?? ''} />
                                            <input
                                                type="hidden"
                                                name={`modules[${mi}][lessons][${li}][duration]`}
                                                value={l.duration}
                                            />
                                            <input
                                                type="hidden"
                                                name={`modules[${mi}][lessons][${li}][is_free]`}
                                                value={l.is_free ? '1' : '0'}
                                            />
                                            <input
                                                type="hidden"
                                                name={`modules[${mi}][lessons][${li}][type]`}
                                                value={l.type ?? 'text'}
                                            />
                                            {l.type === 'video_url' && (
                                                <input
                                                    type="hidden"
                                                    name={`modules[${mi}][lessons][${li}][video_url]`}
                                                    value={l.video_url ?? ''}
                                                />
                                            )}
                                        </span>
                                    ))}
                                </span>
                            ))}

                            {/* ─── Informations générales ─── */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">
                                    Informations générales
                                </h2>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        autoFocus
                                        placeholder="Ex : Introduction à la pleine conscience"
                                        onChange={() => clearErrors('title')}
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        placeholder="Décrivez la formation..."
                                        onChange={() =>
                                            clearErrors('description')
                                        }
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="target_audience">Public cible</Label>
                                    <textarea id="target_audience" name="target_audience" rows={3} placeholder="Ex : entrepreneurs débutants qui veulent créer leurs premiers visuels professionnels" className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Niveau</Label>
                                        <select id="level" name="level" defaultValue="all_levels" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                                            <option value="all_levels">Tous niveaux</option><option value="beginner">Débutant</option><option value="intermediate">Intermédiaire</option><option value="advanced">Avancé</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="language">Langue</Label><Input id="language" name="language" defaultValue="fr" placeholder="fr" /></div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2"><Label>Problème principal</Label><Input name="positioning[main_problem]" placeholder="Le problème concret à résoudre" /></div>
                                    <div className="space-y-2"><Label>Transformation souhaitée</Label><Input name="positioning[desired_transformation]" placeholder="Le résultat attendu" /></div>
                                    <div className="space-y-2"><Label>Promesse principale</Label><Input name="positioning[main_promise]" placeholder="La promesse pédagogique" /></div>
                                    <div className="space-y-2"><Label>Angle unique</Label><Input name="positioning[unique_angle]" placeholder="Ce qui différencie cette formation" /></div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
                                    <div className="space-y-2 sm:col-span-1 lg:col-span-3">
                                        <Label>Catégorie *</Label>
                                        <Select
                                            value={categoryId}
                                            onValueChange={(v) => {
                                                setCategoryId(v);
                                                clearErrors('category_id');
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Choisir une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={String(cat.id)}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.category_id}
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-1 lg:col-span-2">
                                        <Label htmlFor="price">
                                            Prix (€) *
                                        </Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            placeholder="99.00"
                                            onChange={() =>
                                                clearErrors('price')
                                            }
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div className="space-y-2 sm:col-span-1 lg:col-span-2">
                                        <Label htmlFor="duration">
                                            Durée (min) *
                                        </Label>
                                        <Input
                                            id="duration"
                                            name="duration"
                                            type="number"
                                            min={1}
                                            placeholder="120"
                                            onChange={() =>
                                                clearErrors('duration')
                                            }
                                        />
                                        <InputError message={errors.duration} />
                                    </div>
                                </div>

                                <div className="space-y-2 sm:col-span-2 lg:col-span-12">
                                    <Label>Image de couverture</Label>

                                    <div className="w-full">
                                        <ImageUpload name="image" />
                                    </div>

                                    <InputError message={errors.image} />
                                </div>

                                <div className="space-y-6">
                                    {/* Bénéfices */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <Label>Bénéfices</Label>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setBenefits((p) => [
                                                        ...p,
                                                        '',
                                                    ])
                                                }
                                            >
                                                <PlusIcon className="mr-1 size-4" />
                                                Ajouter un bénéfice
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {benefits.map((b, i) => (
                                                <div
                                                    key={i}
                                                    className="flex min-w-0 gap-2"
                                                >
                                                    <Input
                                                        value={b}
                                                        className="min-w-0 flex-1"
                                                        onChange={(e) =>
                                                            setBenefits((p) =>
                                                                p.map((v, j) =>
                                                                    j === i
                                                                        ? e
                                                                              .target
                                                                              .value
                                                                        : v,
                                                                ),
                                                            )
                                                        }
                                                        placeholder={`Bénéfice ${i + 1} — Ex : Accès à vie`}
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="shrink-0"
                                                        onClick={() =>
                                                            setBenefits((p) =>
                                                                p.filter(
                                                                    (_, j) =>
                                                                        j !== i,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2Icon className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Objectifs */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <Label>Objectifs</Label>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setObjectives((p) => [
                                                        ...p,
                                                        {
                                                            title: '',
                                                            description: '',
                                                        },
                                                    ])
                                                }
                                            >
                                                <PlusIcon className="mr-1 size-4" />
                                                Ajouter un objectif
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {objectives.map((o, i) => (
                                                <div
                                                    key={i}
                                                    className="flex min-w-0 gap-2"
                                                >
                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            Objectif {i + 1}
                                                        </p>

                                                        <Input
                                                            value={o.title}
                                                            onChange={(e) =>
                                                                setObjectives(
                                                                    (p) =>
                                                                        p.map(
                                                                            (
                                                                                v,
                                                                                j,
                                                                            ) =>
                                                                                j ===
                                                                                i
                                                                                    ? {
                                                                                          ...v,
                                                                                          title: e
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                                    : v,
                                                                        ),
                                                                )
                                                            }
                                                            placeholder="Ex : Renforcer corps et esprit"
                                                        />

                                                        <Input
                                                            value={
                                                                o.description
                                                            }
                                                            onChange={(e) =>
                                                                setObjectives(
                                                                    (p) =>
                                                                        p.map(
                                                                            (
                                                                                v,
                                                                                j,
                                                                            ) =>
                                                                                j ===
                                                                                i
                                                                                    ? {
                                                                                          ...v,
                                                                                          description:
                                                                                              e
                                                                                                  .target
                                                                                                  .value,
                                                                                      }
                                                                                    : v,
                                                                        ),
                                                                )
                                                            }
                                                            placeholder="Ex : Développer force, souplesse et équilibre."
                                                        />
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mt-6 shrink-0"
                                                        onClick={() =>
                                                            setObjectives((p) =>
                                                                p.filter(
                                                                    (_, j) =>
                                                                        j !== i,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2Icon className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Prérequis */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <Label>Prérequis</Label>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setPrerequisites((p) => [
                                                        ...p,
                                                        '',
                                                    ])
                                                }
                                            >
                                                <PlusIcon className="mr-1 size-4" />
                                                Ajouter un prérequis
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {prerequisites.map((p, i) => (
                                                <div
                                                    key={i}
                                                    className="flex min-w-0 gap-2"
                                                >
                                                    <Input
                                                        value={p}
                                                        className="min-w-0 flex-1"
                                                        onChange={(e) =>
                                                            setPrerequisites(
                                                                (prev) =>
                                                                    prev.map(
                                                                        (
                                                                            v,
                                                                            j,
                                                                        ) =>
                                                                            j ===
                                                                            i
                                                                                ? e
                                                                                      .target
                                                                                      .value
                                                                                : v,
                                                                    ),
                                                            )
                                                        }
                                                        placeholder={`Prérequis ${i + 1} — Ex : Tapis de yoga recommandé`}
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="shrink-0"
                                                        onClick={() =>
                                                            setPrerequisites(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (
                                                                            _,
                                                                            j,
                                                                        ) =>
                                                                            j !==
                                                                            i,
                                                                    ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2Icon className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* ─── Modules & Leçons ─── */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Modules & Leçons
                                </h2>
                                <ModulesLessons
                                    modules={modules}
                                    onAddModule={addModule}
                                    onRemoveModule={removeModule}
                                    onUpdateModule={updateModule}
                                    onAddLesson={addLesson}
                                    onRemoveLesson={removeLesson}
                                    onUpdateLesson={updateLesson}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    Créer la formation
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CourseCreate.layout = {
    breadcrumbs: [
        { title: 'Creator Studio', href: trainer.dashboard() },
        { title: 'Formations', href: trainer.courses.index() },
        { title: 'Nouvelle formation', href: trainer.courses.create() },
    ],
};
