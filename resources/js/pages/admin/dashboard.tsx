import { Head, usePage } from '@inertiajs/react';
import { BookOpen, CreditCard, GraduationCap, Users } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import admin from '@/routes/admin';

type Props = {
    stats: {
        totalCourses: number;
        totalTrainers: number;
        totalStudents: number;
        totalEnrollments: number;
    };
};

export default function AdminDashboard() {
    const { stats } = usePage<Props>().props;

    const cards = [
        { label: 'Formations', value: stats.totalCourses, icon: BookOpen },
        { label: 'Formateurs', value: stats.totalTrainers, icon: Users },
        { label: 'Étudiants', value: stats.totalStudents, icon: GraduationCap },
        {
            label: 'Inscriptions',
            value: stats.totalEnrollments,
            icon: CreditCard,
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Pilotez votre académie"
                    description="Gardez une vue claire sur les formations, les formateurs et la progression de votre communauté depuis un seul espace."
                />

                <DashboardSection
                    title="Vue d’ensemble"
                    description="Les indicateurs essentiels de la plateforme, sans bruit inutile."
                >
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map(({ label, value, icon }) => (
                            <MetricCard
                                key={label}
                                label={label}
                                value={value}
                                icon={icon}
                            />
                        ))}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: admin.dashboard() }],
};
