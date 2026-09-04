<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student\Courses;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ModuleResource;
use App\Http\Resources\Student\EnrollmentResource;
use App\Models\AcademyTutorSetting;
use App\Models\AcademyTutorThread;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssignment;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonNote;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Services\Completion\CourseCompletionService;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CourseController extends Controller
{
    public function index(Request $request, LearningAccessService $access): Response
    {
        $user = $request->user();
        $userId = (int) $user->id;

        $enrollments = Enrollment::with([
            'course' => fn ($q) => $q->with(['trainer', 'category', 'modules.lessons']),
        ])
            ->where('user_id', $userId)
            ->latest('enrolled_at')
            ->get();

        $completedByEnrollment = [];

        foreach ($enrollments as $enrollment) {
            $entitledLessonIds = $access->entitledLessonIds($user, $enrollment->course);
            $accessibleLessonIds = $access->accessibleLessonIds($user, $enrollment->course);
            $completedLessonIds = LessonProgress::query()
                ->where('user_id', $userId)
                ->whereIn('lesson_id', $entitledLessonIds)
                ->pluck('lesson_id');

            $completedLookup = $completedLessonIds->flip();
            $nextLesson = $enrollment->course->modules
                ->flatMap(fn (Module $module) => $module->lessons)
                ->first(fn (Lesson $lesson) => in_array((int) $lesson->id, $accessibleLessonIds, true) && ! $completedLookup->has($lesson->id));

            $completedByEnrollment[$enrollment->course_id] = [
                'completed_count' => $completedLessonIds->count(),
                'total_count' => count($entitledLessonIds),
                'next_lesson_id' => $nextLesson?->id,
                'next_lesson_title' => $nextLesson?->title,
            ];
        }

        $resolvedEnrollments = collect(EnrollmentResource::collection($enrollments)->resolve())
            ->map(function (array $item) use ($completedByEnrollment): array {
                $stats = $completedByEnrollment[$item['course_id']] ?? ['completed_count' => 0, 'total_count' => 0];
                $item['completed_lesson_count'] = $stats['completed_count'];
                $item['progress_percentage'] = $stats['total_count'] > 0
                    ? (int) round($stats['completed_count'] / $stats['total_count'] * 100)
                    : 0;
                $item['next_lesson_id'] = $stats['next_lesson_id'] ?? null;
                $item['next_lesson_title'] = $stats['next_lesson_title'] ?? null;

                return $item;
            })
            ->values();

        return Inertia::render('student/courses/index', [
            'enrollments' => $resolvedEnrollments,
        ]);
    }

    public function show(
        Request $request,
        int $courseId,
        CourseCompletionService $completion,
        LearningAccessService $access,
    ): Response|SymfonyResponse {
        $user = $request->user();

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();
        $isEnrolled = $enrollment !== null;
        $accessRank = (int) ($enrollment?->access_rank ?? -1);

        $course = Course::with(['trainer', 'modules.lessons'])
            ->published()
            ->findOrFail($courseId);

        $entitledLessonIds = $isEnrolled ? $access->entitledLessonIds($user, $course) : [];
        $accessibleLessonIds = $isEnrolled ? $access->accessibleLessonIds($user, $course) : [];
        $completedLessonIds = $isEnrolled
            ? LessonProgress::query()->where('user_id', $user->id)->whereIn('lesson_id', $entitledLessonIds)->pluck('lesson_id')->all()
            : [];

        $totalLessons = count($entitledLessonIds);
        $completedCount = count($completedLessonIds);
        $progressPercentage = $totalLessons > 0
            ? (int) round($completedCount / $totalLessons * 100)
            : 0;

        $requestedLessonId = $request->integer('lesson');
        $initialLessonId = in_array($requestedLessonId, $accessibleLessonIds, true)
            ? $requestedLessonId
            : null;

        $lessonNotes = $isEnrolled
            ? LessonNote::query()->where('user_id', $user->id)->whereIn('lesson_id', $accessibleLessonIds)->pluck('content', 'lesson_id')
            : collect();

        $moduleModels = $course->modules->keyBy('id');
        $lessonModels = $course->modules->flatMap(fn (Module $module) => $module->lessons)->keyBy('id');
        $modules = collect(ModuleResource::collection($course->modules)->resolve())
            ->map(function (array $module) use ($isEnrolled, $accessRank, $access, $user, $moduleModels, $lessonModels): array {
                /** @var Module|null $moduleModel */
                $moduleModel = $moduleModels->get($module['id']);
                $minimumRank = (int) ($module['minimum_access_rank'] ?? 0);
                $tierAllowed = $isEnrolled && $accessRank >= $minimumRank;
                $moduleDecision = ($isEnrolled && $moduleModel)
                    ? $access->decisionForModule($user, $moduleModel)
                    : null;

                $module['locked_by_tier'] = $isEnrolled && ! $tierAllowed;
                $module['locked_by_prerequisite'] = $isEnrolled && $tierAllowed && $moduleDecision !== null && ! $moduleDecision->allowed;
                $module['lock_reasons'] = $moduleDecision?->reasons ?? [];
                $module['unlock_at'] = $moduleDecision?->unlockAt;

                $module['lessons'] = collect($module['lessons'] ?? [])
                    ->map(function (array $lesson) use ($isEnrolled, $tierAllowed, $moduleDecision, $access, $user, $lessonModels): array {
                        /** @var Lesson|null $lessonModel */
                        $lessonModel = $lessonModels->get($lesson['id']);
                        $lessonDecision = ($isEnrolled && $lessonModel)
                            ? $access->decisionForLesson($user, $lessonModel)
                            : null;
                        $lessonAllowed = $lessonDecision?->allowed ?? false;

                        $lesson['locked_by_tier'] = $isEnrolled && ! $tierAllowed;
                        $lesson['locked_by_prerequisite'] = $isEnrolled
                            && $tierAllowed
                            && ! $lessonAllowed;
                        $lesson['lock_reasons'] = $lessonDecision?->reasons ?? [];
                        $lesson['unlock_at'] = $lessonDecision?->unlockAt;
                        $lesson['is_unlocked'] = $isEnrolled
                            ? $lessonAllowed
                            : (bool) ($lesson['free'] ?? false);

                        $mustRedact = $isEnrolled
                            ? ! $lessonAllowed
                            : ! (bool) ($lesson['free'] ?? false);

                        if ($mustRedact) {
                            $lesson['content'] = null;
                            $lesson['transcript'] = null;
                            $lesson['video_url'] = null;
                            $lesson['audio_url'] = null;
                            $lesson['pdf_url'] = null;
                        }

                        return $lesson;
                    })
                    ->values()
                    ->all();

                return $module;
            })
            ->values()
            ->all();

        $assessmentItems = collect();
        if ($isEnrolled && config('academy.features.assessments', true)) {
            $assessmentItems = CourseAssessment::query()
                ->where('course_id', $course->id)
                ->where('is_enabled', true)
                ->with(['module', 'lesson.module'])
                ->withCount(['questions', 'attempts as student_attempt_count' => fn ($query) => $query->where('user_id', $user->id)])
                ->orderBy('position')->orderBy('id')->get()
                ->filter(fn (CourseAssessment $assessment) => $access->canAccessAssessment($user, $assessment))
                ->map(fn (CourseAssessment $assessment) => [
                    'id' => $assessment->id,
                    'title' => $assessment->title,
                    'kind' => $assessment->kind->value,
                    'moduleId' => $assessment->module_id,
                    'lessonId' => $assessment->lesson_id,
                    'passingScorePercent' => (int) $assessment->passing_score_percent,
                    'questionCount' => (int) $assessment->questions_count,
                    'attemptCount' => (int) $assessment->student_attempt_count,
                    'maxAttempts' => $assessment->max_attempts,
                    'url' => route('student.assessments.show', [$course, $assessment]),
                ])->values();
        }

        $assignmentItems = collect();
        if ($isEnrolled && config('academy.features.assignments', true)) {
            $assignmentItems = CourseAssignment::query()
                ->where('course_id', $course->id)
                ->where('is_enabled', true)
                ->with(['module', 'lesson.module'])
                ->withCount(['submissions as student_submission_count' => fn ($query) => $query->where('user_id', $user->id)])
                ->orderBy('position')->orderBy('id')->get()
                ->filter(fn (CourseAssignment $assignment) => $access->canAccessAssignment($user, $assignment))
                ->map(fn (CourseAssignment $assignment) => [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'kind' => $assignment->kind->value,
                    'deliverableType' => $assignment->deliverable_type->value,
                    'moduleId' => $assignment->module_id,
                    'lessonId' => $assignment->lesson_id,
                    'submissionCount' => (int) $assignment->student_submission_count,
                    'url' => route('student.assignments.show', [$course, $assignment]),
                ])->values();
        }

        $tutorSettings = AcademyTutorSetting::forTrainer((int) $course->trainer_id);
        $tutorEnabled = $isEnrolled && $tutorSettings->enabled && $tutorSettings->allowsCourse($course->id);
        $tutorThread = $tutorEnabled
            ? AcademyTutorThread::query()->where('user_id', $user->id)->where('course_id', $course->id)->latest()->with('messages')->first()
            : null;

        return Inertia::render('student/courses/show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'image' => $course->image,
                'price' => number_format((float) $course->price, 0, ',', ' ').' €',
                'trainer' => $course->trainer->name,
                'modules' => $modules,
            ],
            'completedLessonIds' => $completedLessonIds,
            'progressPercentage' => $progressPercentage,
            'completedCount' => $completedCount,
            'totalLessons' => $totalLessons,
            'isEnrolled' => $isEnrolled,
            'accessRank' => $accessRank,
            'initialLessonId' => $initialLessonId,
            'lessonNotes' => $lessonNotes,
            'assessments' => $assessmentItems,
            'assignments' => $assignmentItems,
            'completion' => $completion->status($user, $course)->toArray(),
            'tutor' => [
                'enabled' => $tutorEnabled,
                'threadId' => $tutorThread?->id,
                'messages' => $tutorThread?->messages?->map(fn ($message) => [
                    'id' => $message->id,
                    'role' => $message->role,
                    'content' => $message->content,
                    'sources' => $message->sources ?? [],
                ])->values() ?? [],
                'dailyLimit' => $tutorSettings->daily_limit,
            ],
        ]);
    }
}
