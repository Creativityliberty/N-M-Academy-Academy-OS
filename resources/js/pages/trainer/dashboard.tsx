import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CheckCircle,
    CircleDollarSign,
    GraduationCap,
    Plus,
    Sparkles,
    Users,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import { Button } from '@/components/ui/button';
import trainer from '@/routes/trainer';

type RevenueBucket = {
    currency: string;
    amount: number;
};

type RecentEnrollment = {
    id: number;
    student: string | null;
    course: string | null;
    enrolledAt: string | null;
};

type TopCourse = {
    id: number;
    title: string;
    status: 'draft' | 'published' | 'archived';
    students: number;
};

type Props = {
    stats: {
        totalCourses: number;
        totalStudents: number;
        publishedCourses: number;
        totalEnrollments: number;
    };
    revenueByCurrency: RevenueBucket[];
    recentEnrollments: RecentEnrollment[];
    topCourses: TopCourse[];
    stripeReady: boolean;
};

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
});

function formatMoney(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        return `${amount.toFixed(0)} ${currency}`;
    }
}

export default function TrainerDashboard() {
    const {
        stats,
        revenueByCurrency,
        recentEnrollments,
        topCourses,
        stripeReady,
    } = usePage<Props>().props;
    const primaryRevenue = revenueByCurrency[0];

    return (
        <>
            <Head title="Creator Studio" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Pilotez votre académie"
                    description="Créez vos formations, suivez vos étudiants et gardez une lecture claire de vos ventes sans quitter votre studio."
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Formations"
                        value={stats.totalCourses}
                        icon={BookOpen}
                    />
                    <MetricCard
                        label="Publiées"
                        value={stats.publishedCourses}
                        icon={CheckCircle}
                    />
                    <MetricCard
                        label="Étudiants"
                        value={stats.totalStudents}
                        icon={GraduationCap}
                    />
                    <MetricCard
                        label="Revenu tracé"
                        value={
                            primaryRevenue
                                ? formatMoney(
                                      primaryRevenue.amount,
                                      primaryRevenue.currency,
                                  )
                                : '—'
                        }
                        icon={CircleDollarSign}
                    />
                </div>

                <DashboardSection
                    title="Actions rapides"
                    description="Les raccourcis utiles pour travailler sans chercher dans l'interface."
                >
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Link
                            href={trainer.courses.create()}
                            className="academy-panel group rounded-[calc(var(--radius)*1.05)] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                        <Plus className="size-4" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-foreground">
                                        Créer une formation
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Ouvrir le Course Builder et démarrer un
                                        nouveau programme.
                                    </p>
                                </div>
                                <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>

                        <Link
                            href="/trainer/academy-ai"
                            className="academy-panel group rounded-[calc(var(--radius)*1.05)] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                        <Sparkles className="size-4" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-foreground">
                                        Parler à Academy AI
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Générer, réécrire ou analyser avant
                                        application explicite.
                                    </p>
                                </div>
                                <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>

                        <Link
                            href={trainer.students.index()}
                            className="academy-panel group rounded-[calc(var(--radius)*1.05)] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                        <Users className="size-4" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-foreground">
                                        Voir les étudiants
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Explorer les inscriptions et les
                                        formations suivies.
                                    </p>
                                </div>
                                <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>

                        <Link
                            href={trainer.analytics.index()}
                            className="academy-panel group rounded-[calc(var(--radius)*1.05)] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="grid size-10 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
                                        <BarChart3 className="size-4" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-foreground">
                                        Lire l'engagement
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Comparer étudiants, leçons et taux de
                                        complétion.
                                    </p>
                                </div>
                                <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    </div>
                </DashboardSection>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <DashboardSection
                        title="Dernières inscriptions"
                        description={`${stats.totalEnrollments} inscription${stats.totalEnrollments > 1 ? 's' : ''} au total.`}
                    >
                        <div className="academy-panel overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            <div className="divide-y divide-border/70">
                                {recentEnrollments.length === 0 ? (
                                    <div className="px-5 py-10 text-sm text-muted-foreground">
                                        Aucune inscription pour le moment.
                                    </div>
                                ) : (
                                    recentEnrollments.map((enrollment) => (
                                        <div
                                            key={enrollment.id}
                                            className="flex items-center justify-between gap-4 px-5 py-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {enrollment.student ??
                                                        'Étudiant'}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                                    {enrollment.course ??
                                                        'Formation'}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {enrollment.enrolledAt
                                                    ? dateFormatter.format(
                                                          new Date(
                                                              enrollment.enrolledAt,
                                                          ),
                                                      )
                                                    : '—'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Catalogue"
                        description="Vos formations les plus suivies."
                    >
                        <div className="academy-panel overflow-hidden rounded-[calc(var(--radius)*1.05)]">
                            <div className="divide-y divide-border/70">
                                {topCourses.length === 0 ? (
                                    <div className="px-5 py-10 text-sm text-muted-foreground">
                                        Votre catalogue est encore vide.
                                    </div>
                                ) : (
                                    topCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex items-center justify-between gap-4 px-5 py-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {course.title}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {course.status ===
                                                    'published'
                                                        ? 'Publiée'
                                                        : 'Brouillon'}
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-brand-primary-soft px-2.5 py-1 text-xs font-medium text-brand-primary">
                                                {course.students} étudiant
                                                {course.students > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </DashboardSection>
                </div>

                {!stripeReady ? (
                    <div className="academy-panel flex flex-col gap-4 rounded-[calc(var(--radius)*1.05)] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-medium text-foreground">
                                Stripe Connect n'est pas encore actif
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Connectez Stripe avant de publier et recevoir
                                les paiements de vos formations.
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href={trainer.stripeConnect.edit()}>
                                Configurer Stripe
                            </Link>
                        </Button>
                    </div>
                ) : null}
            </div>
        </>
    );
}

TrainerDashboard.layout = {
    breadcrumbs: [{ title: 'Creator Studio', href: trainer.dashboard() }],
};
