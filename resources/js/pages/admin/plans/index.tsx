import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import PlanList from './partials/plan-list';
import type { Paginated } from '@/types/pagination';
import type { Plan } from '@/types/plan';

type Props = {
    plans: Paginated<Plan>;
};

export default function PlanIndex() {
    const { plans } = usePage<Props>().props;

    return (
        <>
            <Head title="Plans formateurs" />

            <div className="container mx-auto space-y-6 p-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Plans formateurs</h1>
                    <p className="text-muted-foreground">
                        Gérez les abonnements formateurs. Toute modification est synchronisée automatiquement avec Stripe.
                    </p>
                </div>

                <PlanList plans={plans} />
            </div>
        </>
    );
}

PlanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Plans', href: admin.plans.index() },
    ],
};
