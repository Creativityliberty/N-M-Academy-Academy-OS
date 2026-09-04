import { Head, usePage } from '@inertiajs/react';
import { BookOpen, Layers3, Plus } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import trainer from '@/routes/trainer';
import CourseList from './partials/course-list';
import type { Paginated } from '@/types/pagination';
import type { Course } from '@/types/course';

type Props = {
    courses: Paginated<Course>;
};

export default function CourseIndex() {
    const { courses } = usePage<Props>().props;
    const publishedOnPage = courses.data.filter(
        (course) => course.status === 'published',
    ).length;

    return (
        <>
            <Head title="Formations" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Construisez votre catalogue"
                    description="Créez vos programmes, structurez modules et leçons puis publiez quand tout est prêt."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <MetricCard
                        label="Formations"
                        value={courses.total}
                        icon={BookOpen}
                    />
                    <MetricCard
                        label="Publiées sur cette page"
                        value={publishedOnPage}
                        icon={Layers3}
                    />
                    <MetricCard
                        label="Mode de création"
                        value="Builder"
                        icon={Plus}
                    />
                </div>

                <DashboardSection
                    title="Course Builder"
                    description="Votre catalogue existant reste intact ; le studio améliore seulement l'expérience de gestion."
                >
                    <CourseList courses={courses} />
                </DashboardSection>
            </div>
        </>
    );
}

CourseIndex.layout = {
    breadcrumbs: [
        { title: 'Creator Studio', href: trainer.dashboard() },
        { title: 'Formations', href: trainer.courses.index() },
    ],
};
