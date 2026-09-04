export type EnrolledCourse = {
    course_id: number;
    title: string;
    description: string | null;
    image: string | null;
    trainer: string;
    trainer_initials: string;
    category: string | null;
    module_count: number;
    lesson_count: number;
    enrolled_at: string | null;
    completed_lesson_count: number;
    progress_percentage: number;
    next_lesson_id: number | null;
    next_lesson_title: string | null;
};
