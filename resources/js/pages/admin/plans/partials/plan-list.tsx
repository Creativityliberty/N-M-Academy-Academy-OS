import { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/pagination';
import type { Plan } from '@/types/plan';
import PlanController from '@/actions/App/Http/Controllers/Admin/Plans/PlanController';
import { createColumns } from './columns';

type Props = {
    plans: Paginated<Plan>;
};

export default function PlanList({ plans }: Props) {
    const columns = useMemo(() => createColumns(), []);

    const prevUrl = plans.links[0]?.url;
    const nextUrl = plans.links[plans.links.length - 1]?.url;

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={plans.data}
                searchFilter={{
                    columnIds: ['name'],
                    placeholder: 'Rechercher un plan...',
                }}
                actionButton={{
                    label: 'Créer un plan',
                    onClick: () => router.visit(PlanController.create.url()),
                }}
            />

            {plans.last_page > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!prevUrl}
                        onClick={() => prevUrl && router.visit(prevUrl)}
                    >
                        Précédent
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {plans.current_page} / {plans.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!nextUrl}
                        onClick={() => nextUrl && router.visit(nextUrl)}
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    );
}
