import { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types/pagination';
import type { Course } from '@/types/course';
import CourseController from '@/actions/App/Http/Controllers/Admin/Courses/CourseController';
import { createColumns } from './columns';

const COURSE_STATUSES = [
    { label: 'Brouillon', value: 'draft' },
    { label: 'Publié', value: 'published' },
] as const;

type Props = {
    courses: Paginated<Course>;
};

export default function CourseList({ courses }: Props) {
    const columns = useMemo(() => createColumns(), []);

    const prevUrl = courses.links[0]?.url;
    const nextUrl = courses.links[courses.links.length - 1]?.url;

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={courses.data}
                searchFilter={{
                    columnIds: ['title'],
                    placeholder: 'Rechercher par titre...',
                }}
                facetedFilters={[
                    {
                        columnId: 'status',
                        title: 'Statut',
                        options: COURSE_STATUSES,
                    },
                ]}
                actionButton={{
                    label: 'Créer une formation',
                    onClick: () => router.visit(CourseController.create.url()),
                }}
            />

            {courses.last_page > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!prevUrl}
                        onClick={() => prevUrl && router.visit(prevUrl)}
                    >
                        Précédent
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {courses.current_page} / {courses.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!nextUrl}
                        onClick={() => nextUrl && router.visit(nextUrl)}
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </div>
    );
}
