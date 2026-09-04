import { useState } from 'react';
import { Form, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ModulesLessons } from './partials/modules-lessons';
import admin from '@/routes/admin';
import { ImageUpload } from '@/components/image-upload';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    PlusIcon,
    Trash2Icon,
    ChevronsUpDownIcon,
    CheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category';
import type { Trainer } from '@/types/trainer';
import type { Course } from '@/types/course';
import type { Module } from '@/types/module';
import CourseController from '@/actions/App/Http/Controllers/Admin/Courses/CourseController';

type PageProps = {
    course: Course;
    categories: Category[];
    trainers: Trainer[];
    is_admin: boolean;
};

export default function CourseEdit() {
    const { course, categories, trainers, is_admin } =
        usePage<PageProps>().props;

    const [trainerOpen, setTrainerOpen] = useState(false);
    const [selectedTrainerId, setSelectedTrainerId] = useState(
        course.trainer ? String(course.trainer.id) : '',
    );
    const [categoryId, setCategoryId] = useState(
        course.category ? String(course.category.id) : '',
    );
    const [featured, setFeatured] = useState(course.featured);
    const [benefits, setBenefits] = useState<string[]>(course.benefits ?? []);
    const [objectives, setObjectives] = useState<
        { title: string; description: string }[]
    >(course.objectives ?? []);
    const [prerequisites, setPrerequisites] = useState<string[]>(
        course.prerequisites ?? [],
    );
    const [modules, setModules] = useState<Module[]>(
        (course.modules as Module[]) ?? [],
    );

    const selectedTrainer = trainers.find(
        (t) => String(t.id) === selectedTrainerId,
    );

    const addModule = () =>
        setModules((p) => [...p, { title: '', duration: 60, lessons: [] }]);
    const removeModule = (mi: number) =>
        setModules((p) => p.filter((_, i) => i !== mi));
    const updateModule = (
        mi: number,
        field: 'title' | 'duration',
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
                              { title: '', duration: 15, is_free: false, type: 'video_url' as const },
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
        field: keyof import('@/types').Lesson,
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
            <Head title={`Modifier — ${course.title}`} />

            <div className="container mx-auto space-y-6 p-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Modifier la formation
                    </h1>
                    <p className="text-muted-foreground">
                        Modifiez les informations puis ajustez les modules et
                        leçons.
                    </p>
                </div>

                <Separator />

                <Form
                    {...CourseController.update.form(course)}
                    className="space-y-8"
                >
                    {({ processing, errors, clearErrors }) => (
                        <>
                            <input
                                type="hidden"
                                name="category_id"
                                value={categoryId}
                            />

                            <input type="hidden" name="status" value={course.status} />

                            <input
                                type="hidden"
                                name="featured"
                                value={featured ? '1' : '0'}
                            />

                            {is_admin && (
                                <input
                                    type="hidden"
                                    name="trainer_id"
                                    value={selectedTrainerId}
                                />
                            )}

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
                                    {mod.id && (
                                        <input type="hidden" name={`modules[${mi}][id]`} value={mod.id} />
                                    )}
                                    <input type="hidden" name={`modules[${mi}][title]`} value={mod.title} />
                                    <input type="hidden" name={`modules[${mi}][duration]`} value={mod.duration} />

                                    {mod.lessons.map((l, li) => (
                                        <span key={li}>
                                            {l.id && (
                                                <input type="hidden" name={`modules[${mi}][lessons][${li}][id]`} value={l.id} />
                                            )}
                                            <input type="hidden" name={`modules[${mi}][lessons][${li}][title]`} value={l.title} />
                                            <input type="hidden" name={`modules[${mi}][lessons][${li}][duration]`} value={l.duration} />
                                            <input type="hidden" name={`modules[${mi}][lessons][${li}][is_free]`} value={l.is_free ? '1' : '0'} />
                                            <input type="hidden" name={`modules[${mi}][lessons][${li}][type]`} value={l.type ?? 'video_url'} />
                                            {l.type === 'video_url' && (
                                                <input type="hidden" name={`modules[${mi}][lessons][${li}][video_url]`} value={l.video_url ?? ''} />
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
                                        defaultValue={course.title}
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
                                        defaultValue={course.description ?? ''}
                                        placeholder="Décrivez la formation..."
                                        onChange={() =>
                                            clearErrors('description')
                                        }
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <InputError message={errors.description} />
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

                                    {is_admin && (
                                        <div className="space-y-2 sm:col-span-2 lg:col-span-5">
                                            <Label>Formateur *</Label>
                                            <Popover
                                                open={trainerOpen}
                                                onOpenChange={setTrainerOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between font-normal"
                                                    >
                                                        <span className="truncate">
                                                            {selectedTrainer?.name ??
                                                                'Sélectionner un formateur'}
                                                        </span>
                                                        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    className="w-[var(--radix-popover-trigger-width)] p-0"
                                                    align="start"
                                                >
                                                    <Command>
                                                        <CommandInput placeholder="Rechercher..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                Aucun formateur
                                                                trouvé.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {trainers.map(
                                                                    (t) => (
                                                                        <CommandItem
                                                                            key={
                                                                                t.id
                                                                            }
                                                                            value={
                                                                                t.name
                                                                            }
                                                                            onSelect={() => {
                                                                                setSelectedTrainerId(
                                                                                    String(
                                                                                        t.id,
                                                                                    ),
                                                                                );
                                                                                setTrainerOpen(
                                                                                    false,
                                                                                );
                                                                                clearErrors(
                                                                                    'trainer_id',
                                                                                );
                                                                            }}
                                                                        >
                                                                            <CheckIcon
                                                                                className={cn(
                                                                                    'mr-2 size-4',
                                                                                    selectedTrainerId ===
                                                                                        String(
                                                                                            t.id,
                                                                                        )
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0',
                                                                                )}
                                                                            />
                                                                            {
                                                                                t.name
                                                                            }
                                                                        </CommandItem>
                                                                    ),
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={errors.trainer_id}
                                            />
                                        </div>
                                    )}

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
                                            defaultValue={course.price}
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
                                            defaultValue={course.duration}
                                            placeholder="120"
                                            onChange={() =>
                                                clearErrors('duration')
                                            }
                                        />
                                        <InputError message={errors.duration} />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-4">
                                        <div
                                            className="h-6"
                                            aria-hidden="true"
                                        />

                                        <div className="flex h-10 items-center gap-3">
                                            <Checkbox
                                                id="featured"
                                                checked={featured}
                                                onCheckedChange={(v) =>
                                                    setFeatured(!!v)
                                                }
                                                className="h-8 w-8 shrink-0"
                                            />

                                            <Label
                                                htmlFor="featured"
                                                className="cursor-pointer text-sm leading-none font-normal md:whitespace-nowrap"
                                            >
                                                Mettre en avant sur la page
                                                d'accueil
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:col-span-2 lg:col-span-12">
                                    <Label>Image de couverture</Label>

                                    <div className="w-full">
                                        <ImageUpload
                                            name="image"
                                            existingUrl={course.image}
                                        />
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
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

function CourseEditLayout({ children }: { children: React.ReactNode }) {
    const { course } = usePage<{ course: Course }>().props;
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: admin.dashboard() },
                { title: 'Formations', href: admin.courses.index() },
                { title: course.title, href: '#' },
            ]}
        >
            {children}
        </AppLayout>
    );
}

CourseEdit.layout = (page: React.ReactNode) => <CourseEditLayout>{page}</CourseEditLayout>;
