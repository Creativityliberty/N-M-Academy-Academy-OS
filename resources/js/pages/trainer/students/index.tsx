import { Head, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/metric-card';
import trainer from '@/routes/trainer';

type Student = {
    id: number;
    name: string;
    email: string;
    courseCount: number;
    courses: string[];
    lastEnrolledAt: string | null;
};

type Props = {
    students: Student[];
    stats: {
        uniqueStudents: number;
        totalEnrollments: number;
        activeCourses: number;
    };
};

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
});

export default function TrainerStudentsIndex() {
    const { students, stats } = usePage<Props>().props;
    const [query, setQuery] = useState('');

    const filteredStudents = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
            return students;
        }

        return students.filter((student) =>
            [student.name, student.email, ...student.courses]
                .join(' ')
                .toLowerCase()
                .includes(normalized),
        );
    }, [query, students]);

    return (
        <>
            <Head title="Étudiants" />

            <div className="mx-auto w-full max-w-[1480px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Pilotez vos étudiants"
                    description="Retrouvez les personnes inscrites à vos formations et gardez une vue claire sur votre base d'apprenants."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <MetricCard
                        label="Étudiants uniques"
                        value={stats.uniqueStudents}
                        icon={Users}
                    />
                    <MetricCard
                        label="Inscriptions"
                        value={stats.totalEnrollments}
                        icon={GraduationCap}
                    />
                    <MetricCard
                        label="Cours actifs"
                        value={stats.activeCourses}
                        icon={BookOpen}
                    />
                </div>

                <DashboardSection
                    title="Base étudiants"
                    description="Recherche par nom, email ou formation."
                >
                    <div className="academy-panel overflow-hidden rounded-[calc(var(--radius)*1.15)]">
                        <div className="border-b border-border/70 p-4 sm:p-5">
                            <div className="relative max-w-md">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Rechercher un étudiant…"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="divide-y divide-border/70">
                            {filteredStudents.length === 0 ? (
                                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                                    Aucun étudiant ne correspond à cette
                                    recherche.
                                </div>
                            ) : (
                                filteredStudents.map((student) => (
                                    <article
                                        key={student.id}
                                        className="grid gap-4 px-5 py-4 transition-colors hover:bg-muted/35 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_auto] lg:items-center"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">
                                                {student.name}
                                            </p>
                                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                                {student.email}
                                            </p>
                                        </div>

                                        <div className="flex min-w-0 flex-wrap gap-2">
                                            {student.courses
                                                .slice(0, 3)
                                                .map((course) => (
                                                    <span
                                                        key={course}
                                                        className="max-w-full truncate rounded-full bg-brand-primary-soft px-2.5 py-1 text-xs font-medium text-brand-primary"
                                                    >
                                                        {course}
                                                    </span>
                                                ))}
                                            {student.courses.length > 3 ? (
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                                    +
                                                    {student.courses.length - 3}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="text-left lg:text-right">
                                            <p className="text-sm font-medium text-foreground">
                                                {student.courseCount} formation
                                                {student.courseCount > 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {student.lastEnrolledAt
                                                    ? `Dernière inscription ${dateFormatter.format(new Date(student.lastEnrolledAt))}`
                                                    : 'Inscription enregistrée'}
                                            </p>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}

TrainerStudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: trainer.dashboard() },
        { title: 'Étudiants', href: trainer.students.index() },
    ],
};
