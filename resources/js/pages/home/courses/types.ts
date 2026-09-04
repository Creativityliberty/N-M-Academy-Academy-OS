export type CourseLesson = {
    title: string;
    duration: number;
    free: boolean;
};

export type CourseModule = {
    id: number;
    title: string;
    duration: number;
    order: number;
    minimum_access_rank?: number;
    locked_by_tier?: boolean;
    lessons: CourseLesson[];
};

export type CourseTrainer = {
    name: string;
    initials: string;
    role: string | null;
    bio: string | null;
    courseCount?: number;
    studentCount?: string;
};

export type CourseObjective = {
    title: string;
    description: string;
};

export type CourseReview = {
    initials: string;
    name: string;
    role: string;
    text: string;
    rating: number;
};

export type CourseOffer = {
    id: number;
    name: string;
    billing_type: 'free' | 'one_time' | 'subscription';
    amount: number;
    currency: string;
    interval: 'month' | 'year' | null;
    access_rank: number;
    trial_days: number;
    is_default: boolean;
};

export type Course = {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: string;
    offers?: CourseOffer[];
    duration: number;
    image: string;
    featured: boolean;
    category: string;
    moduleCount: number;
    lessonCount: number;
    studentCount: number;
    rating: number;
    benefits: string[] | null;
    objectives?: CourseObjective[];
    prerequisites: string[] | null;
    trainer: CourseTrainer | null;
    modules?: CourseModule[];
    reviews?: CourseReview[];
    is_enrolled: boolean;
};
