import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Link, router } from '@inertiajs/react';
import { PencilIcon, Trash2Icon, MoreHorizontalIcon, StarIcon } from 'lucide-react';
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
import PlanController from '@/actions/App/Http/Controllers/Admin/Plans/PlanController';
import type { Plan } from '@/types/plan';

function RowActions({ plan }: { plan: Plan }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting]     = useState(false);

    function handleDelete() {
        setDeleting(true);
        router.delete(PlanController.destroy.url(plan), {
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
                        <Link href={PlanController.edit.url(plan)} className="flex items-center gap-2">
                            <PencilIcon className="size-4" />
                            Modifier
                        </Link>
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
                        <DialogTitle>Supprimer le plan</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer <strong>"{plan.name}"</strong> ? Le produit et le prix associés seront archivés sur Stripe.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Suppression…' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export const createColumns = (): ColumnDef<Plan>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
        cell: ({ row }) => {
            const plan = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{plan.name}</span>
                    {plan.highlight && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                            <StarIcon className="size-3" />
                            Populaire
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'formatted_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Prix" />,
        cell: ({ row }) => (
            <span className="tabular-nums font-medium">
                {row.original.formatted_price}
                <span className="ml-1 text-xs text-muted-foreground">/{row.original.interval_label.toLowerCase()}</span>
            </span>
        ),
    },
    {
        accessorKey: 'currency_label',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Devise" />,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.currency_label}</span>,
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={row.original.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'}
            >
                {row.original.is_active ? 'Actif' : 'Inactif'}
            </Badge>
        ),
    },
    {
        accessorKey: 'stripe_price_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stripe" />,
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={row.original.stripe_price_id
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    : 'bg-muted text-muted-foreground'}
            >
                {row.original.stripe_price_id ? 'Synchronisé' : 'Non synchronisé'}
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <RowActions plan={row.original} />,
    },
];
