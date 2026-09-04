import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Link, router } from '@inertiajs/react';
import { ImageIcon, PencilIcon, Trash2Icon, MoreHorizontalIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CourseController from '@/actions/App/Http/Controllers/Admin/Courses/CourseController';
import type { Course } from '@/types/course';

const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Brouillon', className: 'bg-muted text-muted-foreground' },
    published: {
        label: 'Publié',
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
};

function RowActions({ course }: { course: Course }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState(false);

    const isPublished = course.status === 'published';

    function handleToggleStatus() {
        setTogglingStatus(true);
        router.patch(CourseController.toggleStatus.url(course), {}, {
            onFinish: () => setTogglingStatus(false),
        });
    }

    function handleDelete() {
        setDeleting(true);
        router.delete(CourseController.destroy.url(course), {
            onFinish: () => {
                setDeleting(false);
                setDeleteOpen(false);
            },
        });
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Actions</span>
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={CourseController.edit.url(course)} className="flex items-center gap-2">
                            <PencilIcon className="size-4" />
                            Modifier
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleToggleStatus}
                        disabled={togglingStatus}
                        className="flex items-center gap-2"
                    >
                        {isPublished ? (
                            <>
                                <EyeOffIcon className="size-4" />
                                Passer en brouillon
                            </>
                        ) : (
                            <>
                                <EyeIcon className="size-4" />
                                Publier
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                        <Trash2Icon className="size-4" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer la formation</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer <strong>"{course.title}"</strong> ? Cette action est irréversible et supprimera également l'image associée.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                            Annuler
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Suppression…' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export const createColumns = (): ColumnDef<Course>[] => [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Titre" />
        ),
        cell: ({ row }) => {
            const course = row.original;
            return (
                <div className="flex items-center gap-3">
                    {course.image ? (
                        <img
                            src={course.image}
                            alt={course.title}
                            className="size-9 shrink-0 rounded-md object-cover"
                        />
                    ) : (
                        <div className="size-9 shrink-0 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="size-4 text-muted-foreground" />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{course.title}</span>
                        {course.featured && (
                            <Badge variant="secondary" className="text-xs">
                                À la une
                            </Badge>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'category',
        accessorFn: (row) => row.category?.name ?? '',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Catégorie" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.category?.name ?? '—'}
            </span>
        ),
    },
    {
        id: 'trainer',
        accessorFn: (row) => row.trainer?.name ?? '',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Formateur" />
        ),
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.trainer?.name ?? '—'}
            </span>
        ),
    },
    {
        accessorKey: 'module_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Modules" />
        ),
        cell: ({ row }) => (
            <span className="text-sm tabular-nums">{row.getValue('module_count')}</span>
        ),
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Prix" />
        ),
        cell: ({ row }) => (
            <span className="text-sm tabular-nums">{row.getValue<number>('price')} €</span>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Statut" />
        ),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const config = statusConfig[status] ?? { label: status, className: '' };
            return (
                <Badge className={config.className} variant="outline">
                    {config.label}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <RowActions course={row.original} />,
    },
];
