import { useState, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { CourseCard } from './partials/course-card'
import { CoursesHeader, type CourseFilters } from './partials/courses-header'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from './types'

const PER_PAGE = 6

const defaultFilters: CourseFilters = { categories: [], trainers: [] }

type PageProps = {
    courses: Course[]
    categories: string[]
    trainers: string[]
}

export default function Courses() {
    const { courses, categories, trainers } = usePage<PageProps>().props

    const [filters, setFilters] = useState<CourseFilters>(defaultFilters)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('popular')
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        let list = [...courses]

        if (filters.categories.length)
            list = list.filter((c) => filters.categories.includes(c.category))
        if (filters.trainers.length)
            list = list.filter((c) => c.trainer?.name && filters.trainers.includes(c.trainer.name))
        if (search.trim())
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(search.toLowerCase()) ||
                    c.category.toLowerCase().includes(search.toLowerCase()) ||
                    c.trainer?.name.toLowerCase().includes(search.toLowerCase()),
            )

        if (sort === 'popular') list.sort((a, b) => b.studentCount - a.studentCount)
        if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
        if (sort === 'price-asc') list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        if (sort === 'price-desc') list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        if (sort === 'trainer') list.sort((a, b) => (a.trainer?.name ?? '').localeCompare(b.trainer?.name ?? ''))

        return list
    }, [courses, filters, search, sort])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const handleFilters = (f: CourseFilters) => { setFilters(f); setPage(1) }
    const handleSearch = (v: string) => { setSearch(v); setPage(1) }

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[150px] dark:bg-primary/[0.06]" />
            </div>

            <div className="relative w-full px-4 py-10 md:px-6 lg:px-10">
                <CoursesHeader
                    search={search}
                    onSearch={handleSearch}
                    sort={sort}
                    onSort={(v) => { setSort(v); setPage(1) }}
                    filters={filters}
                    onFilters={handleFilters}
                    total={filtered.length}
                    categoryOptions={categories}
                    trainerOptions={trainers}
                />

                {paginated.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {paginated.map((course, i) => (
                            <CourseCard key={course.id} course={course} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-background/60 py-20 text-center backdrop-blur-sm">
                        <p className="text-lg font-medium text-foreground/60">Aucune formation trouvée</p>
                        <p className="mt-1 text-sm text-foreground/40">Essayez de modifier vos filtres</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="border-border/40 bg-background/60 backdrop-blur-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant={p === page ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setPage(p)}
                                className={p !== page ? 'border-border/40 bg-background/60 backdrop-blur-sm' : ''}
                            >
                                {p}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="border-border/40 bg-background/60 backdrop-blur-sm"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
