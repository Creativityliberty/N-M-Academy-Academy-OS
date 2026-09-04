import { Head, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, Users } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import trainer from '@/routes/trainer';

type CourseAnalytics = {
    id: number;
    title: string;
    status: 'draft' | 'published' | 'archived';
    students: number;
    lessons: number;
    completedLessons: number;
    completionRate: number;
};

type Props = {
    stats: {
        courses: number;
        students: number;
        averageCompletion: number;
    };
    courses: CourseAnalytics[];
};

export default function TrainerAnalyticsIndex() {
    const { stats, courses } = usePage<Props>().props;

    return (
        <>
            <Head title="Analytics" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Comprenez vos formations"
                    description="Une lecture simple de l'engagement : combien d'étudiants apprennent réellement et jusqu'où ils avancent."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <MetricCard
                        label="Formations"
                        value={stats.courses}
                        icon={BookOpen}
                    />
                    <MetricCard
                        label="Étudiants"
                        value={stats.students}
                        icon={Users}
                    />
                    <MetricCard
                        label="Complétion moyenne"
                        value={`${stats.averageCompletion}%`}
                        icon={BarChart3}
                    />
                </div>

                <DashboardSection
                    title="Performance par formation"
                    description="Le taux de complétion compare les leçons terminées au volume total possible pour les étudiants inscrits."
                >
                    <div className="space-y-3">
                        {courses.length === 0 ? (
                            <div className="academy-panel rounded-[calc(var(--radius)*1.05)] px-5 py-12 text-center text-sm text-muted-foreground">
                                Créez votre première formation pour commencer à
                                mesurer l'engagement.
                            </div>
                        ) : (
                            courses.map((course) => (
                                <article
                                    key={course.id}
                                    className="academy-panel rounded-[calc(var(--radius)*1.05)] p-5"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="truncate font-medium text-foreground">
                                                    {course.title}
                                                </h3>
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                    {course.status ===
                                                    'published'
                                                        ? 'Publiée'
                                                        : 'Brouillon'}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {course.students} étudiant
                                                {course.students > 1
                                                    ? 's'
                                                    : ''}{' '}
                                                · {course.lessons} leçon
                                                {course.lessons > 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <div className="w-full max-w-xl lg:w-[45%]">
                                            <div className="mb-2 flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Complétion
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    {course.completionRate}%
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-brand-primary transition-[width] duration-500"
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0, course.completionRate))}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}

TrainerAnalyticsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: trainer.dashboard() },
        { title: 'Analytics', href: trainer.analytics.index() },
    ],
};
