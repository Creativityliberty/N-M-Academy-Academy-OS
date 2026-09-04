export type LessonType = 'text' | 'video_url' | 'audio' | 'pdf';

export type Lesson = {
    id?: number;
    title: string;
    content?: string | null;
    transcript?: string | null;
    duration: number;
    order?: number;
    is_free: boolean;
    free?: boolean;
    type?: LessonType;
    video_url?: string | null;
    audio_url?: string | null;
    pdf_url?: string | null;
    locked_by_tier?: boolean;
    locked_by_prerequisite?: boolean;
    lock_reasons?: string[];
    unlock_at?: string | null;
    is_unlocked?: boolean;
};
