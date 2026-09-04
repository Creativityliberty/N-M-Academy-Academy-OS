import type { Lesson } from './lesson';

export type Module = {
    id?: number;
    title: string;
    description?: string | null;
    objectives?: string[];
    duration: number;
    minimum_access_rank?: number;
    order?: number;
    locked_by_tier?: boolean;
    locked_by_prerequisite?: boolean;
    lock_reasons?: string[];
    unlock_at?: string | null;
    lessons: Lesson[];
};
