import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    GraduationCap,
    PlayCircle,
} from 'lucide-react';
import { DashboardHero } from '@/components/dashboard-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import student from '@/routes/student';
import type { EnrolledCourse } from '@/types';

function EnrolledCourseCard({
    enrollment,
    index,
}: {
    enrollment: EnrolledCourse;
    index: number;
}) {
    const isComplete = enrollment.progress_percentage === 100;
    const targetLesson = enrollment.next_lesson_id
        ? `?lesson=${enrollment.next_lesson_id}`
        : '';

    return (
        <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.04 }}
            className="group overflow-hidden rounded-[var(--radius)] border border-border/55 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {enrollment.image ? (
                    <img
                        src={enrollment.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                ) : (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,var(--brand-primary-soft),transparent_70%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                {enrollment.category && (
                    <Badge className="absolute top-4 left-4 border-white/20 bg-black/25 text-white backdrop-blur-md">
                        {enrollment.category}
                    </Badge>
                )}

                <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                            {enrollment.trainer_initials}
                        </span>
                        <span>{enrollment.trainer}</span>
                    </div>
                    {isComplete && (
                        <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Terminée
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-5 p-5">
                <div className="space-y-2">
                    <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">
                        {enrollment.title}
                    </h2>
                    {enrollment.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {enrollment.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {enrollment.module_count} module
                        {enrollment.module_count > 1 ? 's' : ''}
                    </span>
                    <span>
                        {enrollment.lesson_count} leçon
                        {enrollment.lesson_count > 1 ? 's' : ''}
                    </span>
                    {enrollment.enrolled_at && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {enrollment.enrolled_at}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            {enrollment.next_lesson_title ?? 'Progression'}
                        </span>
                        <span className="font-semibold">
                            {enrollment.progress_percentage}%
                        </span>
                    </div>
                    <Progress
                        value={enrollment.progress_percentage}
                        className="h-2"
                    />
                </div>

                <Button className="w-full gap-2 rounded-full" asChild>
                    <Link
                        href={`/student/courses/${enrollment.course_id}${targetLesson}`}
                    >
                        <PlayCircle className="h-4 w-4" />
                        {isComplete ? 'Revoir la formation' : 'Continuer'}
                    </Link>
                </Button>
            </div>
        </motion.article>
    );
}

function EmptyState() {
    return (
        <div className="rounded-[var(--radius)] border border-dashed border-border bg-card/50 px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">
                Votre bibliothèque est vide
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Rejoignez une formation et elle apparaîtra ici avec sa
                progression et votre prochaine leçon.
            </p>
            <Button asChild className="mt-6 rounded-full">
                <Link href="/courses">Découvrir les formations</Link>
            </Button>
        </div>
    );
}

export default function StudentCoursesIndex() {
    const { enrollments } = usePage<{ enrollments: EnrolledCourse[] }>().props;

    return (
        <>
            <Head title="Mes formations" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Ma bibliothèque"
                    description={
                        enrollments.length > 0
                            ? `${enrollments.length} formation${enrollments.length > 1 ? 's' : ''} dans votre espace d’apprentissage.`
                            : 'Vos formations et votre progression seront réunies ici.'
                    }
                />

                {enrollments.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {enrollments.map((enrollment, index) => (
                            <EnrolledCourseCard
                                key={enrollment.course_id}
                                enrollment={enrollment}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

StudentCoursesIndex.layout = {
    breadcrumbs: [
        { title: 'Mon apprentissage', href: student.dashboard() },
        { title: 'Mes formations', href: student.courses.index() },
    ],
};
