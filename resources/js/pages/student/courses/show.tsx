import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Circle,
    ClipboardCheck,
    Download,
    ExternalLink,
    FileText,
    Headphones,
    Lock,
    NotebookPen,
    PlayCircle,
    Sparkles,
    Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { AiTutorPanel } from './partials/ai-tutor-panel';
import { getLessonTypeLabel, LessonMedia } from './partials/lesson-media';
import { CourseCompletionCard } from '@/components/student/course-completion-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import student from '@/routes/student';
import type { Lesson, LessonType, Module, StudentCourse } from '@/types';

function formatDuration(duration?: string | number | null) {
    if (!duration) {
        return '';
    }

    const value = String(duration);

    return value.toLowerCase().includes('min') ? value : `${value} min`;
}

function TypeBadge({ type }: { type?: LessonType }) {
    const styles: Record<string, string> = {
        text: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        video_url: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
        audio: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
        pdf: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
    };

    return (
        <Badge
            variant="secondary"
            className={cn(
                'px-2 py-0.5 text-[10px] font-medium',
                styles[type ?? 'text'],
            )}
        >
            {getLessonTypeLabel(type)}
        </Badge>
    );
}

function LessonRow({
    lesson,
    index,
    isActive,
    isCompleted,
    isLocked,
    lockLabel,
    lockReason,
    onClick,
}: {
    lesson: Lesson;
    index: number;
    isActive: boolean;
    isCompleted: boolean;
    isLocked: boolean;
    lockLabel?: string;
    lockReason?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLocked}
            title={isLocked ? lockReason : undefined}
            className={cn(
                'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70',
                isActive
                    ? 'bg-primary/10 text-foreground'
                    : 'hover:bg-muted/65',
            )}
        >
            <span className="mt-0.5 shrink-0">
                {isLocked ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Lock className="h-3 w-3" />
                    </span>
                ) : isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                    <span
                        className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        {index + 1}
                    </span>
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-[13px] leading-snug font-medium">
                    {lesson.title}
                </span>
                <span className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                        {formatDuration(lesson.duration)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        {isLocked && (
                            <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[9px]"
                            >
                                {lockLabel ?? 'Verrouillé'}
                            </Badge>
                        )}
                        <TypeBadge type={lesson.type} />
                    </span>
                </span>
            </span>
        </button>
    );
}

function ModuleSection({
    module,
    moduleIndex,
    activeLesson,
    completedLessonIds,
    isEnrolled,
    onSelectLesson,
}: {
    module: Module;
    moduleIndex: number;
    activeLesson: Lesson | null;
    completedLessonIds: number[];
    isEnrolled: boolean;
    onSelectLesson: (lesson: Lesson) => void;
}) {
    const containsActiveLesson = module.lessons?.some(
        (lesson) => lesson.id === activeLesson?.id,
    );
    const completedInModule =
        module.lessons?.filter(
            (lesson) =>
                lesson.id !== undefined &&
                completedLessonIds.includes(lesson.id),
        ).length ?? 0;
    const totalInModule = module.lessons?.length ?? 0;
    const [expanded, setExpanded] = useState(moduleIndex === 0);
    const isOpen = expanded || containsActiveLesson;

    return (
        <section className="border-b border-border/45 py-2 last:border-0">
            <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted/45"
            >
                <span>
                    <span className="block text-sm font-semibold">
                        {moduleIndex + 1}. {module.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {completedInModule}/{totalInModule} leçon
                        {totalInModule > 1 ? 's' : ''}
                    </span>
                </span>
                {isOpen ? (
                    <ChevronUp className="mt-0.5 h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="mt-0.5 h-4 w-4 text-muted-foreground" />
                )}
            </button>

            {isOpen && (
                <div className="space-y-1 px-1 pb-1">
                    {module.lessons?.map((lesson, lessonIndex) => {
                        const paidPreviewLocked =
                            !isEnrolled && !(lesson.free || lesson.is_free);
                        const tierLocked = Boolean(
                            isEnrolled &&
                                (lesson.locked_by_tier || module.locked_by_tier),
                        );
                        const prerequisiteLocked = Boolean(
                            isEnrolled &&
                                (lesson.locked_by_prerequisite ||
                                    module.locked_by_prerequisite),
                        );
                        const isLocked =
                            paidPreviewLocked || tierLocked || prerequisiteLocked;
                        const lockReason =
                            lesson.lock_reasons?.[0] ??
                            module.lock_reasons?.[0];

                        return (
                            <LessonRow
                                key={lesson.id}
                                lesson={lesson}
                                index={lessonIndex}
                                isActive={activeLesson?.id === lesson.id}
                                isCompleted={
                                    lesson.id !== undefined &&
                                    completedLessonIds.includes(lesson.id)
                                }
                                isLocked={isLocked}
                                lockLabel={
                                    paidPreviewLocked
                                        ? 'Payant'
                                        : tierLocked
                                          ? 'Accès supérieur'
                                          : 'À débloquer'
                                }
                                lockReason={lockReason}
                                onClick={() => onSelectLesson(lesson)}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}

type WorkspaceTab = 'overview' | 'notes' | 'resources' | 'tutor';

type ResourceItem = {
    lessonId?: number;
    lessonTitle: string;
    type: LessonType;
    url: string;
};

function ResourceIcon({ type }: { type: LessonType }) {
    if (type === 'audio') {
        return <Headphones className="h-4 w-4" />;
    }

    if (type === 'pdf') {
        return <FileText className="h-4 w-4" />;
    }

    return <Video className="h-4 w-4" />;
}

function ResourceLink({ resource }: { resource: ResourceItem }) {
    const isDownloadable = resource.type === 'pdf';

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/70 p-3.5">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ResourceIcon type={resource.type} />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {resource.lessonTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {getLessonTypeLabel(resource.type)}
                    </p>
                </div>
            </div>
            <Button
                size="sm"
                variant="outline"
                className="shrink-0 rounded-full"
                asChild
            >
                <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    download={isDownloadable || undefined}
                >
                    {isDownloadable ? (
                        <Download className="h-3.5 w-3.5" />
                    ) : (
                        <ExternalLink className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">
                        {isDownloadable ? 'Télécharger' : 'Ouvrir'}
                    </span>
                </a>
            </Button>
        </div>
    );
}

type StudentAssessmentRef = {
    id: number;
    title: string;
    kind: 'quiz' | 'assessment';
    moduleId: number | null;
    lessonId: number | null;
    passingScorePercent: number;
    questionCount: number;
    attemptCount: number;
    maxAttempts: number | null;
    url: string;
};

type StudentAssignmentRef = {
    id: number;
    title: string;
    kind: 'assignment' | 'project';
    deliverableType: 'text' | 'link' | 'files' | 'mixed';
    moduleId: number | null;
    lessonId: number | null;
    submissionCount: number;
    url: string;
};

type CourseCompletionStatus = {
    lessonsRequired: number;
    lessonsCompleted: number;
    assessmentsRequired: number;
    assessmentsPassed: number;
    assignmentsRequired: number;
    assignmentsApproved: number;
    completed: boolean;
    completedAt: string | null;
    certificateUrl: string | null;
    certificatePdfUrl: string | null;
    certificateShareEnabled: boolean;
    certificateVerificationCode: string | null;
};

type PageProps = {
    course: StudentCourse;
    completedLessonIds: number[];
    totalLessons: number;
    isEnrolled: boolean;
    initialLessonId: number | null;
    lessonNotes: Record<string, string>;
    assessments: StudentAssessmentRef[];
    assignments: StudentAssignmentRef[];
    completion: CourseCompletionStatus;
    tutor: {
        enabled: boolean;
        threadId: number | null;
        messages: Array<{
            id?: number;
            role: 'user' | 'assistant';
            content: string;
            sources?: Array<{
                label: string;
                chunkId: number;
                title: string;
                sourceType: string;
                lessonId: number | null;
                snippet: string;
            }>;
        }>;
        dailyLimit: number;
    };
};

export default function StudentCourseShow() {
    const {
        course,
        completedLessonIds: initialCompleted,
        totalLessons,
        isEnrolled,
        initialLessonId,
        lessonNotes: initialLessonNotes,
        assessments,
        assignments,
        completion,
        tutor,
    } = usePage<PageProps>().props;

    const allLessons = useMemo(
        () => course.modules?.flatMap((module) => module.lessons ?? []) ?? [],
        [course.modules],
    );

    const defaultActiveLesson = useMemo(() => {
        if (initialLessonId) {
            const requested = allLessons.find(
                (lesson) => lesson.id === initialLessonId,
            );

            if (requested) {
                return requested;
            }
        }

        if (!isEnrolled) {
            const firstFree = allLessons.find(
                (lesson) => lesson.free || lesson.is_free,
            );

            if (firstFree) {
                return firstFree;
            }
        }

        if (isEnrolled) {
            return (
                allLessons.find((lesson) => lesson.is_unlocked !== false) ??
                null
            );
        }

        return allLessons[0] ?? null;
    }, [allLessons, initialLessonId, isEnrolled]);

    const [activeLesson, setActiveLesson] = useState<Lesson | null>(
        defaultActiveLesson,
    );
    const [completedLessonIds, setCompletedLessonIds] =
        useState<number[]>(initialCompleted);
    const [isTogglingProgress, setIsTogglingProgress] = useState(false);
    const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
    const [notesByLesson, setNotesByLesson] =
        useState<Record<string, string>>(initialLessonNotes);
    const [draftNotes, setDraftNotes] =
        useState<Record<string, string>>(initialLessonNotes);
    const [noteStatus, setNoteStatus] = useState<'idle' | 'saving' | 'saved'>(
        'idle',
    );

    const activeIndex = allLessons.findIndex(
        (lesson) => lesson.id === activeLesson?.id,
    );
    const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
    const nextLesson =
        activeIndex >= 0 && activeIndex < allLessons.length - 1
            ? allLessons[activeIndex + 1]
            : null;
    const activeLessonCompleted =
        activeLesson?.id !== undefined &&
        completedLessonIds.includes(activeLesson.id);
    const completedCount = completedLessonIds.length;
    const progressPercentage =
        totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;
    const isCurrentLessonLocked = Boolean(
        activeLesson &&
            ((!isEnrolled && !(activeLesson.free || activeLesson.is_free)) ||
                (isEnrolled && activeLesson.is_unlocked === false)),
    );
    const activeModule = course.modules?.find((module) => module.lessons?.some((lesson) => lesson.id === activeLesson?.id));
    const activeAssessments = assessments.filter((assessment) =>
        assessment.lessonId === activeLesson?.id ||
        (!assessment.lessonId && assessment.moduleId === activeModule?.id) ||
        (!assessment.lessonId && !assessment.moduleId),
    );
    const activeAssignments = assignments.filter((assignment) =>
        assignment.lessonId === activeLesson?.id ||
        (!assignment.lessonId && assignment.moduleId === activeModule?.id) ||
        (!assignment.lessonId && !assignment.moduleId),
    );

    const resources = useMemo<ResourceItem[]>(() => {
        return allLessons.flatMap((lesson) => {
            const items: ResourceItem[] = [];

            if (lesson.pdf_url) {
                items.push({
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                    type: 'pdf',
                    url: lesson.pdf_url,
                });
            }

            if (lesson.audio_url) {
                items.push({
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                    type: 'audio',
                    url: lesson.audio_url,
                });
            }

            if (lesson.video_url) {
                items.push({
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                    type: 'video_url',
                    url: lesson.video_url,
                });
            }

            return items;
        });
    }, [allLessons]);

    function selectLesson(lesson: Lesson) {
        if (isEnrolled && lesson.is_unlocked === false) {
            return;
        }
        if (!isEnrolled && !(lesson.free || lesson.is_free)) {
            return;
        }

        setActiveLesson(lesson);
        setWorkspaceTab('overview');
        setNoteStatus('idle');
    }

    function toggleLessonComplete() {
        if (!activeLesson?.id || isTogglingProgress || !isEnrolled) {
            return;
        }

        const lessonId = activeLesson.id;
        setIsTogglingProgress(true);

        if (activeLessonCompleted) {
            setCompletedLessonIds((ids) => ids.filter((id) => id !== lessonId));
            router.delete(student.lessons.progress.destroy(lessonId).url, {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsTogglingProgress(false),
                onError: () =>
                    setCompletedLessonIds((ids) =>
                        ids.includes(lessonId) ? ids : [...ids, lessonId],
                    ),
            });

            return;
        }

        setCompletedLessonIds((ids) => [...ids, lessonId]);
        router.post(
            student.lessons.progress.store(lessonId).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsTogglingProgress(false),
                onError: () =>
                    setCompletedLessonIds((ids) =>
                        ids.filter((id) => id !== lessonId),
                    ),
            },
        );
    }

    function saveNote() {
        if (!activeLesson?.id || !isEnrolled) {
            return;
        }

        const lessonId = activeLesson.id;
        const content = (draftNotes[String(lessonId)] ?? '').trim();

        if (!content) {
            return;
        }

        setNoteStatus('saving');

        router.post(
            `/student/lessons/${lessonId}/notes`,
            { content },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setNotesByLesson((notes) => ({
                        ...notes,
                        [String(lessonId)]: content,
                    }));
                    setNoteStatus('saved');
                },
                onError: () => setNoteStatus('idle'),
            },
        );
    }

    function deleteNote() {
        if (!activeLesson?.id || !isEnrolled) {
            return;
        }

        const lessonId = activeLesson.id;
        router.delete(`/student/lessons/${lessonId}/notes`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setNotesByLesson((notes) => {
                    const next = { ...notes };
                    delete next[String(lessonId)];

                    return next;
                });
                setDraftNotes((notes) => ({
                    ...notes,
                    [String(lessonId)]: '',
                }));
                setNoteStatus('idle');
            },
        });
    }

    function handleCheckout() {
        router.post(
            '/courses/checkout',
            { course_id: course.id },
            { preserveScroll: true },
        );
    }

    const curriculum = (
        <div className="space-y-1">
            {course.modules?.map((module, moduleIndex) => (
                <ModuleSection
                    key={module.id}
                    module={module}
                    moduleIndex={moduleIndex}
                    activeLesson={activeLesson}
                    completedLessonIds={completedLessonIds}
                    isEnrolled={isEnrolled}
                    onSelectLesson={selectLesson}
                />
            ))}
        </div>
    );

    return (
        <>
            <Head title={course.title} />

            <div className="mx-auto w-full max-w-[1560px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="-ml-2 gap-1.5 rounded-full"
                    >
                        <Link href={student.courses.index()}>
                            <ChevronLeft className="h-4 w-4" />
                            Mes formations
                        </Link>
                    </Button>

                    <div className="flex min-w-[240px] items-center gap-3">
                        <Progress
                            value={progressPercentage}
                            className="h-2 w-32 sm:w-44"
                        />
                        <span className="text-xs font-semibold text-muted-foreground">
                            {progressPercentage}%
                        </span>
                    </div>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <main className="min-w-0 space-y-5">
                        {!isEnrolled && (
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-primary/20 bg-primary/5 px-4 py-3">
                                <p className="text-sm font-medium">
                                    Mode aperçu · les leçons gratuites restent
                                    accessibles.
                                </p>
                                <Button
                                    size="sm"
                                    className="rounded-full"
                                    onClick={handleCheckout}
                                >
                                    Débloquer la formation{' '}
                                    {course.price ? `· ${course.price}` : ''}
                                </Button>
                            </div>
                        )}

                        {isEnrolled && (completion.lessonsRequired > 0 || completion.assessmentsRequired > 0 || completion.assignmentsRequired > 0 || completion.completed) ? (
                            <CourseCompletionCard completion={completion} courseTitle={course.title} />
                        ) : null}

                        <section className="overflow-hidden rounded-[var(--radius)] border border-border/55 bg-card shadow-sm">
                            <div className="p-4 sm:p-5">
                                {activeLesson ? (
                                    isCurrentLessonLocked ? (
                                        <div className="flex min-h-[430px] flex-col items-center justify-center px-5 py-14 text-center">
                                            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <Lock className="h-7 w-7" />
                                            </span>
                                            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                                                Cette leçon fait partie de la
                                                formation complète
                                            </h1>
                                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                                                Débloquez le programme pour
                                                accéder à cette leçon, garder
                                                vos notes et suivre votre
                                                progression.
                                            </p>
                                            <Button
                                                className="mt-6 gap-2 rounded-full"
                                                onClick={handleCheckout}
                                            >
                                                Accéder à la formation
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <LessonMedia lesson={activeLesson} />
                                    )
                                ) : (
                                    <div className="flex min-h-[430px] flex-col items-center justify-center text-center text-muted-foreground">
                                        <PlayCircle className="h-10 w-10 opacity-35" />
                                        <p className="mt-3 text-sm">
                                            Sélectionnez une leçon pour
                                            commencer.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {activeLesson && !isCurrentLessonLocked && (
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/45 px-4 py-4 sm:px-5">
                                    <Button
                                        variant="outline"
                                        disabled={!prevLesson}
                                        onClick={() =>
                                            prevLesson &&
                                            selectLesson(prevLesson)
                                        }
                                        className="rounded-full"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Précédent
                                    </Button>

                                    {isEnrolled && (
                                        <Button
                                            variant={
                                                activeLessonCompleted
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            onClick={toggleLessonComplete}
                                            disabled={isTogglingProgress}
                                            className={cn(
                                                'rounded-full px-5',
                                                activeLessonCompleted &&
                                                    'border-primary/25 bg-primary/5 text-primary hover:bg-primary/10',
                                            )}
                                        >
                                            {activeLessonCompleted ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <Circle className="h-4 w-4" />
                                            )}
                                            {activeLessonCompleted
                                                ? 'Leçon terminée'
                                                : 'Marquer comme terminée'}
                                        </Button>
                                    )}

                                    <Button
                                        disabled={!nextLesson}
                                        onClick={() =>
                                            nextLesson &&
                                            selectLesson(nextLesson)
                                        }
                                        className="rounded-full"
                                    >
                                        Suivant
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </section>

                        <details className="rounded-[var(--radius)] border border-border/55 bg-card p-4 lg:hidden">
                            <summary className="cursor-pointer list-none text-sm font-semibold">
                                Programme · {completedCount}/{totalLessons}{' '}
                                leçons terminées
                            </summary>
                            <div className="mt-4">{curriculum}</div>
                        </details>

                        {activeLesson && !isCurrentLessonLocked && (
                            <section className="rounded-[var(--radius)] border border-border/55 bg-card p-4 shadow-sm sm:p-5">
                                <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted/60 p-1">
                                    {(
                                        [
                                            ['overview', 'Aperçu', BookOpen],
                                            ['notes', 'Notes', NotebookPen],
                                            [
                                                'resources',
                                                'Ressources',
                                                FileText,
                                            ],
                                            ['tutor', 'AI Tutor', Sparkles],
                                        ] as const
                                    ).map(([tab, label, Icon]) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setWorkspaceTab(tab)}
                                            className={cn(
                                                'flex min-w-fit flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition',
                                                workspaceTab === tab
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {workspaceTab === 'overview' && (
                                    <div className="space-y-5 py-5">
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="rounded-xl border border-border/45 bg-background/65 p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Leçon
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {activeLesson.title}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-border/45 bg-background/65 p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Format
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {getLessonTypeLabel(
                                                        activeLesson.type,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-border/45 bg-background/65 p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Durée
                                                </p>
                                                <p className="mt-1 text-sm font-semibold">
                                                    {formatDuration(
                                                        activeLesson.duration,
                                                    ) || '—'}
                                                </p>
                                            </div>
                                        </div>
                                        {activeLesson.content && (
                                            <div className="rounded-xl border border-border/45 bg-background/65 p-5">
                                                <h2 className="text-sm font-semibold">
                                                    Contenu
                                                </h2>
                                                <div className="mt-3 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                                                    {activeLesson.content}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {workspaceTab === 'overview' && activeAssessments.length > 0 && (
                                    <div className="space-y-3 pb-5">
                                        <div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Quiz & évaluations</h2></div>
                                        {activeAssessments.map((assessment) => (
                                            <Link key={assessment.id} href={assessment.url} className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/70 p-4 transition hover:bg-muted/45">
                                                <div><p className="text-sm font-medium">{assessment.title}</p><p className="mt-1 text-xs text-muted-foreground">{assessment.questionCount} questions · réussite {assessment.passingScorePercent}% · {assessment.attemptCount} tentative(s)</p></div>
                                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {workspaceTab === 'overview' && activeAssignments.length > 0 && (
                                    <div className="space-y-3 pb-5">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <h2 className="text-sm font-semibold">Assignments & projets</h2>
                                        </div>
                                        {activeAssignments.map((assignment) => (
                                            <Link key={assignment.id} href={assignment.url} className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/70 p-4 transition hover:bg-muted/45">
                                                <div>
                                                    <p className="text-sm font-medium">{assignment.title}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {assignment.kind === 'project' ? 'Projet' : 'Devoir'} · {assignment.submissionCount} rendu(s)
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {workspaceTab === 'notes' && (
                                    <div className="space-y-4 py-5">
                                        {isEnrolled ? (
                                            <>
                                                <div>
                                                    <h2 className="text-sm font-semibold">
                                                        Note personnelle
                                                    </h2>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Cette note reste
                                                        attachée à la leçon et à
                                                        votre compte.
                                                    </p>
                                                </div>
                                                <Textarea
                                                    value={
                                                        draftNotes[
                                                            String(
                                                                activeLesson.id,
                                                            )
                                                        ] ?? ''
                                                    }
                                                    onChange={(event) => {
                                                        const lessonId = String(
                                                            activeLesson.id,
                                                        );
                                                        setDraftNotes(
                                                            (notes) => ({
                                                                ...notes,
                                                                [lessonId]:
                                                                    event.target
                                                                        .value,
                                                            }),
                                                        );
                                                        setNoteStatus('idle');
                                                    }}
                                                    placeholder="Écrivez ce que vous voulez retenir, revoir ou mettre en pratique…"
                                                    className="min-h-36 resize-y bg-background/80"
                                                />
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <span className="text-xs text-muted-foreground">
                                                        {noteStatus === 'saved'
                                                            ? 'Note enregistrée.'
                                                            : 'Jusqu’à 10 000 caractères.'}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        {notesByLesson[
                                                            String(
                                                                activeLesson.id,
                                                            )
                                                        ] && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={
                                                                    deleteNote
                                                                }
                                                                className="rounded-full"
                                                            >
                                                                Effacer
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            onClick={saveNote}
                                                            disabled={
                                                                !(
                                                                    draftNotes[
                                                                        String(
                                                                            activeLesson.id,
                                                                        )
                                                                    ] ?? ''
                                                                ).trim() ||
                                                                noteStatus ===
                                                                    'saving'
                                                            }
                                                            className="rounded-full"
                                                        >
                                                            {noteStatus ===
                                                            'saving'
                                                                ? 'Enregistrement…'
                                                                : 'Enregistrer'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Les notes personnelles sont
                                                disponibles une fois inscrit à
                                                la formation.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {workspaceTab === 'resources' && (
                                    <div className="space-y-3 py-5">
                                        {resources.length > 0 ? (
                                            resources.map((resource, index) => (
                                                <ResourceLink
                                                    key={`${resource.lessonId ?? 'lesson'}-${resource.type}-${index}`}
                                                    resource={resource}
                                                />
                                            ))
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
                                                <FileText className="mx-auto h-7 w-7 text-muted-foreground/50" />
                                                <p className="mt-3 text-sm font-medium">
                                                    Aucune ressource jointe
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Les PDF, audios ou liens de
                                                    la formation apparaîtront
                                                    ici automatiquement.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {workspaceTab === 'tutor' && activeLesson && (
                                    <AiTutorPanel
                                        courseId={course.id}
                                        lessonId={activeLesson.id}
                                        lessonTitle={activeLesson.title}
                                        enabled={tutor.enabled && isEnrolled}
                                        initialThreadId={tutor.threadId}
                                        initialMessages={tutor.messages}
                                    />
                                )}
                            </section>
                        )}
                    </main>

                    <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-hidden rounded-[var(--radius)] border border-border/55 bg-card shadow-sm lg:block">
                        <div className="border-b border-border/45 p-4">
                            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                                Programme
                            </p>
                            <h2 className="mt-2 line-clamp-2 text-base font-semibold tracking-tight">
                                {course.title}
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {course.trainer}
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span>
                                        {completedCount}/{totalLessons} leçons
                                    </span>
                                    <span>{progressPercentage}%</span>
                                </div>
                                <Progress
                                    value={progressPercentage}
                                    className="h-1.5"
                                />
                            </div>
                        </div>
                        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto p-2">
                            {curriculum}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

StudentCourseShow.layout = {
    breadcrumbs: [
        { title: 'Mon apprentissage', href: student.dashboard() },
        { title: 'Mes formations', href: student.courses.index() },
    ],
};
