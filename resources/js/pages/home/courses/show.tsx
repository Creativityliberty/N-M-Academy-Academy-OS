import { usePage } from '@inertiajs/react'
import { CourseDetail } from './partials/course-detail'
import type { Course } from './types'

export default function CourseShowPage() {
    const { course } = usePage<{ course: Course }>().props
    return <CourseDetail course={course} />
}
