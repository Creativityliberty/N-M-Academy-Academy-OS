import { Form, Head, usePage } from '@inertiajs/react';
import {
    BadgePercent,
    CircleDollarSign,
    CreditCard,
    Link2,
    ReceiptText,
    RefreshCw,
    Users,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import trainer from '@/routes/trainer';

type CurrencyMetric = {
    currency: string;
    gross?: number;
    refunds?: number;
    net?: number;
    platformFees?: number;
    affiliateCommissions?: number;
    realizedLtv?: number;
    mrr?: number;
    active?: number;
};
type Course = { id: number; title: string };
type Offer = {
    id: number;
    course: string | null;
    course_id: number;
    name: string;
    billing_type: string;
    amount: number;
    currency: string;
    interval: string | null;
    access_rank: number;
    active: boolean;
};
type Coupon = {
    id: number;
    code: string;
    discount_type: string;
    discount_value: number;
    currency: string | null;
    redemptions: number;
    max_redemptions: number | null;
    expires_at: string | null;
    active: boolean;
};
type Affiliate = {
    id: number;
    name: string;
    email: string | null;
    code: string;
    commission_bps: number;
    active: boolean;
    accrued_amount: number;
};
type Order = {
    id: number;
    student: string | null;
    email: string | null;
    course: string | null;
    offer: string | null;
    kind: string;
    status: string;
    gross: number;
    refunded: number;
    platformFee: number;
    currency: string;
    affiliate: string | null;
    paidAt: string | null;
    createdAt: string | null;
    refundable: boolean;
    remainingRefundable: number;
};
type Props = {
    analytics: {
        checkoutAttempts: number;
        successfulCheckouts: number;
        conversionRate: number | null;
        revenueByCurrency: CurrencyMetric[];
        mrrByCurrency: CurrencyMetric[];
        activeMemberships: number;
        canceledThisMonth: number;
        monthlyChurnRate: number | null;
    };
    commerceSettings: {
        platform_fee_bps: number;
        default_affiliate_bps: number;
        currency: string;
    };
    legacyEnrollments: number;
    courses: Course[];
    offers: Offer[];
    coupons: Coupon[];
    affiliates: Affiliate[];
    orders: Order[];
};

const money = (minor: number, currency: string) => {
    try {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency,
        }).format(minor / 100);
    } catch {
        return `${(minor / 100).toFixed(2)} ${currency}`;
    }
};

export default function TrainerSalesIndex() {
    const p = usePage<Props>().props;
    const revenue = p.analytics.revenueByCurrency[0];
    const mrr = p.analytics.mrrByCurrency[0];

    return (
        <>
            <Head title="Sales Engine" />
            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Sales Engine"
                    description="Offres, abonnements, coupons, affiliation, commissions, remboursements et métriques calculés depuis le ledger réel."
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        label="Net enregistré"
                        value={
                            revenue
                                ? money(revenue.net ?? 0, revenue.currency)
                                : '—'
                        }
                        icon={CircleDollarSign}
                    />
                    <MetricCard
                        label="MRR"
                        value={mrr ? money(mrr.mrr ?? 0, mrr.currency) : '—'}
                        icon={RefreshCw}
                    />
                    <MetricCard
                        label="Conversion"
                        value={
                            p.analytics.conversionRate === null
                                ? '—'
                                : `${p.analytics.conversionRate}%`
                        }
                        icon={CreditCard}
                    />
                    <MetricCard
                        label="Membres actifs"
                        value={p.analytics.activeMemberships}
                        icon={Users}
                    />
                    <MetricCard
                        label="Churn mensuel"
                        value={
                            p.analytics.monthlyChurnRate === null
                                ? '—'
                                : `${p.analytics.monthlyChurnRate}%`
                        }
                        icon={ReceiptText}
                    />
                </div>

                <div className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5 text-sm text-muted-foreground">
                    Commission plateforme actuelle :{' '}
                    <strong className="text-foreground">
                        {(p.commerceSettings.platform_fee_bps / 100).toFixed(2)}
                        %
                    </strong>{' '}
                    · Affiliation par défaut :{' '}
                    <strong className="text-foreground">
                        {(
                            p.commerceSettings.default_affiliate_bps / 100
                        ).toFixed(2)}
                        %
                    </strong>{' '}
                    · Inscriptions legacy sans montant :{' '}
                    <strong className="text-foreground">
                        {p.legacyEnrollments}
                    </strong>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <DashboardSection
                        title="Créer une offre"
                        description="Free, paiement unique ou abonnement. Le rang contrôle les modules accessibles."
                    >
                        <Form
                            action="/trainer/sales/offers"
                            method="post"
                            className="academy-panel space-y-3 rounded-2xl p-5"
                        >
                            <select
                                name="course_id"
                                required
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                            >
                                {p.courses.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                            <Input
                                name="name"
                                required
                                placeholder="Ex. Premium"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    name="billing_type"
                                    className="rounded-xl border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="one_time">
                                        Paiement unique
                                    </option>
                                    <option value="subscription">
                                        Abonnement
                                    </option>
                                    <option value="free">Gratuit</option>
                                </select>
                                <Input
                                    name="amount"
                                    type="number"
                                    min="0"
                                    defaultValue="0"
                                    placeholder="Centimes"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    name="currency"
                                    defaultValue={p.commerceSettings.currency}
                                />
                                <select
                                    name="interval"
                                    className="rounded-xl border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">—</option>
                                    <option value="month">Mois</option>
                                    <option value="year">Année</option>
                                </select>
                                <Input
                                    name="access_rank"
                                    type="number"
                                    min="0"
                                    defaultValue="100"
                                />
                            </div>
                            <Input
                                name="trial_days"
                                type="number"
                                min="0"
                                defaultValue="0"
                                placeholder="Jours d’essai"
                            />
                            <Button type="submit" className="w-full">
                                Créer l’offre
                            </Button>
                        </Form>
                    </DashboardSection>

                    <DashboardSection
                        title="Créer un coupon"
                        description="Réduction interne appliquée avant le calcul des frais Connect."
                    >
                        <Form
                            action="/trainer/sales/coupons"
                            method="post"
                            className="academy-panel space-y-3 rounded-2xl p-5"
                        >
                            <select
                                name="course_id"
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                            >
                                <option value="">Tous les cours</option>
                                {p.courses.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                            <Input
                                name="code"
                                required
                                placeholder="LAUNCH20"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    name="discount_type"
                                    className="rounded-xl border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="percent">
                                        Pourcentage (bps)
                                    </option>
                                    <option value="fixed">
                                        Montant fixe (centimes)
                                    </option>
                                </select>
                                <Input
                                    name="discount_value"
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="2000 = 20%"
                                />
                            </div>
                            <Input
                                name="max_redemptions"
                                type="number"
                                min="1"
                                placeholder="Utilisations max"
                            />
                            <Button type="submit" className="w-full">
                                <BadgePercent className="mr-2 h-4 w-4" />
                                Créer le coupon
                            </Button>
                        </Form>
                    </DashboardSection>

                    <DashboardSection
                        title="Créer un affilié"
                        description="Ledger de commission uniquement : aucun payout automatique en M10."
                    >
                        <Form
                            action="/trainer/sales/affiliates"
                            method="post"
                            className="academy-panel space-y-3 rounded-2xl p-5"
                        >
                            <Input
                                name="name"
                                required
                                placeholder="Nom / partenaire"
                            />
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                            />
                            <Input name="code" placeholder="Code facultatif" />
                            <Input
                                name="commission_bps"
                                type="number"
                                min="0"
                                max="10000"
                                placeholder="1000 = 10%"
                            />
                            <Button type="submit" className="w-full">
                                <Link2 className="mr-2 h-4 w-4" />
                                Créer l’affilié
                            </Button>
                        </Form>
                    </DashboardSection>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <DashboardSection
                        title="Offres"
                        description={`${p.offers.length} offre(s)`}
                    >
                        <div className="academy-panel divide-y rounded-2xl">
                            {p.offers.map((o) => (
                                <div key={o.id} className="p-4 text-sm">
                                    <div className="font-medium">
                                        {o.course} · {o.name}
                                    </div>
                                    <div className="mt-1 text-muted-foreground">
                                        {o.billing_type} ·{' '}
                                        {o.amount === 0
                                            ? 'Gratuit'
                                            : money(o.amount, o.currency)}
                                        {o.interval ? ` / ${o.interval}` : ''} ·
                                        rang {o.access_rank}
                                    </div>
                                    <Form
                                        action={`/trainer/sales/offers/${o.id}/toggle`}
                                        method="patch"
                                        className="mt-3"
                                    >
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="outline"
                                        >
                                            {o.active
                                                ? 'Désactiver'
                                                : 'Activer'}
                                        </Button>
                                    </Form>
                                </div>
                            ))}
                        </div>
                    </DashboardSection>
                    <DashboardSection
                        title="Coupons"
                        description={`${p.coupons.length} coupon(s)`}
                    >
                        <div className="academy-panel divide-y rounded-2xl">
                            {p.coupons.map((c) => (
                                <div key={c.id} className="p-4 text-sm">
                                    <div className="font-medium">{c.code}</div>
                                    <div className="mt-1 text-muted-foreground">
                                        {c.discount_type === 'percent'
                                            ? `${c.discount_value / 100}%`
                                            : money(
                                                  c.discount_value,
                                                  c.currency ??
                                                      p.commerceSettings
                                                          .currency,
                                              )}{' '}
                                        · {c.redemptions} utilisation(s)
                                    </div>
                                    <Form
                                        action={`/trainer/sales/coupons/${c.id}/toggle`}
                                        method="patch"
                                        className="mt-3"
                                    >
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="outline"
                                        >
                                            {c.active
                                                ? 'Désactiver'
                                                : 'Activer'}
                                        </Button>
                                    </Form>
                                </div>
                            ))}
                        </div>
                    </DashboardSection>
                    <DashboardSection
                        title="Affiliés"
                        description={`${p.affiliates.length} partenaire(s)`}
                    >
                        <div className="academy-panel divide-y rounded-2xl">
                            {p.affiliates.map((a) => (
                                <div key={a.id} className="p-4 text-sm">
                                    <div className="font-medium">
                                        {a.name} · /?ref={a.code}
                                    </div>
                                    <div className="mt-1 text-muted-foreground">
                                        {a.commission_bps / 100}% · accrued{' '}
                                        {money(
                                            a.accrued_amount,
                                            p.commerceSettings.currency,
                                        )}
                                    </div>
                                    <Form
                                        action={`/trainer/sales/affiliates/${a.id}/toggle`}
                                        method="patch"
                                        className="mt-3"
                                    >
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="outline"
                                        >
                                            {a.active
                                                ? 'Désactiver'
                                                : 'Activer'}
                                        </Button>
                                    </Form>
                                </div>
                            ))}
                        </div>
                    </DashboardSection>
                </div>

                <DashboardSection
                    title="Ledger des commandes"
                    description="Les 100 événements commerce les plus récents. Les montants sont les snapshots réellement enregistrés."
                >
                    <div className="academy-panel overflow-x-auto rounded-2xl">
                        <table className="w-full min-w-[900px] text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs text-muted-foreground uppercase">
                                    <th className="p-4">Client</th>
                                    <th>Formation</th>
                                    <th>Type</th>
                                    <th>Statut</th>
                                    <th>Gross</th>
                                    <th>Refund</th>
                                    <th>Fee</th>
                                    <th>Affiliate</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {p.orders.map((o) => (
                                    <tr
                                        key={o.id}
                                        className="border-b border-border/60"
                                    >
                                        <td className="p-4">
                                            <div>{o.student}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {o.email}
                                            </div>
                                        </td>
                                        <td>
                                            {o.course}
                                            <div className="text-xs text-muted-foreground">
                                                {o.offer}
                                            </div>
                                        </td>
                                        <td>{o.kind}</td>
                                        <td>{o.status}</td>
                                        <td>{money(o.gross, o.currency)}</td>
                                        <td>{money(o.refunded, o.currency)}</td>
                                        <td>
                                            {money(o.platformFee, o.currency)}
                                        </td>
                                        <td>{o.affiliate ?? '—'}</td>
                                        <td className="pr-4">
                                            {o.refundable ? (
                                                <Form
                                                    action={`/trainer/sales/orders/${o.id}/refund`}
                                                    method="post"
                                                    className="flex min-w-[260px] flex-col gap-2 py-2"
                                                >
                                                    <Input
                                                        name="amount"
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            o.remainingRefundable
                                                        }
                                                        placeholder={`Max ${o.remainingRefundable} cents`}
                                                    />
                                                    <Input
                                                        name="phrase"
                                                        placeholder={`REFUND ORDER ${o.id} AMOUNT …`}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Rembourser
                                                    </Button>
                                                </Form>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}
TrainerSalesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: trainer.dashboard() },
        { title: 'Ventes', href: trainer.sales.index() },
    ],
};
