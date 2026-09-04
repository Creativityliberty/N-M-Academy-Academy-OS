import { Form, Head } from '@inertiajs/react';
import { CalendarClock, CreditCard, ShieldCheck } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Button } from '@/components/ui/button';

export type MembershipItem = {
    id: number;
    course: string | null;
    offer: string | null;
    status: string;
    recurringAmount: number;
    currency: string;
    interval: string | null;
    currentPeriodEnd: string | null;
    canceledAt: string | null;
    endedAt: string | null;
    canManage: boolean;
};

type Props = { memberships: MembershipItem[] };

const money = (minor: number, currency: string) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
    }).format(minor / 100);

const date = (value: string | null) =>
    value
        ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(
              new Date(value),
          )
        : '—';

export default function StudentMembershipsIndex({ memberships }: Props) {
    return (
        <>
            <Head title="Mes abonnements" />
            <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Mes abonnements"
                    description="Consultez vos accès récurrents et gérez votre facturation via le portail Stripe sécurisé."
                />

                <DashboardSection
                    title="Abonnements actifs et historiques"
                    description={`${memberships.length} abonnement(s)`}
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        {memberships.map((membership) => (
                            <article
                                key={membership.id}
                                className="academy-panel rounded-2xl p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">
                                            {membership.course ?? 'Formation'}
                                        </div>
                                        <h2 className="mt-1 text-lg font-semibold">
                                            {membership.offer ?? 'Abonnement'}
                                        </h2>
                                    </div>
                                    <span className="rounded-full border px-2.5 py-1 text-xs font-medium capitalize">
                                        {membership.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                                    <div className="rounded-xl bg-muted/40 p-3">
                                        <CreditCard className="mb-2 h-4 w-4" />
                                        <div className="text-muted-foreground">
                                            Montant
                                        </div>
                                        <div className="font-semibold">
                                            {money(
                                                membership.recurringAmount,
                                                membership.currency,
                                            )}
                                            {membership.interval
                                                ? ` / ${membership.interval === 'year' ? 'an' : 'mois'}`
                                                : ''}
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-muted/40 p-3">
                                        <CalendarClock className="mb-2 h-4 w-4" />
                                        <div className="text-muted-foreground">
                                            Période actuelle
                                        </div>
                                        <div className="font-semibold">
                                            {date(membership.currentPeriodEnd)}
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-muted/40 p-3">
                                        <ShieldCheck className="mb-2 h-4 w-4" />
                                        <div className="text-muted-foreground">
                                            Fin d’accès
                                        </div>
                                        <div className="font-semibold">
                                            {date(membership.endedAt)}
                                        </div>
                                    </div>
                                </div>

                                {membership.canManage && (
                                    <Form
                                        action={`/student/memberships/${membership.id}/portal`}
                                        method="post"
                                        className="mt-5"
                                    >
                                        <Button type="submit" variant="outline">
                                            Gérer la facturation
                                        </Button>
                                    </Form>
                                )}
                            </article>
                        ))}

                        {memberships.length === 0 && (
                            <div className="academy-panel rounded-2xl p-8 text-center text-sm text-muted-foreground lg:col-span-2">
                                Aucun abonnement récurrent enregistré.
                            </div>
                        )}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
