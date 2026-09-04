<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Actions\Courses\PublishCourseAction;
use App\Actions\Courses\UnpublishCourseAction;
use App\Actions\Courses\ArchiveCourseAction;
use App\Enums\CourseStatus;
use App\Enums\LessonType;
use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyAiRun;
use App\Models\AcademyEvent;
use App\Models\AcademyTutorRun;
use App\Models\AcademyOrder;
use App\Models\AcademyMembership;
use App\Models\AcademyCoupon;
use App\Models\AffiliatePartner;
use App\Models\CourseOffer;
use App\Models\TrainerCommerceSetting;
use App\Models\CommunityPost;
use App\Models\Category;
use App\Models\AcademyPage;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssessmentQuestion;
use App\Models\CourseAssignment;
use App\Models\CourseAssignmentRubricItem;
use App\Models\CourseUnlockRule;
use App\Models\CourseCompletionPolicy;
use App\Models\CourseCertificate;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\User;
use App\Tutor\KnowledgeRetriever;
use App\Tutor\AcademyTutor;
use App\Services\Commerce\CommerceAnalyticsService;
use App\Services\Commerce\RefundService;
use App\Services\Courses\CourseMediaGenerationService;
use App\Services\Assessments\AssessmentDefinitionService;
use App\Services\Assessments\AssessmentDefinitionValidator;
use App\Services\Assessments\AssessmentHistoryGuard;
use App\Services\Assignments\AssignmentDefinitionService;
use App\Services\LearningAccess\LearningAccessService;
use App\Services\LearningAccess\UnlockRuleDefinitionService;
use App\PageBuilder\PageBlockRegistry;
use Illuminate\Support\Str;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class AcademyMcpToolExecutor
{
    public function __construct(
        private readonly PublishCourseAction $publishCourse,
        private readonly UnpublishCourseAction $unpublishCourse,
        private readonly ArchiveCourseAction $archiveCourse,
        private readonly KnowledgeRetriever $knowledge,
        private readonly AcademyTutor $tutor,
        private readonly CommerceAnalyticsService $commerceAnalytics,
        private readonly RefundService $refunds,
        private readonly PageBlockRegistry $pageBlocks,
        private readonly CourseMediaGenerationService $courseMedia,
        private readonly AssessmentDefinitionService $assessmentDefinitions,
        private readonly AssessmentDefinitionValidator $assessmentValidator,
        private readonly AssessmentHistoryGuard $assessmentHistory,
        private readonly AssignmentDefinitionService $assignmentDefinitions,
        private readonly LearningAccessService $learningAccess,
        private readonly UnlockRuleDefinitionService $unlockRules,
    ) {}

    /** @param array<string, mixed> $arguments @return array<string, mixed> */
    public function execute(User $user, string $tool, array $arguments, ?string $receiptId = null): array
    {
        $args = $this->preflight($user, $tool, $arguments);

        return match ($tool) {
            'academy.summary' => $this->academySummary($user),
            'categories.list' => $this->categoriesList($args),
            'courses.list' => $this->coursesList($user, $args),
            'courses.get' => $this->coursesGet($user, $args),
            'courses.create' => $this->coursesCreate($user, $args),
            'courses.update' => $this->coursesUpdate($user, $args),
            'courses.publish' => $this->coursesPublish($user, $args),
            'courses.unpublish' => $this->coursesUnpublish($user, $args),
            'courses.archive' => $this->coursesArchive($user, $args),
            'modules.list' => $this->modulesList($user, $args),
            'modules.create' => $this->modulesCreate($user, $args),
            'modules.update' => $this->modulesUpdate($user, $args),
            'modules.delete' => $this->modulesDelete($user, $args),
            'modules.reorder' => $this->modulesReorder($user, $args),
            'lessons.list' => $this->lessonsList($user, $args),
            'lessons.create' => $this->lessonsCreate($user, $args),
            'lessons.update' => $this->lessonsUpdate($user, $args),
            'lessons.delete' => $this->lessonsDelete($user, $args),
            'lessons.reorder' => $this->lessonsReorder($user, $args),
            'assessments.list' => $this->assessmentsList($user, $args),
            'assessments.get' => $this->assessmentsGet($user, $args),
            'assessments.create' => $this->assessmentsCreate($user, $args),
            'assessments.update' => $this->assessmentsUpdate($user, $args),
            'assessments.delete' => $this->assessmentsDelete($user, $args),
            'assessment.questions.create' => $this->assessmentQuestionsCreate($user, $args),
            'assessment.questions.update' => $this->assessmentQuestionsUpdate($user, $args),
            'assessment.questions.delete' => $this->assessmentQuestionsDelete($user, $args),
            'assessment.questions.reorder' => $this->assessmentQuestionsReorder($user, $args),
            'assignments.list' => $this->assignmentsList($user, $args),
            'assignments.get' => $this->assignmentsGet($user, $args),
            'assignments.create' => $this->assignmentsCreate($user, $args),
            'assignments.update' => $this->assignmentsUpdate($user, $args),
            'assignments.delete' => $this->assignmentsDelete($user, $args),
            'assignment.rubric.create' => $this->assignmentRubricCreate($user, $args),
            'assignment.rubric.update' => $this->assignmentRubricUpdate($user, $args),
            'assignment.rubric.delete' => $this->assignmentRubricDelete($user, $args),
            'assignment.rubric.reorder' => $this->assignmentRubricReorder($user, $args),
            'learning.access.rules.list' => $this->learningAccessRulesList($user, $args),
            'learning.access.rules.create' => $this->learningAccessRulesCreate($user, $args),
            'learning.access.rules.update' => $this->learningAccessRulesUpdate($user, $args),
            'learning.access.rules.delete' => $this->learningAccessRulesDelete($user, $args),
            'completion.policy.get' => $this->completionPolicyGet($user, $args),
            'completion.policy.update' => $this->completionPolicyUpdate($user, $args),
            'certificates.list' => $this->certificatesList($user, $args),
            'certificates.get' => $this->certificatesGet($user, $args),
            'certificates.revoke' => $this->certificatesRevoke($user, $args),
            'students.search' => $this->studentsSearch($user, $args),
            'students.segment' => $this->studentsSegment($user, $args),
            'students.risk.summary' => $this->studentsRiskSummary($user),
            'analytics.summary' => $this->analyticsSummary($user),
            'analytics.learning' => $this->analyticsLearning($user, $args),
            'events.list' => $this->eventsList($user, $args),
            'events.create' => $this->eventsCreate($user, $args),
            'community.posts.list' => $this->communityPostsList($args),
            'learning.progress.get' => $this->studentLearningProgress($user, $args),
            'course.knowledge.search' => $this->studentKnowledgeSearch($user, $args),
            'lesson.get' => $this->studentLessonGet($user, $args),
            'tutor.quiz.generate' => $this->studentTutorQuiz($user, $args),
            'offers.list' => $this->offersList($user, $args),
            'offers.create' => $this->offersCreate($user, $args),
            'offers.update' => $this->offersUpdate($user, $args),
            'offers.deactivate' => $this->offersDeactivate($user, $args),
            'pages.list' => $this->pagesList($user, $args),
            'pages.create' => $this->pagesCreate($user, $args),
            'course.cover.generate' => $this->courseCoverGenerate($user, $args),
            'course.thumbnail.generate' => $this->courseThumbnailGenerate($user, $args),
            'lesson.audio.generate' => $this->lessonAudioGenerate($user, $args),
            'coupons.create' => $this->couponsCreate($user, $args),
            'affiliates.create' => $this->affiliatesCreate($user, $args),
            'memberships.list' => $this->membershipsList($user, $args),
            'sales.refund' => $this->salesRefund($user, $args, $receiptId),
            'sales.summary' => $this->salesSummary($user),
            'ai.usage.summary' => $this->aiUsageSummary($user),
            default => throw new RuntimeException("Unsupported Academy MCP tool: {$tool}"),
        };
    }

    /** @param array<string, mixed> $arguments @return array<string, mixed> */
    public function preflight(User $user, string $tool, array $arguments): array
    {
        $args = $this->validate($tool, $arguments);
        $studentTools = ['learning.progress.get', 'course.knowledge.search', 'lesson.get', 'tutor.quiz.generate'];
        if (in_array($tool, $studentTools, true)) {
            if (! $user->hasRole('student')) {
                throw new AuthorizationException('This MCP tool is restricted to students.');
            }
        } elseif (! $user->hasAnyRole(['trainer', 'admin', 'super-admin'])) {
            throw new AuthorizationException('This MCP tool is restricted to Academy creators.');
        }

        match ($tool) {
            'courses.get', 'courses.update', 'courses.publish', 'courses.unpublish', 'courses.archive', 'modules.list', 'modules.reorder', 'offers.list', 'pages.create', 'course.cover.generate', 'course.thumbnail.generate' => $this->ownedCourse($user, (int) $args['course_id']),
            'modules.create' => $this->ownedCourse($user, (int) $args['course_id']),
            'modules.update', 'modules.delete', 'lessons.list', 'lessons.reorder' => $this->ownedModule($user, (int) $args['module_id']),
            'lessons.create' => $this->ownedModule($user, (int) $args['module_id']),
            'lessons.update', 'lessons.delete', 'lesson.audio.generate' => $this->ownedLesson($user, (int) $args['lesson_id']),
            'assessments.list', 'assessments.create' => $this->ownedCourse($user, (int) $args['course_id']),
            'assessments.get', 'assessments.update', 'assessments.delete' => $this->ownedAssessment($user, (int) $args['assessment_id']),
            'assessment.questions.create', 'assessment.questions.reorder' => $this->ownedAssessment($user, (int) $args['assessment_id']),
            'assessment.questions.update', 'assessment.questions.delete' => $this->ownedAssessmentQuestion($user, (int) $args['question_id']),
            'assignments.list', 'assignments.create' => $this->ownedCourse($user, (int) $args['course_id']),
            'assignments.get', 'assignments.update', 'assignments.delete' => $this->ownedAssignment($user, (int) $args['assignment_id']),
            'assignment.rubric.create', 'assignment.rubric.reorder' => $this->ownedAssignment($user, (int) $args['assignment_id']),
            'assignment.rubric.update', 'assignment.rubric.delete' => $this->ownedAssignmentRubric($user, (int) $args['rubric_id']),
            'learning.access.rules.list', 'learning.access.rules.create' => $this->ownedCourse($user, (int) $args['course_id']),
            'learning.access.rules.update', 'learning.access.rules.delete' => $this->ownedUnlockRule($user, (int) $args['unlock_rule_id']),
            'completion.policy.get', 'completion.policy.update', 'certificates.list' => $this->ownedCourse($user, (int) $args['course_id']),
            'certificates.get', 'certificates.revoke' => $this->ownedCertificate($user, (int) $args['certificate_id']),
            'students.search' => isset($args['course_id']) ? $this->ownedCourse($user, (int) $args['course_id']) : null,
            'students.segment' => $this->ownedCourse($user, (int) $args['course_id']),
            'analytics.learning' => isset($args['course_id']) ? $this->ownedCourse($user, (int) $args['course_id']) : null,
            'offers.create' => $this->ownedCourse($user, (int) $args['course_id']),
            'offers.update', 'offers.deactivate' => $this->ownedOffer($user, (int) $args['offer_id']),
            'coupons.create' => isset($args['course_id']) ? $this->ownedCourse($user, (int) $args['course_id']) : null,
            'memberships.list' => isset($args['course_id']) ? $this->ownedCourse($user, (int) $args['course_id']) : null,
            'sales.refund' => $this->ownedOrder($user, (int) $args['order_id']),
            'learning.progress.get', 'course.knowledge.search', 'tutor.quiz.generate' => $this->enrolledCourse($user, (int) $args['course_id']),
            'lesson.get' => $this->enrolledLesson($user, (int) $args['lesson_id']),
            default => null,
        };

        return $args;
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function categoriesList(array $args): array
    {
        return ['items' => Category::query()->orderBy('order')->limit((int) ($args['limit'] ?? 100))->get(['id','name','slug'])->toArray()];
    }

    /** @return array<string, mixed> */
    private function academySummary(User $user): array
    {
        $courseIds = $this->courseIds($user);
        $enrollments = Enrollment::query()->whereIn('course_id', $courseIds)->get();
        $recorded = $enrollments->whereNotNull('amount_paid');

        return [
            'courses' => $courseIds->count(),
            'publishedCourses' => Course::query()->whereIn('id', $courseIds)->where('status', CourseStatus::Published->value)->count(),
            'students' => $enrollments->pluck('user_id')->unique()->count(),
            'enrollments' => $enrollments->count(),
            'recordedSales' => $recorded->count(),
            'revenueByCurrency' => $this->revenueByCurrency($recorded),
            'upcomingEvents' => AcademyEvent::query()->where('creator_id', $user->id)->where('is_cancelled', false)->where('starts_at', '>', now())->count(),
        ];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesList(User $user, array $args): array
    {
        $query = $user->courses()->withCount('enrollments')->latest();
        if (isset($args['status'])) {
            $query->where('status', $args['status']);
        }

        return ['items' => $query->limit((int) ($args['limit'] ?? 25))->get()->map(fn (Course $course) => [
            'id' => $course->id,
            'title' => $course->title,
            'status' => $course->status->value,
            'price' => (float) $course->price,
            'duration' => (int) $course->duration,
            'students' => (int) $course->enrollments_count,
            'stripeReady' => (bool) ($course->stripe_product_id && $course->stripe_price_id),
        ])->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesGet(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id'])->load(['category:id,name,slug','modules.lessons','offers']);

        return ['course' => $this->coursePayload($course, true)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesCreate(User $user, array $args): array
    {
        $course = Course::create([
            'trainer_id' => $user->id,
            'category_id' => $args['category_id'],
            'title' => trim($args['title']),
            'description' => trim($args['description']),
            'target_audience' => trim((string) ($args['target_audience'] ?? '')) ?: null,
            'level' => $args['level'] ?? 'all_levels',
            'language' => strtolower((string) ($args['language'] ?? 'fr')),
            'positioning' => $args['positioning'] ?? null,
            'price' => $args['price'] ?? 0,
            'duration' => $args['duration'] ?? 1,
            'featured' => false,
            'benefits' => array_values((array) ($args['benefits'] ?? [])),
            'objectives' => array_values((array) ($args['objectives'] ?? [])),
            'prerequisites' => array_values((array) ($args['prerequisites'] ?? [])),
            'status' => CourseStatus::Draft->value,
        ]);

        return ['course' => $this->coursePayload($course), 'message' => 'Draft course created.'];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesUpdate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $updates = collect($args)->only(['category_id','title','description','target_audience','level','language','positioning','benefits','objectives','prerequisites','price','duration','image','thumbnail'])->all();
        if ($updates === []) {
            throw ValidationException::withMessages(['arguments' => 'At least one mutable course field is required.']);
        }

        if ($course->status === CourseStatus::Published && array_key_exists('price', $updates)) {
            throw new RuntimeException('Published course pricing must be changed through CourseOffer, not the legacy course price.');
        }

        $course->update($updates);

        return ['course' => $this->coursePayload($course->fresh()), 'message' => 'Course updated.'];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesPublish(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        if ($course->status === CourseStatus::Published && $course->published_at !== null) {
            return ['course' => $this->coursePayload($course), 'message' => 'Course already published.'];
        }

        $course = $this->publishCourse->handle($course);

        return ['course' => $this->coursePayload($course), 'message' => 'Course published.'];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesUnpublish(User $user, array $args): array
    {
        $course = $this->unpublishCourse->handle($this->ownedCourse($user, (int) $args['course_id']));
        return ['course' => $this->coursePayload($course), 'message' => 'Course unpublished.'];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function coursesArchive(User $user, array $args): array
    {
        $course = $this->archiveCourse->handle($this->ownedCourse($user, (int) $args['course_id']));
        return ['course' => $this->coursePayload($course), 'message' => 'Course archived.'];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function modulesList(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        return ['items' => $course->modules()->withCount('lessons')->get()->map(fn (Module $module) => $this->modulePayload($module))->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function modulesCreate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $module = $course->modules()->create([
            'title' => trim($args['title']),
            'description' => trim((string) ($args['description'] ?? '')) ?: null,
            'objectives' => array_values((array) ($args['objectives'] ?? [])),
            'duration' => $args['duration'] ?? 1,
            'minimum_access_rank' => $args['minimum_access_rank'] ?? 0,
        ]);
        IndexCourseKnowledge::dispatch((int) $course->id)->afterCommit();

        return ['module' => $this->modulePayload($module)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function modulesUpdate(User $user, array $args): array
    {
        $module = $this->ownedModule($user, (int) $args['module_id']);
        $updates = collect($args)->only(['title','description','objectives','duration','minimum_access_rank'])->all();
        if ($updates === []) { throw ValidationException::withMessages(['arguments' => 'At least one mutable module field is required.']); }
        $module->update($updates);
        IndexCourseKnowledge::dispatch((int) $module->course_id)->afterCommit();
        return ['module' => $this->modulePayload($module->fresh())];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function modulesDelete(User $user, array $args): array
    {
        $module = $this->ownedModule($user, (int) $args['module_id']);
        $courseId = (int) $module->course_id;
        $moduleId = (int) $module->id;
        $module->delete();
        IndexCourseKnowledge::dispatch($courseId)->afterCommit();
        return ['deletedModuleId' => $moduleId];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function modulesReorder(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $ids = array_values(array_unique(array_map('intval', (array) $args['module_ids'])));
        $owned = $course->modules()->whereIn('id', $ids)->pluck('id')->map(fn ($id) => (int) $id)->all();
        if (count($owned) !== count($ids)) { throw new AuthorizationException('One or more modules do not belong to this course.'); }
        DB::transaction(function () use ($ids): void { foreach ($ids as $order => $id) { Module::whereKey($id)->update(['order' => $order]); } });
        IndexCourseKnowledge::dispatch((int) $course->id)->afterCommit();
        return ['items' => $course->modules()->get()->map(fn (Module $module) => $this->modulePayload($module))->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function lessonsList(User $user, array $args): array
    {
        $module = $this->ownedModule($user, (int) $args['module_id']);
        return ['items' => $module->lessons()->get()->map(fn (Lesson $lesson) => $this->lessonPayload($lesson))->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function lessonsCreate(User $user, array $args): array
    {
        $module = $this->ownedModule($user, (int) $args['module_id']);
        $lesson = $module->lessons()->create($this->normalizeLessonMediaInput([
            'title' => trim($args['title']),
            'content' => trim((string) ($args['content'] ?? '')) ?: null,
            'transcript' => trim((string) ($args['transcript'] ?? '')) ?: null,
            'duration' => $args['duration'] ?? 1,
            'is_free' => (bool) ($args['is_free'] ?? false),
            'type' => $args['type'] ?? LessonType::Text->value,
            'video_url' => $args['video_url'] ?? null,
            'audio_url' => $args['audio_url'] ?? null,
            'pdf_url' => $args['pdf_url'] ?? null,
        ]));

        IndexCourseKnowledge::dispatch((int) $module->course_id)->afterCommit();

        return ['lesson' => $this->lessonPayload($lesson)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function lessonsUpdate(User $user, array $args): array
    {
        $lesson = $this->ownedLesson($user, (int) $args['lesson_id']);
        $updates = collect($args)->only(['title','content','transcript','duration','is_free','type','video_url','audio_url','pdf_url'])->all();
        if ($updates === []) {
            throw ValidationException::withMessages(['arguments' => 'At least one mutable lesson field is required.']);
        }
        $lesson->update($this->normalizeLessonMediaInput($updates, $lesson));

        $courseId = (int) $lesson->module()->value('course_id');
        IndexCourseKnowledge::dispatch($courseId)->afterCommit();

        return ['lesson' => $this->lessonPayload($lesson->fresh())];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function lessonsDelete(User $user, array $args): array
    {
        $lesson = $this->ownedLesson($user, (int) $args['lesson_id']);
        $courseId = (int) $lesson->module()->value('course_id');
        $lessonId = (int) $lesson->id;
        $lesson->delete();
        IndexCourseKnowledge::dispatch($courseId)->afterCommit();
        return ['deletedLessonId' => $lessonId];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function lessonsReorder(User $user, array $args): array
    {
        $module = $this->ownedModule($user, (int) $args['module_id']);
        $ids = array_values(array_unique(array_map('intval', (array) $args['lesson_ids'])));
        $owned = $module->lessons()->whereIn('id', $ids)->pluck('id')->map(fn ($id) => (int) $id)->all();
        if (count($owned) !== count($ids)) { throw new AuthorizationException('One or more lessons do not belong to this module.'); }
        DB::transaction(function () use ($ids): void { foreach ($ids as $order => $id) { Lesson::whereKey($id)->update(['order' => $order]); } });
        IndexCourseKnowledge::dispatch((int) $module->course_id)->afterCommit();
        return ['items' => $module->lessons()->get()->map(fn (Lesson $lesson) => $this->lessonPayload($lesson))->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentsList(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        return ['items' => $course->assessments()->with('questions.options')->get()->map(fn (CourseAssessment $assessment) => $this->assessmentPayload($assessment))->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentsGet(User $user, array $args): array
    {
        return ['assessment' => $this->assessmentPayload($this->ownedAssessment($user, (int) $args['assessment_id'])->load('questions.options'))];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentsCreate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $assessment = $this->assessmentDefinitions->create($course, $args);
        return ['assessment' => $this->assessmentPayload($assessment)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentsUpdate(User $user, array $args): array
    {
        $assessment = $this->ownedAssessment($user, (int) $args['assessment_id'])->load('questions.options');
        $base = $this->assessmentDefinitionInput($assessment);
        $payload = array_replace($base, collect($args)->except('assessment_id')->all());
        $updated = $this->assessmentDefinitions->update($assessment, $payload);
        return ['assessment' => $this->assessmentPayload($updated)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentsDelete(User $user, array $args): array
    {
        $assessment = $this->ownedAssessment($user, (int) $args['assessment_id']);
        $this->assessmentHistory->assertDeletable($assessment);
        $id = (int) $assessment->id;
        $assessment->delete();
        return ['deletedAssessmentId' => $id];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentQuestionsCreate(User $user, array $args): array
    {
        $assessment = $this->ownedAssessment($user, (int) $args['assessment_id']);
        $this->assessmentHistory->assertQuestionBankMutable($assessment);
        $definition = $this->assessmentValidator->validateQuestion($args);
        $question = DB::transaction(function () use ($assessment, $definition): CourseAssessmentQuestion {
            $question = $assessment->questions()->create([
                'type' => $definition['type'], 'prompt' => $definition['prompt'], 'explanation' => $definition['explanation'],
                'points' => $definition['points'], 'position' => ((int) $assessment->questions()->max('position')) + 1,
            ]);
            foreach ($definition['options'] as $position => $option) {
                $question->options()->create(['text' => $option['text'], 'is_correct' => $option['is_correct'], 'position' => $position + 1]);
            }
            return $question->fresh('options');
        });
        return ['question' => $this->assessmentQuestionPayload($question)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentQuestionsUpdate(User $user, array $args): array
    {
        $question = $this->ownedAssessmentQuestion($user, (int) $args['question_id'])->load(['options', 'assessment']);
        $this->assessmentHistory->assertQuestionBankMutable($question->assessment);
        $base = [
            'type' => $question->type->value, 'prompt' => $question->prompt, 'explanation' => $question->explanation,
            'points' => (int) $question->points,
            'options' => $question->options->map(fn ($option) => ['text' => $option->text, 'is_correct' => (bool) $option->is_correct])->values()->all(),
        ];
        $definition = $this->assessmentValidator->validateQuestion(array_replace($base, collect($args)->except('question_id')->all()));
        DB::transaction(function () use ($question, $definition): void {
            $question->update(['type' => $definition['type'], 'prompt' => $definition['prompt'], 'explanation' => $definition['explanation'], 'points' => $definition['points']]);
            $question->options()->delete();
            foreach ($definition['options'] as $position => $option) {
                $question->options()->create(['text' => $option['text'], 'is_correct' => $option['is_correct'], 'position' => $position + 1]);
            }
        });
        return ['question' => $this->assessmentQuestionPayload($question->fresh('options'))];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentQuestionsDelete(User $user, array $args): array
    {
        $question = $this->ownedAssessmentQuestion($user, (int) $args['question_id'])->load('assessment');
        $this->assessmentHistory->assertQuestionBankMutable($question->assessment);
        $id = (int) $question->id;
        $question->delete();
        return ['deletedQuestionId' => $id];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function assessmentQuestionsReorder(User $user, array $args): array
    {
        $assessment = $this->ownedAssessment($user, (int) $args['assessment_id']);
        $this->assessmentHistory->assertQuestionBankMutable($assessment);
        $ids = array_values(array_unique(array_map('intval', (array) $args['question_ids'])));
        $owned = $assessment->questions()->whereIn('id', $ids)->pluck('id')->map(fn ($id) => (int) $id)->all();
        if (count($owned) !== count($ids)) { throw new AuthorizationException('One or more questions do not belong to this assessment.'); }
        DB::transaction(function () use ($ids): void { foreach ($ids as $position => $id) { CourseAssessmentQuestion::whereKey($id)->update(['position' => $position + 1]); } });
        return ['items' => $assessment->questions()->with('options')->get()->map(fn (CourseAssessmentQuestion $question) => $this->assessmentQuestionPayload($question))->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentsList(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        return ['items' => $course->assignments()->with('rubricItems')->get()->map(fn (CourseAssignment $assignment) => $this->assignmentPayload($assignment))->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentsGet(User $user, array $args): array
    {
        return ['assignment' => $this->assignmentPayload($this->ownedAssignment($user, (int) $args['assignment_id'])->load('rubricItems'))];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentsCreate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        return ['assignment' => $this->assignmentPayload($this->assignmentDefinitions->create($course, $args))];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentsUpdate(User $user, array $args): array
    {
        $assignment = $this->ownedAssignment($user, (int) $args['assignment_id'])->load('rubricItems');
        $payload = array_replace($this->assignmentDefinitionInput($assignment), collect($args)->except('assignment_id')->all());
        return ['assignment' => $this->assignmentPayload($this->assignmentDefinitions->update($assignment, $payload))];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentsDelete(User $user, array $args): array
    {
        $assignment = $this->ownedAssignment($user, (int) $args['assignment_id']);
        $id = (int) $assignment->id;
        $this->assignmentDefinitions->delete($assignment);
        return ['deletedAssignmentId' => $id];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentRubricCreate(User $user, array $args): array
    {
        $assignment = $this->ownedAssignment($user, (int) $args['assignment_id']);
        $this->assignmentDefinitions->assertDefinitionMutable($assignment);
        $item = $assignment->rubricItems()->create([
            'criterion' => trim($args['criterion']),
            'description' => trim((string) ($args['description'] ?? '')) ?: null,
            'max_points' => (int) $args['max_points'],
            'position' => (int) (($assignment->rubricItems()->max('position') ?? 0) + 1),
        ]);
        return ['rubric' => $this->assignmentRubricPayload($item)];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentRubricUpdate(User $user, array $args): array
    {
        $item = $this->ownedAssignmentRubric($user, (int) $args['rubric_id']);
        $this->assignmentDefinitions->assertDefinitionMutable($item->assignment);
        $updates = collect($args)->except('rubric_id')->only(['criterion','description','max_points'])->all();
        if ($updates === []) { throw ValidationException::withMessages(['arguments' => 'At least one rubric field is required.']); }
        $item->update($updates);
        return ['rubric' => $this->assignmentRubricPayload($item->fresh())];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentRubricDelete(User $user, array $args): array
    {
        $item = $this->ownedAssignmentRubric($user, (int) $args['rubric_id']);
        $this->assignmentDefinitions->assertDefinitionMutable($item->assignment);
        $id = (int) $item->id;
        $item->delete();
        return ['deletedRubricId' => $id];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function assignmentRubricReorder(User $user, array $args): array
    {
        $assignment = $this->ownedAssignment($user, (int) $args['assignment_id']);
        $this->assignmentDefinitions->assertDefinitionMutable($assignment);
        $ids = array_values(array_unique(array_map('intval', (array) $args['rubric_ids'])));
        $owned = $assignment->rubricItems()->whereIn('id', $ids)->pluck('id')->map(fn ($id) => (int) $id)->all();
        if (count($owned) !== count($ids)) { throw new AuthorizationException('One or more rubric items do not belong to this assignment.'); }
        DB::transaction(function () use ($ids): void { foreach ($ids as $position => $id) { CourseAssignmentRubricItem::whereKey($id)->update(['position' => $position + 1]); } });
        return ['items' => $assignment->rubricItems()->get()->map(fn ($item) => $this->assignmentRubricPayload($item))->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function learningAccessRulesList(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);

        return ['items' => $this->unlockRules->listForCourse($course)
            ->map(fn (CourseUnlockRule $rule) => $this->unlockRulePayload($rule))
            ->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function learningAccessRulesCreate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        unset($args['course_id']);
        $rule = $this->unlockRules->create($course, $args);

        return ['rule' => $this->unlockRulePayload($rule)];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function learningAccessRulesUpdate(User $user, array $args): array
    {
        $rule = $this->ownedUnlockRule($user, (int) $args['unlock_rule_id']);
        unset($args['unlock_rule_id']);
        $rule = $this->unlockRules->update($rule, $args);

        return ['rule' => $this->unlockRulePayload($rule)];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function learningAccessRulesDelete(User $user, array $args): array
    {
        $rule = $this->ownedUnlockRule($user, (int) $args['unlock_rule_id']);
        $id = (int) $rule->id;
        $this->unlockRules->delete($rule);

        return ['deleted' => true, 'unlock_rule_id' => $id];
    }

    /** @return array<string,mixed> */
    private function unlockRulePayload(CourseUnlockRule $rule): array
    {
        return [
            'id' => $rule->id,
            'course_id' => $rule->course_id,
            'target_type' => $rule->target_type->value,
            'target_id' => (int) $rule->target_id,
            'rule_type' => $rule->rule_type->value,
            'source_type' => $rule->source_type?->value,
            'source_id' => $rule->source_id ? (int) $rule->source_id : null,
            'delay_days' => $rule->delay_days,
            'available_at' => $rule->available_at?->toIso8601String(),
            'is_enabled' => (bool) $rule->is_enabled,
            'position' => (int) $rule->position,
        ];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function completionPolicyGet(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $policy = CourseCompletionPolicy::query()->firstOrCreate(
            ['course_id' => $course->id],
            ['require_all_accessible_lessons' => true, 'certificate_enabled' => true],
        );

        return ['policy' => [
            'course_id' => $course->id,
            'require_all_accessible_lessons' => (bool) $policy->require_all_accessible_lessons,
            'certificate_enabled' => (bool) $policy->certificate_enabled,
            'certificate_title' => $policy->certificate_title,
            'issuer_name' => $policy->issuer_name,
            'assessment_required_ids' => $course->assessments()->where('is_required_for_completion', true)->pluck('id')->map(fn ($id) => (int) $id)->all(),
            'assignment_required_ids' => $course->assignments()->where('is_required_for_completion', true)->pluck('id')->map(fn ($id) => (int) $id)->all(),
        ]];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function completionPolicyUpdate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $assessmentIds = collect($args['assessment_required_ids'] ?? $course->assessments()->where('is_required_for_completion', true)->pluck('id')->all())->map(fn ($id) => (int) $id)->unique()->values();
        $assignmentIds = collect($args['assignment_required_ids'] ?? $course->assignments()->where('is_required_for_completion', true)->pluck('id')->all())->map(fn ($id) => (int) $id)->unique()->values();

        if ($assessmentIds->isNotEmpty() && $course->assessments()->whereIn('id', $assessmentIds)->count() !== $assessmentIds->count()) {
            throw new AuthorizationException('One or more assessments do not belong to this course.');
        }
        if ($assignmentIds->isNotEmpty() && $course->assignments()->whereIn('id', $assignmentIds)->count() !== $assignmentIds->count()) {
            throw new AuthorizationException('One or more assignments do not belong to this course.');
        }

        DB::transaction(function () use ($course, $args, $assessmentIds, $assignmentIds): void {
            $policy = CourseCompletionPolicy::query()->firstOrCreate(['course_id' => $course->id], ['require_all_accessible_lessons' => true, 'certificate_enabled' => true]);
            $updates = collect($args)->only(['require_all_accessible_lessons','certificate_enabled','certificate_title','issuer_name'])->all();
            if ($updates !== []) { $policy->update($updates); }

            if (array_key_exists('assessment_required_ids', $args)) {
                $course->assessments()->update(['is_required_for_completion' => false]);
                if ($assessmentIds->isNotEmpty()) { $course->assessments()->whereIn('id', $assessmentIds)->update(['is_required_for_completion' => true]); }
            }
            if (array_key_exists('assignment_required_ids', $args)) {
                $course->assignments()->update(['is_required_for_completion' => false]);
                if ($assignmentIds->isNotEmpty()) { $course->assignments()->whereIn('id', $assignmentIds)->update(['is_required_for_completion' => true]); }
            }
        });

        return $this->completionPolicyGet($user, ['course_id' => $course->id]);
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function certificatesList(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        return ['items' => $course->certificates()->latest('issued_at')->limit((int) ($args['limit'] ?? 50))->get()->map(fn (CourseCertificate $certificate) => $this->certificatePayload($certificate))->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function certificatesGet(User $user, array $args): array
    {
        return ['certificate' => $this->certificatePayload($this->ownedCertificate($user, (int) $args['certificate_id']))];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function certificatesRevoke(User $user, array $args): array
    {
        $certificate = $this->ownedCertificate($user, (int) $args['certificate_id']);
        if ($certificate->revoked_at) {
            throw ValidationException::withMessages(['certificate_id' => 'Certificate is already revoked.']);
        }
        $certificate->update([
            'revoked_at' => now(),
            'revoked_by' => $user->id,
            'revocation_reason' => trim((string) $args['reason']),
        ]);
        return ['certificate' => $this->certificatePayload($certificate->fresh())];
    }

    /** @return array<string,mixed> */
    private function certificatePayload(CourseCertificate $certificate): array
    {
        return [
            'id' => $certificate->id,
            'verification_code' => $certificate->verification_code,
            'recipient_name' => $certificate->recipient_name,
            'course_title' => $certificate->course_title,
            'certificate_title' => $certificate->certificate_title,
            'issuer_name' => $certificate->issuer_name,
            'issued_at' => $certificate->issued_at?->toIso8601String(),
            'revoked_at' => $certificate->revoked_at?->toIso8601String(),
            'revocation_reason' => $certificate->revocation_reason,
            'verification_url' => url('/certificates/verify/'.$certificate->verification_code),
        ];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function studentsSearch(User $user, array $args): array
    {
        $courseIds = $this->courseIds($user);
        if (isset($args['course_id'])) {
            $this->ownedCourse($user, (int) $args['course_id']);
            $courseIds = collect([(int) $args['course_id']]);
        }
        $studentIds = Enrollment::query()->whereIn('course_id', $courseIds)->pluck('user_id')->unique();
        $query = User::query()->whereIn('id', $studentIds);
        if (($term = trim((string) ($args['query'] ?? ''))) !== '') {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%"));
        }

        return ['items' => $query->limit((int) ($args['limit'] ?? 25))->get(['id', 'name', 'email'])->map(fn (User $student) => [
            'id' => $student->id, 'name' => $student->name, 'email' => $student->email,
        ])->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function studentsSegment(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $lessonIds = $course->modules()->with('lessons:id,module_id')->get()->flatMap->lessons->pluck('id');
        $studentIds = $course->enrollments()->pluck('user_id')->unique();
        $lessonCount = max(1, $lessonIds->count());
        $segments = ['not_started' => 0, 'early' => 0, 'progressing' => 0, 'near_complete' => 0, 'complete' => 0];
        $completed = LessonProgress::query()->whereIn('lesson_id', $lessonIds)->whereIn('user_id', $studentIds)->get()->groupBy('user_id');
        foreach ($studentIds as $studentId) {
            $rate = (int) round((($completed->get($studentId)?->count() ?? 0) / $lessonCount) * 100);
            $key = match (true) { $rate === 0 => 'not_started', $rate < 25 => 'early', $rate < 75 => 'progressing', $rate < 100 => 'near_complete', default => 'complete' };
            $segments[$key]++;
        }

        return ['courseId' => $course->id, 'students' => $studentIds->count(), 'segments' => $segments];
    }

    /** @return array<string, mixed> */
    private function studentsRiskSummary(User $user): array
    {
        $courseIds = $this->courseIds($user);
        $courses = Course::query()->whereIn('id', $courseIds)->with(['modules.lessons:id,module_id', 'enrollments:id,user_id,course_id,enrolled_at,created_at'])->get();
        $rows = [];
        $academyStudentIds = collect();
        $academyRiskStudentIds = collect();

        foreach ($courses as $course) {
            $lessonIds = $course->modules->flatMap->lessons->pluck('id');
            $enrollments = $course->enrollments;
            $studentIds = $enrollments->pluck('user_id')->unique();
            $progressByStudent = $lessonIds->isEmpty() || $studentIds->isEmpty()
                ? collect()
                : LessonProgress::query()->whereIn('lesson_id', $lessonIds)->whereIn('user_id', $studentIds)->get(['user_id', 'completed_at'])->groupBy('user_id');
            $courseRisk = 0;
            $notStarted = 0;
            $inactive14d = 0;

            foreach ($enrollments as $enrollment) {
                $completed = $progressByStudent->get($enrollment->user_id, collect());
                $count = $completed->count();
                $complete = $lessonIds->count() > 0 && $count >= $lessonIds->count();
                $joinedAt = $enrollment->enrolled_at ?? $enrollment->created_at;
                $latestActivity = $completed->max('completed_at');
                $isNotStarted = $count === 0 && $joinedAt && $joinedAt->lte(now()->subDays(7));
                $isInactive = ! $complete && $count > 0 && $latestActivity && $latestActivity->lte(now()->subDays(14));

                $academyStudentIds->push((int) $enrollment->user_id);
                if ($isNotStarted) $notStarted++;
                if ($isInactive) $inactive14d++;
                if ($isNotStarted || $isInactive) {
                    $courseRisk++;
                    $academyRiskStudentIds->push((int) $enrollment->user_id);
                }
            }

            $students = $studentIds->count();
            $rows[] = [
                'courseId' => $course->id,
                'title' => $course->title,
                'students' => $students,
                'riskStudents' => $courseRisk,
                'riskRate' => $students > 0 ? round(($courseRisk / $students) * 100, 2) : 0,
                'notStarted7d' => $notStarted,
                'inactive14d' => $inactive14d,
            ];
        }

        $totalStudents = $academyStudentIds->unique()->count();
        $riskStudents = $academyRiskStudentIds->unique()->count();

        return [
            'students' => $totalStudents,
            'riskStudents' => $riskStudents,
            'riskRate' => $totalStudents > 0 ? round(($riskStudents / $totalStudents) * 100, 2) : 0,
            'courses' => $rows,
        ];
    }

    /** @return array<string, mixed> */
    private function analyticsSummary(User $user): array
    {
        $courses = $this->learningRows($user, null);
        $weightedPossible = collect($courses)->sum(fn ($row) => $row['students'] * $row['lessons']);
        $weightedCompleted = collect($courses)->sum('completedLessons');

        return [
            'courses' => count($courses),
            'students' => Enrollment::query()->whereIn('course_id', $this->courseIds($user))->pluck('user_id')->unique()->count(),
            'averageCompletion' => $weightedPossible > 0 ? (int) round(($weightedCompleted / $weightedPossible) * 100) : 0,
        ];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function analyticsLearning(User $user, array $args): array
    {
        return ['courses' => $this->learningRows($user, isset($args['course_id']) ? (int) $args['course_id'] : null)];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function eventsList(User $user, array $args): array
    {
        return ['items' => AcademyEvent::query()->where('creator_id', $user->id)->where('starts_at', '>=', now())->orderBy('starts_at')->limit((int) ($args['limit'] ?? 25))->get()->map(fn (AcademyEvent $event) => [
            'id' => $event->id, 'title' => $event->title, 'startsAt' => $event->starts_at?->toIso8601String(),
            'endsAt' => $event->ends_at?->toIso8601String(), 'timezone' => $event->timezone, 'cancelled' => $event->is_cancelled,
            'registrations' => $event->registrations()->count(), 'capacity' => $event->capacity,
        ])->values()->all()];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function eventsCreate(User $user, array $args): array
    {
        $startsAt = CarbonImmutable::parse($args['starts_at'], $args['timezone'])->utc();
        $endsAt = CarbonImmutable::parse($args['ends_at'], $args['timezone'])->utc();
        if ($startsAt->lte(now()) || $endsAt->lte($startsAt)) {
            throw ValidationException::withMessages(['starts_at' => 'Event dates must be in the future and end after start.']);
        }
        if (empty($args['meeting_url']) && empty($args['location'])) {
            throw ValidationException::withMessages(['meeting_url' => 'meeting_url or location is required.']);
        }
        $event = AcademyEvent::create([
            'creator_id' => $user->id,
            'title' => trim($args['title']),
            'description' => trim($args['description']),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'timezone' => $args['timezone'],
            'meeting_url' => isset($args['meeting_url']) ? trim((string) $args['meeting_url']) ?: null : null,
            'location' => isset($args['location']) ? trim((string) $args['location']) ?: null : null,
            'capacity' => $args['capacity'] ?? null,
            'reminder_minutes' => (int) ($args['reminder_minutes'] ?? 60),
            'is_published' => true,
            'is_cancelled' => false,
        ]);

        return ['event' => ['id' => $event->id, 'title' => $event->title, 'startsAt' => $event->starts_at->toIso8601String(), 'endsAt' => $event->ends_at->toIso8601String()]];
    }

    /** @param array<string, mixed> $args @return array<string, mixed> */
    private function communityPostsList(array $args): array
    {
        $query = CommunityPost::query()->where('is_hidden', false)->with(['space:id,name', 'author:id,name'])->withCount(['comments', 'reactions'])->latest();
        if (isset($args['space_id'])) {
            $query->where('community_space_id', (int) $args['space_id']);
        }
        if (($term = trim((string) ($args['query'] ?? ''))) !== '') {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$term}%")->orWhere('body', 'like', "%{$term}%"));
        }

        return ['items' => $query->limit((int) ($args['limit'] ?? 25))->get()->map(fn (CommunityPost $post) => [
            'id' => $post->id, 'space' => $post->space?->name, 'author' => $post->author?->name, 'title' => $post->title,
            'body' => $post->body, 'pinned' => $post->is_pinned, 'locked' => $post->is_locked,
            'comments' => $post->comments_count, 'reactions' => $post->reactions_count, 'createdAt' => $post->created_at?->toIso8601String(),
        ])->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function studentLearningProgress(User $user, array $args): array
    {
        $course = $this->enrolledCourse($user, (int) $args['course_id']);
        $enrollment = Enrollment::query()->where('user_id',$user->id)->where('course_id',$course->id)->firstOrFail();
        $lessonIds = collect($this->learningAccess->accessibleLessonIds($user, $course));
        $completed = LessonProgress::query()->where('user_id',$user->id)->whereIn('lesson_id',$lessonIds)->count();
        return ['courseId'=>$course->id,'completed'=>$completed,'total'=>$lessonIds->count(),'percentage'=>$lessonIds->count()>0 ? (int)round($completed/$lessonIds->count()*100) : 0,'accessRank'=>(int)$enrollment->access_rank];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function studentKnowledgeSearch(User $user, array $args): array
    {
        $course = $this->enrolledCourse($user, (int) $args['course_id']);
        return ['items'=>$this->knowledge->search($user,$course,(string)$args['query'],null,(int)($args['limit'] ?? 5))];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function studentLessonGet(User $user, array $args): array
    {
        $lesson = $this->enrolledLesson($user, (int) $args['lesson_id']);
        return ['lesson'=>['id'=>$lesson->id,'title'=>$lesson->title,'content'=>$lesson->content,'transcript'=>$lesson->transcript,'duration'=>(int)$lesson->duration,'moduleId'=>$lesson->module_id]];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function studentTutorQuiz(User $user, array $args): array
    {
        $course = $this->enrolledCourse($user, (int) $args['course_id']);
        $lesson = isset($args['lesson_id']) ? $this->enrolledLesson($user, (int) $args['lesson_id']) : null;
        return $this->tutor->run($user,$course,$lesson,'tutor.quiz',(string)($args['prompt'] ?? 'Fais-moi réviser ce contenu avec un quiz.'));
    }

    /** @return array<string, mixed> */
    private function salesSummary(User $user): array
    {
        return $this->commerceAnalytics->forTrainer($user->id);
    }

    /** @return array<string, mixed> */
    private function aiUsageSummary(User $user): array
    {
        $since = now()->subDays(30);
        $creatorRuns = AcademyAiRun::query()->where('user_id', $user->id)->where('created_at', '>=', $since)->get();
        $courseIds = $this->courseIds($user);
        $tutorRuns = AcademyTutorRun::query()->whereIn('course_id', $courseIds)->where('created_at', '>=', $since)->get();

        $providers = $creatorRuns->map(fn ($run) => ['provider' => $run->provider, 'model' => $run->model, 'kind' => 'creator'])
            ->concat($tutorRuns->map(fn ($run) => ['provider' => $run->provider, 'model' => $run->model, 'kind' => 'tutor']))
            ->filter(fn ($row) => ! empty($row['provider']))
            ->groupBy(fn ($row) => ($row['provider'] ?? 'unknown').'|'.($row['model'] ?? 'unknown'))
            ->map(function ($rows, $key): array {
                [$provider, $model] = array_pad(explode('|', (string) $key, 2), 2, 'unknown');
                return ['provider' => $provider, 'model' => $model, 'runs' => $rows->count()];
            })->values()->all();

        $last24h = $tutorRuns->filter(fn ($run) => $run->created_at && $run->created_at->gte(now()->subDay()));
        $previous24h = AcademyTutorRun::query()
            ->whereIn('course_id', $courseIds)
            ->whereBetween('created_at', [now()->subDays(2), now()->subDay()])
            ->get();

        return [
            'windowDays' => 30,
            'creatorRuns30d' => $creatorRuns->count(),
            'creatorFailures30d' => $creatorRuns->where('status', 'failed')->count(),
            'tutorRuns30d' => $tutorRuns->count(),
            'tutorFailures30d' => $tutorRuns->where('status', 'failed')->count(),
            'inputTokens30d' => (int) $tutorRuns->sum('input_tokens'),
            'outputTokens30d' => (int) $tutorRuns->sum('output_tokens'),
            'estimatedCostCents30d' => (int) $tutorRuns->sum('estimated_cost_cents'),
            'estimatedCostCents24h' => (int) $last24h->sum('estimated_cost_cents'),
            'estimatedCostCentsPrevious24h' => (int) $previous24h->sum('estimated_cost_cents'),
            'providers' => $providers,
            'costCoverage' => 'tutor_only',
        ];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function offersList(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        return ['items' => $course->offers()->get()->map(fn (CourseOffer $offer) => $this->offerPayload($offer))->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function offersUpdate(User $user, array $args): array
    {
        $offer = $this->ownedOffer($user, (int) $args['offer_id']);
        $updates = collect($args)->only(['name','amount','currency','access_rank','trial_days','is_default','is_active'])->all();
        if ($updates === []) { throw ValidationException::withMessages(['arguments' => 'At least one mutable offer field is required.']); }
        if (isset($updates['currency'])) { $updates['currency'] = strtoupper((string) $updates['currency']); }
        if (($updates['is_default'] ?? false) === true) { CourseOffer::where('course_id', $offer->course_id)->where('id', '<>', $offer->id)->update(['is_default' => false]); }
        $offer->update($updates);
        return ['offer' => $this->offerPayload($offer->fresh())];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function offersDeactivate(User $user, array $args): array
    {
        $offer = $this->ownedOffer($user, (int) $args['offer_id']);
        $offer->update(['is_active' => false, 'is_default' => false]);
        return ['offer' => $this->offerPayload($offer->fresh())];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function pagesList(User $user, array $args): array
    {
        $query = AcademyPage::query()->where('trainer_id', $user->id)->latest();
        if (isset($args['status'])) { $query->where('status', $args['status']); }
        return ['items' => $query->limit((int) ($args['limit'] ?? 25))->get()->map(fn (AcademyPage $page) => [
            'id' => $page->id, 'title' => $page->title, 'slug' => $page->slug, 'status' => $page->status,
        ])->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function pagesCreate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $base = Str::slug((string) $args['title']) ?: 'page';
        $slug = $base; $i = 2;
        while (AcademyPage::where('slug', $slug)->exists()) { $slug = $base.'-'.$i++; }
        $page = AcademyPage::create([
            'trainer_id' => $user->id, 'title' => trim((string) $args['title']), 'slug' => $slug,
            'page_type' => 'landing', 'status' => 'draft', 'meta_title' => trim((string) $args['title']),
            'meta_description' => trim((string) ($args['meta_description'] ?? $course->description)),
        ]);
        $sections = [
            ['type'=>'hero','variant'=>'centered','settings'=>['headline'=>$args['headline'],'subheadline'=>$args['subheadline'] ?? $course->description,'primary_label'=>$args['cta_label'] ?? 'Découvrir la formation','primary_url'=>'#pricing','course_id'=>$course->id]],
            ['type'=>'course','variant'=>'featured','settings'=>['title'=>$course->title,'description'=>$course->description,'course_id'=>$course->id]],
            ['type'=>'curriculum','variant'=>'accordion','settings'=>['title'=>'Programme','course_id'=>$course->id,'show_lessons'=>true]],
            ['type'=>'pricing','variant'=>'cards','settings'=>['title'=>'Choisissez votre offre','course_id'=>$course->id]],
            ['type'=>'cta','variant'=>'centered','settings'=>['title'=>$course->title,'button_label'=>$args['cta_label'] ?? 'Commencer','button_url'=>'#pricing']],
        ];
        foreach ($sections as $order => $section) {
            $this->pageBlocks->assertAllowed($section['type'], $section['variant']);
            $page->sections()->create(['type'=>$section['type'],'variant'=>$section['variant'],'sort_order'=>$order,'settings'=>$this->pageBlocks->sanitizeSettings($section['type'],$section['settings'])]);
        }
        return ['page' => ['id'=>$page->id,'title'=>$page->title,'slug'=>$page->slug,'status'=>$page->status]];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function courseCoverGenerate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $path = $this->courseMedia->generateCourseImage($course, (string) $args['prompt'], 'cover');
        return ['course' => $this->coursePayload($course->fresh()), 'path' => $path];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function courseThumbnailGenerate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        $path = $this->courseMedia->generateCourseImage($course, (string) $args['prompt'], 'thumbnail');
        return ['course' => $this->coursePayload($course->fresh()), 'path' => $path];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function lessonAudioGenerate(User $user, array $args): array
    {
        $lesson = $this->ownedLesson($user, (int) $args['lesson_id']);
        $path = $this->courseMedia->generateLessonAudio($lesson, $args['voice'] ?? null, $args['instructions'] ?? null);
        $courseId = (int) $lesson->module()->value('course_id');
        IndexCourseKnowledge::dispatch($courseId)->afterCommit();
        return ['lesson' => $this->lessonPayload($lesson->fresh()), 'path' => $path];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function offersCreate(User $user, array $args): array
    {
        $course = $this->ownedCourse($user, (int) $args['course_id']);
        if (($args['billing_type'] ?? '') === 'subscription' && empty($args['interval'])) {
            throw ValidationException::withMessages(['interval' => 'Subscription offers require month or year interval.']);
        }
        $offer = CourseOffer::create([
            'course_id' => $course->id,
            'name' => trim((string) $args['name']),
            'slug' => Str::slug((string) $args['name']).'-'.Str::lower(Str::random(5)),
            'billing_type' => $args['billing_type'],
            'amount' => (int) $args['amount'],
            'currency' => strtoupper((string) $args['currency']),
            'interval' => $args['interval'] ?? null,
            'access_rank' => (int) $args['access_rank'],
            'trial_days' => (int) ($args['trial_days'] ?? 0),
            'is_active' => true,
        ]);

        return ['offer' => $offer->only(['id','course_id','name','billing_type','amount','currency','interval','access_rank','trial_days'])];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function couponsCreate(User $user, array $args): array
    {
        $coupon = AcademyCoupon::create([
            'trainer_id' => $user->id,
            'course_id' => $args['course_id'] ?? null,
            'code' => mb_strtoupper(trim((string) $args['code'])),
            'discount_type' => $args['discount_type'],
            'discount_value' => (int) $args['discount_value'],
            'currency' => isset($args['currency']) ? strtoupper((string) $args['currency']) : null,
            'max_redemptions' => $args['max_redemptions'] ?? null,
            'is_active' => true,
        ]);

        return ['coupon' => $coupon->only(['id','course_id','code','discount_type','discount_value','currency','max_redemptions'])];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function affiliatesCreate(User $user, array $args): array
    {
        $settings = TrainerCommerceSetting::forTrainer($user->id);
        $partner = AffiliatePartner::create([
            'trainer_id' => $user->id,
            'name' => trim((string) $args['name']),
            'email' => $args['email'] ?? null,
            'code' => Str::lower((string) ($args['code'] ?? Str::random(10))),
            'commission_bps' => (int) ($args['commission_bps'] ?? $settings->default_affiliate_bps),
            'is_active' => true,
        ]);

        return ['affiliate' => $partner->only(['id','name','email','code','commission_bps'])];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function membershipsList(User $user, array $args): array
    {
        $query = AcademyMembership::query()
            ->with(['user:id,name,email','course:id,title','offer:id,name,amount,currency,interval'])
            ->whereHas('course', fn ($q) => $q->where('trainer_id', $user->id));
        if (isset($args['course_id'])) $query->where('course_id', (int) $args['course_id']);
        if (isset($args['status'])) $query->where('status', $args['status']);
        return ['items' => $query->latest()->limit((int)($args['limit'] ?? 25))->get()->map(fn ($membership) => [
            'id'=>$membership->id,'student'=>$membership->user?->name,'email'=>$membership->user?->email,'course'=>$membership->course?->title,'offer'=>$membership->offer?->name,'status'=>$membership->status,'currentPeriodEnd'=>$membership->current_period_end?->toIso8601String(),
        ])->values()->all()];
    }

    /** @param array<string,mixed> $args @return array<string,mixed> */
    private function salesRefund(User $user, array $args, ?string $receiptId): array
    {
        $order = $this->ownedOrder($user, (int) $args['order_id']);
        $refund = $this->refunds->refund($user, $order, (int) $args['amount'], $args['reason'] ?? null, $receiptId);
        return ['refund' => $refund->only(['id','order_id','amount','currency','status','stripe_refund_id','receipt_id','processed_at'])];
    }

    /** @return array<int, array<string, mixed>> */
    private function learningRows(User $user, ?int $onlyCourseId): array
    {
        $query = $user->courses()->with(['modules.lessons:id,module_id', 'enrollments:id,user_id,course_id'])->orderByDesc('created_at');
        if ($onlyCourseId !== null) {
            $this->ownedCourse($user, $onlyCourseId);
            $query->whereKey($onlyCourseId);
        }

        return $query->get()->map(function (Course $course): array {
            $lessonIds = $course->modules->flatMap->lessons->pluck('id');
            $studentIds = $course->enrollments->pluck('user_id')->unique();
            $possible = $lessonIds->count() * $studentIds->count();
            $completed = $possible > 0 ? LessonProgress::query()->whereIn('user_id', $studentIds)->whereIn('lesson_id', $lessonIds)->count() : 0;

            return [
                'id' => $course->id, 'title' => $course->title, 'status' => $course->status->value,
                'students' => $studentIds->count(), 'lessons' => $lessonIds->count(), 'completedLessons' => $completed,
                'completionRate' => $possible > 0 ? (int) round(($completed / $possible) * 100) : 0,
            ];
        })->values()->all();
    }

    private function enrolledCourse(User $user, int $id): Course
    {
        if (! Enrollment::query()->where('user_id', $user->id)->where('course_id', $id)->exists()) {
            throw new AuthorizationException('Course not enrolled for this MCP student.');
        }

        return Course::findOrFail($id);
    }

    private function enrolledLesson(User $user, int $id): Lesson
    {
        $lesson = Lesson::with('module:id,course_id,minimum_access_rank')->findOrFail($id);
        if (! $this->learningAccess->canAccessLesson($user, $lesson)) {
            throw new AuthorizationException('Cette leçon est verrouillée pour cet étudiant.');
        }

        return $lesson;
    }

    private function ownedUnlockRule(User $user, int $id): CourseUnlockRule
    {
        $rule = CourseUnlockRule::query()->with('course')->find($id);
        if (! $rule || ((int) $rule->course?->trainer_id !== (int) $user->id && ! $user->isAdmin())) {
            throw new AuthorizationException('Learning access rule not found or not owned.');
        }

        return $rule;
    }

    private function ownedCertificate(User $user, int $id): CourseCertificate
    {
        return CourseCertificate::query()->whereHas('course', function ($query) use ($user): void {
            if (! $user->isAdmin()) {
                $query->where('trainer_id', $user->id);
            }
        })->find($id) ?? throw new AuthorizationException('Certificate not found or not owned.');
    }

    private function ownedAssignment(User $user, int $id): CourseAssignment
    {
        $assignment = CourseAssignment::query()->with('course')->find($id);
        if (! $assignment || ((int) $assignment->course?->trainer_id !== (int) $user->id && ! $user->isAdmin())) {
            throw new AuthorizationException('Assignment not found or not owned.');
        }
        return $assignment;
    }

    private function ownedAssignmentRubric(User $user, int $id): CourseAssignmentRubricItem
    {
        $item = CourseAssignmentRubricItem::query()->with('assignment.course')->find($id);
        if (! $item || ((int) $item->assignment?->course?->trainer_id !== (int) $user->id && ! $user->isAdmin())) {
            throw new AuthorizationException('Rubric item not found or not owned.');
        }
        return $item;
    }

    /** @return array<string,mixed> */
    private function assignmentPayload(CourseAssignment $assignment): array
    {
        $assignment->loadMissing('rubricItems');
        return [
            'id' => $assignment->id,
            'course_id' => $assignment->course_id,
            'module_id' => $assignment->module_id,
            'lesson_id' => $assignment->lesson_id,
            'title' => $assignment->title,
            'instructions' => $assignment->instructions,
            'kind' => $assignment->kind->value,
            'deliverable_type' => $assignment->deliverable_type->value,
            'is_enabled' => (bool) $assignment->is_enabled,
            'position' => (int) $assignment->position,
            'rubric' => $assignment->rubricItems->map(fn ($item) => $this->assignmentRubricPayload($item))->values()->all(),
        ];
    }

    /** @return array<string,mixed> */
    private function assignmentRubricPayload(CourseAssignmentRubricItem $item): array
    {
        return ['id' => $item->id, 'criterion' => $item->criterion, 'description' => $item->description, 'max_points' => (int) $item->max_points, 'position' => (int) $item->position];
    }

    /** @return array<string,mixed> */
    private function assignmentDefinitionInput(CourseAssignment $assignment): array
    {
        $assignment->loadMissing('rubricItems');
        return [
            'module_id' => $assignment->module_id,
            'lesson_id' => $assignment->lesson_id,
            'title' => $assignment->title,
            'instructions' => $assignment->instructions,
            'kind' => $assignment->kind->value,
            'deliverable_type' => $assignment->deliverable_type->value,
            'is_enabled' => (bool) $assignment->is_enabled,
            'rubric' => $assignment->rubricItems->map(fn ($item) => ['criterion' => $item->criterion, 'description' => $item->description, 'max_points' => (int) $item->max_points])->values()->all(),
        ];
    }

    private function ownedAssessment(User $user, int $id): CourseAssessment
    {
        return CourseAssessment::query()->whereHas('course', fn ($q) => $q->where('trainer_id', $user->id))->find($id)
            ?? throw new AuthorizationException('Assessment not found or not owned by this MCP user.');
    }

    private function ownedAssessmentQuestion(User $user, int $id): CourseAssessmentQuestion
    {
        return CourseAssessmentQuestion::query()->whereHas('assessment.course', fn ($q) => $q->where('trainer_id', $user->id))->find($id)
            ?? throw new AuthorizationException('Assessment question not found or not owned by this MCP user.');
    }

    private function ownedOffer(User $user, int $id): CourseOffer
    {
        return CourseOffer::query()->whereHas('course', fn ($q) => $q->where('trainer_id', $user->id))->find($id)
            ?? throw new AuthorizationException('Offer not found or not owned by this MCP user.');
    }

    private function ownedOrder(User $user, int $id): AcademyOrder
    {
        return AcademyOrder::query()->where('trainer_id', $user->id)->find($id)
            ?? throw new AuthorizationException('Order not found or not owned by this MCP user.');
    }

    private function ownedCourse(User $user, int $id): Course
    {
        return $user->courses()->find($id) ?? throw new AuthorizationException('Course not found or not owned by this MCP user.');
    }

    private function ownedModule(User $user, int $id): Module
    {
        return Module::query()->whereHas('course', fn ($q) => $q->where('trainer_id', $user->id))->find($id)
            ?? throw new AuthorizationException('Module not found or not owned by this MCP user.');
    }

    private function ownedLesson(User $user, int $id): Lesson
    {
        return Lesson::query()->whereHas('module.course', fn ($q) => $q->where('trainer_id', $user->id))->find($id)
            ?? throw new AuthorizationException('Lesson not found or not owned by this MCP user.');
    }

    /** @return \Illuminate\Support\Collection<int, int> */
    private function courseIds(User $user)
    {
        return $user->courses()->pluck('id');
    }

    /** @return array<int, array{currency:string,amount:float,sales:int}> */
    private function revenueByCurrency($sales): array
    {
        return $sales->groupBy(fn (Enrollment $sale) => $sale->currency ?: 'N/A')->map(fn ($group, $currency) => [
            'currency' => $currency,
            'amount' => round((float) $group->sum(fn (Enrollment $sale) => (float) $sale->amount_paid), 2),
            'sales' => $group->count(),
        ])->values()->all();
    }

    /** @return array<string, mixed> */
    private function coursePayload(Course $course, bool $expanded = false): array
    {
        $payload = [
            'id' => $course->id, 'categoryId' => $course->category_id, 'title' => $course->title,
            'status' => $course->status->value, 'description' => $course->description, 'targetAudience' => $course->target_audience,
            'level' => $course->level, 'language' => $course->language, 'positioning' => $course->positioning,
            'benefits' => $course->benefits ?? [], 'objectives' => $course->objectives ?? [], 'prerequisites' => $course->prerequisites ?? [],
            'cover' => $course->image, 'thumbnail' => $course->thumbnail, 'price' => (float) $course->price, 'duration' => (int) $course->duration,
        ];
        if ($expanded) {
            $payload['modules'] = $course->modules->map(fn (Module $module) => $this->modulePayload($module))->values()->all();
            $payload['offers'] = $course->offers->map(fn (CourseOffer $offer) => $this->offerPayload($offer))->values()->all();
        }
        return $payload;
    }

    /** @return array<string, mixed> */
    private function modulePayload(Module $module): array
    {
        return [
            'id'=>$module->id,'courseId'=>$module->course_id,'title'=>$module->title,'description'=>$module->description,
            'objectives'=>$module->objectives ?? [],'duration'=>(int)$module->duration,'minimumAccessRank'=>(int)$module->minimum_access_rank,
            'order'=>(int)$module->order,'lessonsCount'=>(int)($module->lessons_count ?? $module->lessons()->count()),
        ];
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function normalizeLessonMediaInput(array $data, ?Lesson $lesson = null): array
    {
        $type = (string) ($data['type'] ?? $lesson?->type?->value ?? LessonType::Text->value);

        if ($type !== LessonType::VideoUrl->value) {
            $data['video_url'] = null;
        }
        if ($type !== LessonType::Pdf->value) {
            $data['pdf_url'] = null;
        }

        // audio_url may coexist with text/video/pdf as optional narration.
        return $data;
    }

    /** @return array<string, mixed> */
    private function lessonPayload(Lesson $lesson): array
    {
        return [
            'id'=>$lesson->id,'moduleId'=>$lesson->module_id,'title'=>$lesson->title,'content'=>$lesson->content,'transcript'=>$lesson->transcript,
            'duration'=>(int)$lesson->duration,'isFree'=>(bool)$lesson->is_free,'type'=>$lesson->type->value,
            'videoUrl'=>$lesson->video_url,'audioUrl'=>$lesson->audio_url,'pdfUrl'=>$lesson->pdf_url,'order'=>(int)$lesson->order,
        ];
    }

    /** @return array<string, mixed> */
    private function assessmentPayload(CourseAssessment $assessment): array
    {
        $assessment->loadMissing('questions.options');
        return [
            'id' => $assessment->id, 'courseId' => $assessment->course_id, 'moduleId' => $assessment->module_id, 'lessonId' => $assessment->lesson_id,
            'title' => $assessment->title, 'description' => $assessment->description, 'kind' => $assessment->kind->value,
            'passingScorePercent' => (int) $assessment->passing_score_percent, 'maxAttempts' => $assessment->max_attempts,
            'shuffleQuestions' => (bool) $assessment->shuffle_questions, 'shuffleOptions' => (bool) $assessment->shuffle_options,
            'showExplanations' => (bool) $assessment->show_explanations, 'isEnabled' => (bool) $assessment->is_enabled,
            'questions' => $assessment->questions->map(fn (CourseAssessmentQuestion $question) => $this->assessmentQuestionPayload($question))->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    private function assessmentQuestionPayload(CourseAssessmentQuestion $question): array
    {
        $question->loadMissing('options');
        return [
            'id' => $question->id, 'type' => $question->type->value, 'prompt' => $question->prompt,
            'explanation' => $question->explanation, 'points' => (int) $question->points, 'position' => (int) $question->position,
            'options' => $question->options->map(fn ($option) => ['id' => $option->id, 'text' => $option->text, 'isCorrect' => (bool) $option->is_correct, 'position' => (int) $option->position])->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    private function assessmentDefinitionInput(CourseAssessment $assessment): array
    {
        $assessment->loadMissing('questions.options');
        return [
            'module_id' => $assessment->module_id, 'lesson_id' => $assessment->lesson_id, 'title' => $assessment->title,
            'description' => $assessment->description, 'kind' => $assessment->kind->value,
            'passing_score_percent' => (int) $assessment->passing_score_percent, 'max_attempts' => $assessment->max_attempts,
            'shuffle_questions' => (bool) $assessment->shuffle_questions, 'shuffle_options' => (bool) $assessment->shuffle_options,
            'show_explanations' => (bool) $assessment->show_explanations, 'is_enabled' => (bool) $assessment->is_enabled,
            'questions' => $assessment->questions->map(fn (CourseAssessmentQuestion $question) => [
                'type' => $question->type->value, 'prompt' => $question->prompt, 'explanation' => $question->explanation,
                'points' => (int) $question->points,
                'options' => $question->options->map(fn ($option) => ['text' => $option->text, 'is_correct' => (bool) $option->is_correct])->values()->all(),
            ])->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    private function offerPayload(CourseOffer $offer): array
    {
        return [
            'id'=>$offer->id,'courseId'=>$offer->course_id,'name'=>$offer->name,'slug'=>$offer->slug,'billingType'=>$offer->billing_type,
            'amount'=>(int)$offer->amount,'currency'=>$offer->currency,'interval'=>$offer->interval,'accessRank'=>(int)$offer->access_rank,
            'trialDays'=>(int)$offer->trial_days,'isDefault'=>(bool)$offer->is_default,'isActive'=>(bool)$offer->is_active,
        ];
    }

    /** @param array<string, mixed> $arguments @return array<string, mixed> */
    private function validate(string $tool, array $arguments): array
    {
        $rules = match ($tool) {
            'academy.summary', 'analytics.summary', 'sales.summary', 'students.risk.summary', 'ai.usage.summary' => [],
            'categories.list' => ['limit'=>['nullable','integer','min:1','max:200']],
            'memberships.list' => ['course_id' => ['nullable','integer'], 'status' => ['nullable','in:active,trialing,canceled,past_due,unpaid'], 'limit' => ['nullable','integer','min:1','max:100']],
            'offers.list' => ['course_id'=>['required','integer']],
            'offers.update' => ['offer_id'=>['required','integer'],'name'=>['sometimes','string','min:2','max:120'],'amount'=>['sometimes','integer','min:0'],'currency'=>['sometimes','string','size:3'],'access_rank'=>['sometimes','integer','min:0','max:1000'],'trial_days'=>['sometimes','integer','min:0','max:365'],'is_default'=>['sometimes','boolean'],'is_active'=>['sometimes','boolean']],
            'offers.deactivate' => ['offer_id'=>['required','integer']],
            'pages.list' => ['status'=>['nullable','in:draft,published'],'limit'=>['nullable','integer','min:1','max:100']],
            'pages.create' => ['course_id'=>['required','integer'],'title'=>['required','string','min:3','max:255'],'headline'=>['required','string','max:500'],'subheadline'=>['nullable','string','max:2000'],'cta_label'=>['nullable','string','max:120'],'meta_description'=>['nullable','string','max:1000']],
            'course.cover.generate', 'course.thumbnail.generate' => ['course_id'=>['required','integer'],'prompt'=>['required','string','min:3','max:4000']],
            'lesson.audio.generate' => ['lesson_id'=>['required','integer'],'voice'=>['nullable','string','max:80'],'instructions'=>['nullable','string','max:1000']],
            'offers.create' => ['course_id'=>['required','integer'],'name'=>['required','string','min:2','max:120'],'billing_type'=>['required','in:free,one_time,subscription'],'amount'=>['required','integer','min:0'],'currency'=>['required','string','size:3'],'interval'=>['nullable','in:month,year'],'access_rank'=>['required','integer','min:0','max:1000'],'trial_days'=>['nullable','integer','min:0','max:365']],
            'coupons.create' => ['course_id'=>['nullable','integer'],'code'=>['required','string','min:2','max:64'],'discount_type'=>['required','in:percent,fixed'],'discount_value'=>['required','integer','min:1'],'currency'=>['nullable','string','size:3'],'max_redemptions'=>['nullable','integer','min:1']],
            'affiliates.create' => ['name'=>['required','string','min:2','max:120'],'email'=>['nullable','email','max:255'],'code'=>['nullable','string','min:2','max:64'],'commission_bps'=>['nullable','integer','min:0','max:10000']],
            'sales.refund' => ['order_id'=>['required','integer'],'amount'=>['required','integer','min:1'],'reason'=>['nullable','string','max:500']],
            'courses.list' => ['status' => ['nullable', 'in:draft,published,archived'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100']],
            'courses.get' => ['course_id'=>['required','integer']],
            'courses.create' => ['category_id'=>['required','integer','exists:categories,id'],'title'=>['required','string','min:3','max:255'],'description'=>['required','string','min:10','max:60000'],'target_audience'=>['nullable','string','max:12000'],'level'=>['nullable','in:beginner,intermediate,advanced,all_levels'],'language'=>['nullable','string','min:2','max:16'],'positioning'=>['nullable','array'],'benefits'=>['nullable','array'],'objectives'=>['nullable','array'],'prerequisites'=>['nullable','array'],'price'=>['nullable','numeric','min:0'],'duration'=>['nullable','integer','min:1']],
            'courses.update' => ['course_id'=>['required','integer'],'category_id'=>['sometimes','integer','exists:categories,id'],'title'=>['sometimes','string','min:3','max:255'],'description'=>['sometimes','string','min:10','max:60000'],'target_audience'=>['sometimes','nullable','string','max:12000'],'level'=>['sometimes','in:beginner,intermediate,advanced,all_levels'],'language'=>['sometimes','string','min:2','max:16'],'positioning'=>['sometimes','nullable','array'],'benefits'=>['sometimes','array'],'objectives'=>['sometimes','array'],'prerequisites'=>['sometimes','array'],'price'=>['sometimes','numeric','min:0'],'duration'=>['sometimes','integer','min:1'],'image'=>['sometimes','nullable','string','max:2048'],'thumbnail'=>['sometimes','nullable','string','max:2048']],
            'courses.publish', 'courses.unpublish', 'courses.archive' => ['course_id' => ['required', 'integer']],
            'modules.list'=>['course_id'=>['required','integer']],
            'modules.create'=>['course_id'=>['required','integer'],'title'=>['required','string','min:2','max:255'],'description'=>['nullable','string','max:12000'],'objectives'=>['nullable','array'],'duration'=>['nullable','integer','min:1'],'minimum_access_rank'=>['nullable','integer','min:0','max:1000']],
            'modules.update'=>['module_id'=>['required','integer'],'title'=>['sometimes','string','min:2','max:255'],'description'=>['sometimes','nullable','string','max:12000'],'objectives'=>['sometimes','array'],'duration'=>['sometimes','integer','min:1'],'minimum_access_rank'=>['sometimes','integer','min:0','max:1000']],
            'modules.delete'=>['module_id'=>['required','integer']],
            'modules.reorder'=>['course_id'=>['required','integer'],'module_ids'=>['required','array','min:1'],'module_ids.*'=>['integer']],
            'lessons.list'=>['module_id'=>['required','integer']],
            'lessons.create'=>['module_id'=>['required','integer'],'title'=>['required','string','min:2','max:255'],'content'=>['nullable','string','max:30000'],'transcript'=>['nullable','string','max:60000'],'duration'=>['nullable','integer','min:1'],'is_free'=>['nullable','boolean'],'type'=>['nullable','in:text,video_url,audio,pdf'],'video_url'=>['nullable','string','max:2048'],'audio_url'=>['nullable','string','max:2048'],'pdf_url'=>['nullable','string','max:2048']],
            'lessons.update'=>['lesson_id'=>['required','integer'],'title'=>['sometimes','string','min:2','max:255'],'content'=>['sometimes','nullable','string','max:30000'],'transcript'=>['sometimes','nullable','string','max:60000'],'duration'=>['sometimes','integer','min:1'],'is_free'=>['sometimes','boolean'],'type'=>['sometimes','in:text,video_url,audio,pdf'],'video_url'=>['sometimes','nullable','string','max:2048'],'audio_url'=>['sometimes','nullable','string','max:2048'],'pdf_url'=>['sometimes','nullable','string','max:2048']],
            'lessons.delete'=>['lesson_id'=>['required','integer']],
            'lessons.reorder'=>['module_id'=>['required','integer'],'lesson_ids'=>['required','array','min:1'],'lesson_ids.*'=>['integer']],
            'assessments.list' => ['course_id'=>['required','integer']],
            'assessments.get', 'assessments.delete' => ['assessment_id'=>['required','integer']],
            'assessments.create' => ['course_id'=>['required','integer'],'module_id'=>['nullable','integer'],'lesson_id'=>['nullable','integer'],'title'=>['required','string','min:2','max:255'],'description'=>['nullable','string','max:12000'],'kind'=>['required','in:quiz,assessment'],'passing_score_percent'=>['required','integer','min:0','max:100'],'max_attempts'=>['nullable','integer','min:1','max:100'],'shuffle_questions'=>['nullable','boolean'],'shuffle_options'=>['nullable','boolean'],'show_explanations'=>['nullable','boolean'],'is_enabled'=>['nullable','boolean'],'questions'=>['required','array','min:1']],
            'assessments.update' => ['assessment_id'=>['required','integer'],'module_id'=>['sometimes','nullable','integer'],'lesson_id'=>['sometimes','nullable','integer'],'title'=>['sometimes','string','min:2','max:255'],'description'=>['sometimes','nullable','string','max:12000'],'kind'=>['sometimes','in:quiz,assessment'],'passing_score_percent'=>['sometimes','integer','min:0','max:100'],'max_attempts'=>['sometimes','nullable','integer','min:1','max:100'],'shuffle_questions'=>['sometimes','boolean'],'shuffle_options'=>['sometimes','boolean'],'show_explanations'=>['sometimes','boolean'],'is_enabled'=>['sometimes','boolean'],'questions'=>['sometimes','array','min:1']],
            'assessment.questions.create' => ['assessment_id'=>['required','integer'],'type'=>['required','in:single_choice,multiple_choice,true_false'],'prompt'=>['required','string','min:2','max:12000'],'explanation'=>['nullable','string','max:12000'],'points'=>['required','integer','min:1','max:100'],'options'=>['required','array','min:2','max:20']],
            'assessment.questions.update' => ['question_id'=>['required','integer'],'type'=>['sometimes','in:single_choice,multiple_choice,true_false'],'prompt'=>['sometimes','string','min:2','max:12000'],'explanation'=>['sometimes','nullable','string','max:12000'],'points'=>['sometimes','integer','min:1','max:100'],'options'=>['sometimes','array','min:2','max:20']],
            'assessment.questions.delete' => ['question_id'=>['required','integer']],
            'assessment.questions.reorder' => ['assessment_id'=>['required','integer'],'question_ids'=>['required','array','min:1'],'question_ids.*'=>['integer']],
            'assignments.list' => ['course_id'=>['required','integer']],
            'assignments.get', 'assignments.delete' => ['assignment_id'=>['required','integer']],
            'assignments.create' => ['course_id'=>['required','integer'],'module_id'=>['nullable','integer'],'lesson_id'=>['nullable','integer'],'title'=>['required','string','min:2','max:255'],'instructions'=>['required','string','min:5','max:60000'],'kind'=>['required','in:assignment,project'],'deliverable_type'=>['required','in:text,link,file,mixed'],'is_enabled'=>['nullable','boolean'],'rubric'=>['required','array','min:1','max:20']],
            'assignments.update' => ['assignment_id'=>['required','integer'],'module_id'=>['sometimes','nullable','integer'],'lesson_id'=>['sometimes','nullable','integer'],'title'=>['sometimes','string','min:2','max:255'],'instructions'=>['sometimes','string','min:5','max:60000'],'kind'=>['sometimes','in:assignment,project'],'deliverable_type'=>['sometimes','in:text,link,file,mixed'],'is_enabled'=>['sometimes','boolean'],'rubric'=>['sometimes','array','min:1','max:20']],
            'assignment.rubric.create' => ['assignment_id'=>['required','integer'],'criterion'=>['required','string','max:255'],'description'=>['nullable','string','max:5000'],'max_points'=>['required','integer','min:1','max:1000']],
            'assignment.rubric.update' => ['rubric_id'=>['required','integer'],'criterion'=>['sometimes','string','max:255'],'description'=>['sometimes','nullable','string','max:5000'],'max_points'=>['sometimes','integer','min:1','max:1000']],
            'assignment.rubric.delete' => ['rubric_id'=>['required','integer']],
            'assignment.rubric.reorder' => ['assignment_id'=>['required','integer'],'rubric_ids'=>['required','array','min:1'],'rubric_ids.*'=>['integer']],
            'learning.access.rules.list' => ['course_id'=>['required','integer']],
            'learning.access.rules.create' => ['course_id'=>['required','integer'],'target_type'=>['required','in:module,lesson,assessment,assignment'],'target_id'=>['required','integer','min:1'],'rule_type'=>['required','in:enrollment_delay_days,fixed_datetime,module_completed,lesson_completed,assessment_passed,assignment_approved'],'source_id'=>['nullable','integer','min:1'],'delay_days'=>['nullable','integer','min:0','max:3650'],'available_at'=>['nullable','date'],'is_enabled'=>['nullable','boolean'],'position'=>['nullable','integer','min:0']],
            'learning.access.rules.update' => ['unlock_rule_id'=>['required','integer'],'target_type'=>['sometimes','in:module,lesson,assessment,assignment'],'target_id'=>['sometimes','integer','min:1'],'rule_type'=>['sometimes','in:enrollment_delay_days,fixed_datetime,module_completed,lesson_completed,assessment_passed,assignment_approved'],'source_id'=>['sometimes','nullable','integer','min:1'],'delay_days'=>['sometimes','nullable','integer','min:0','max:3650'],'available_at'=>['sometimes','nullable','date'],'is_enabled'=>['sometimes','boolean'],'position'=>['sometimes','integer','min:0']],
            'learning.access.rules.delete' => ['unlock_rule_id'=>['required','integer']],
            'completion.policy.get' => ['course_id'=>['required','integer']],
            'completion.policy.update' => ['course_id'=>['required','integer'],'require_all_accessible_lessons'=>['sometimes','boolean'],'certificate_enabled'=>['sometimes','boolean'],'certificate_title'=>['sometimes','nullable','string','max:160'],'issuer_name'=>['sometimes','nullable','string','max:160'],'assessment_required_ids'=>['sometimes','array'],'assessment_required_ids.*'=>['integer'],'assignment_required_ids'=>['sometimes','array'],'assignment_required_ids.*'=>['integer']],
            'certificates.list' => ['course_id'=>['required','integer'],'limit'=>['nullable','integer','min:1','max:100']],
            'certificates.get' => ['certificate_id'=>['required','integer']],
            'certificates.revoke' => ['certificate_id'=>['required','integer'],'reason'=>['required','string','min:5','max:500']],
            'students.search' => ['query' => ['nullable', 'string', 'max:120'], 'course_id' => ['nullable', 'integer'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100']],
            'students.segment' => ['course_id' => ['required', 'integer']],
            'analytics.learning' => ['course_id' => ['nullable', 'integer']],
            'events.list' => ['limit' => ['nullable', 'integer', 'min:1', 'max:100']],
            'events.create' => ['title' => ['required', 'string', 'min:4', 'max:180'], 'description' => ['required', 'string', 'min:10', 'max:12000'], 'starts_at' => ['required', 'date'], 'ends_at' => ['required', 'date'], 'timezone' => ['required', 'timezone'], 'meeting_url' => ['nullable', 'url:http,https', 'max:2048'], 'location' => ['nullable', 'string', 'max:255'], 'capacity' => ['nullable', 'integer', 'min:1', 'max:100000'], 'reminder_minutes' => ['nullable', 'integer', 'min:0', 'max:10080']],
            'community.posts.list' => ['space_id' => ['nullable', 'integer', 'exists:community_spaces,id'], 'query' => ['nullable', 'string', 'max:120'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100']],
            'learning.progress.get' => ['course_id' => ['required', 'integer']],
            'course.knowledge.search' => ['course_id' => ['required', 'integer'], 'query' => ['required', 'string', 'min:2', 'max:1000'], 'limit' => ['nullable', 'integer', 'min:1', 'max:10']],
            'lesson.get' => ['lesson_id' => ['required', 'integer']],
            'tutor.quiz.generate' => ['course_id' => ['required', 'integer'], 'lesson_id' => ['nullable', 'integer'], 'prompt' => ['nullable', 'string', 'max:2000']],
            default => throw new RuntimeException("Unsupported Academy MCP tool: {$tool}"),
        };

        return Validator::make($arguments, $rules)->validate();
    }
}
