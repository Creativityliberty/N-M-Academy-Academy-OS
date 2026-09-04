import type { Category } from './category';
import type { Trainer } from './trainer';
import type { Module } from './module';

export type StudentCourse = {
    id: number;
    title: string;
    image: string | null;
    price?: string;
    trainer: string;
    modules: Module[];
};

export type Course = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    target_audience?: string | null;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
    language?: string;
    positioning?: { main_problem?: string; desired_transformation?: string; main_promise?: string; unique_angle?: string } | null;
    price: number;
    duration: number;
    image: string | null;
    thumbnail?: string | null;
    featured: boolean;
    status: 'draft' | 'published' | 'archived';
    status_label: string;
    published_at: string | null;
    category: Category | null;
    trainer: Trainer | null;
    module_count: number;
    modules?: Module[];
    benefits: string[] | null;
    objectives: { title: string; description: string }[] | null;
    prerequisites: string[] | null;
    created_at: string;
    updated_at: string;
};
