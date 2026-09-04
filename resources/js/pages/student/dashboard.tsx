import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpenCheck,
    ChevronRight,
    GraduationCap,
    PlayCircle,
    Target,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { MetricCard } from '@/components/metric-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import student from '@/routes/student';

type ContinueLearning = {
    courseId: number;
    courseTitle: string;
    courseImage: string | null;
    trainer: string;
    lessonId: number;
    lessonTitle: string;
    progressPercentage: number;
};

type Props = {
    stats: {
        enrolledCourses: number;
        completedLessons: number;
        totalLessons: number;
        progressPercentage: number;
    };
    continueLearning: ContinueLearning | null;
};

export default function StudentDashboard() {
    const { stats, continueLearning } = usePage<Props>().props;

    return (
        <>
            <Head title="Mon apprentissage" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Reprenez là où vous en étiez"
                    description="Un espace calme pour suivre vos formations, mesurer votre progression et garder vos notes au même endroit."
                />

                <DashboardSection title="Votre progression">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            label="Formations suivies"
                            value={stats.enrolledCourses}
                            icon={GraduationCap}
                        />
                        <MetricCard
                            label="Leçons terminées"
                            value={stats.completedLessons}
                            icon={BookOpenCheck}
                        />
                        <MetricCard
                            label="Leçons disponibles"
                            value={stats.totalLessons}
                            icon={Target}
                        />
                        <MetricCard
                            label="Progression globale"
                            value={`${stats.progressPercentage}%`}
                            icon={PlayCircle}
                        />
                    </div>
                </DashboardSection>

                <DashboardSection
                    title="Continuer à apprendre"
                    description="Votre prochaine étape, sans avoir à la chercher."
                >
                    {continueLearning ? (
                        <div className="overflow-hidden rounded-[var(--radius)] border border-border/55 bg-card shadow-sm">
                            <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
                                <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                                                Prochaine leçon
                                            </p>
                                            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                                                {continueLearning.courseTitle}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {continueLearning.lessonTitle} ·{' '}
                                                {continueLearning.trainer}
                                            </p>
                                        </div>

                                        <div className="max-w-xl space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Progression de la formation
                                                </span>
                                                <span className="font-semibold">
                                                    {
                                                        continueLearning.progressPercentage
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    continueLearning.progressPercentage
                                                }
                                                className="h-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            asChild
                                            className="gap-2 rounded-full px-5"
                                        >
                                            <Link
                                                href={`/student/courses/${continueLearning.courseId}?lesson=${continueLearning.lessonId}`}
                                            >
                                                <PlayCircle className="h-4 w-4" />
                                                Reprendre la formation
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="gap-2 rounded-full px-5"
                                        >
                                            <Link
                                                href={student.courses.index()}
                                            >
                                                Toutes mes formations
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative min-h-64 overflow-hidden border-t border-border/50 bg-muted lg:min-h-full lg:border-t-0 lg:border-l">
                                    {continueLearning.courseImage ? (
                                        <img
                                            src={continueLearning.courseImage}
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--brand-primary-soft),transparent_62%)]" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/5 to-transparent lg:bg-gradient-to-l" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[var(--radius)] border border-dashed border-border bg-card/55 px-6 py-14 text-center">
                            <GraduationCap className="mx-auto h-9 w-9 text-muted-foreground/60" />
                            <h2 className="mt-4 text-base font-semibold">
                                Votre prochaine formation vous attend
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                                Dès que vous rejoignez une formation, votre
                                prochaine leçon apparaît ici automatiquement.
                            </p>
                            <Button asChild className="mt-6 rounded-full">
                                <Link href="/courses">
                                    Découvrir les formations
                                </Link>
                            </Button>
                        </div>
                    )}
                </DashboardSection>
            </div>
        </>
    );
}

StudentDashboard.layout = {
    breadcrumbs: [{ title: 'Mon apprentissage', href: student.dashboard() }],
};
