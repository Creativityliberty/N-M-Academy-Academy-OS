<?php

declare(strict_types=1);

namespace App\Mcp;

use App\Models\User;
use InvalidArgumentException;

class AcademyMcpToolRegistry
{
    public const READ = 'read';
    public const WRITE = 'write';
    public const SENSITIVE = 'sensitive';

    /** @return array<string, array<string, mixed>> */
    public function all(): array
    {
        return [
            'academy.summary' => $this->tool('Academy summary', 'High-level Academy business summary.', self::READ, [], []),
            'categories.list' => $this->tool('List categories', 'List available course categories so agents never invent category IDs.', self::READ, [
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 200, 'default' => 100],
            ], []),
            'courses.list' => $this->tool('List courses', 'List the authenticated creator courses.', self::READ, [
                'status' => ['type' => 'string', 'enum' => ['draft', 'published', 'archived']],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 25],
            ], []),
            'courses.get' => $this->tool('Get course', 'Return one owned course with positioning, curriculum summary and media slots.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'courses.create' => $this->tool('Create course', 'Create a new canonical draft course.', self::WRITE, [
                'category_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 255],
                'description' => ['type' => 'string', 'minLength' => 10, 'maxLength' => 60000],
                'target_audience' => ['type' => 'string', 'maxLength' => 12000],
                'level' => ['type' => 'string', 'enum' => ['beginner','intermediate','advanced','all_levels']],
                'language' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 16],
                'positioning' => ['type' => 'object', 'properties' => [
                    'main_problem' => ['type' => 'string', 'maxLength' => 12000],
                    'desired_transformation' => ['type' => 'string', 'maxLength' => 12000],
                    'main_promise' => ['type' => 'string', 'maxLength' => 12000],
                    'unique_angle' => ['type' => 'string', 'maxLength' => 12000],
                ], 'additionalProperties' => false],
                'benefits' => ['type' => 'array', 'items' => ['type' => 'string']],
                'objectives' => ['type' => 'array', 'items' => ['type' => 'object']],
                'prerequisites' => ['type' => 'array', 'items' => ['type' => 'string']],
                'price' => ['type' => 'number', 'minimum' => 0],
                'duration' => ['type' => 'integer', 'minimum' => 1],
            ], ['category_id', 'title', 'description']),
            'courses.update' => $this->tool('Update course', 'Update canonical mutable course fields without publishing it.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'category_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 255],
                'description' => ['type' => 'string', 'minLength' => 10, 'maxLength' => 60000],
                'target_audience' => ['type' => 'string', 'maxLength' => 12000],
                'level' => ['type' => 'string', 'enum' => ['beginner','intermediate','advanced','all_levels']],
                'language' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 16],
                'positioning' => ['type' => 'object', 'additionalProperties' => true],
                'benefits' => ['type' => 'array', 'items' => ['type' => 'string']],
                'objectives' => ['type' => 'array', 'items' => ['type' => 'object']],
                'prerequisites' => ['type' => 'array', 'items' => ['type' => 'string']],
                'price' => ['type' => 'number', 'minimum' => 0],
                'duration' => ['type' => 'integer', 'minimum' => 1],
                'image' => ['type' => 'string', 'maxLength' => 2048],
                'thumbnail' => ['type' => 'string', 'maxLength' => 2048],
            ], ['course_id'], destructive: true),
            'courses.publish' => $this->tool('Publish course', 'Publish a course and provision its Stripe catalog when required.', self::SENSITIVE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id'], destructive: false, openWorld: true),
            'courses.unpublish' => $this->tool('Unpublish course', 'Return a published course to draft without deleting it.', self::SENSITIVE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id'], destructive: true),
            'courses.archive' => $this->tool('Archive course', 'Archive a course while preserving its financial history.', self::SENSITIVE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id'], destructive: true, openWorld: true),
            'modules.list' => $this->tool('List modules', 'List modules for an owned course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'modules.create' => $this->tool('Create module', 'Create a module inside an owned course.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'description' => ['type' => 'string', 'maxLength' => 12000],
                'objectives' => ['type' => 'array', 'items' => ['type' => 'string']],
                'duration' => ['type' => 'integer', 'minimum' => 1],
                'minimum_access_rank' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 1000],
            ], ['course_id', 'title']),
            'modules.update' => $this->tool('Update module', 'Update an owned module.', self::WRITE, [
                'module_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'description' => ['type' => 'string', 'maxLength' => 12000],
                'objectives' => ['type' => 'array', 'items' => ['type' => 'string']],
                'duration' => ['type' => 'integer', 'minimum' => 1],
                'minimum_access_rank' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 1000],
            ], ['module_id'], destructive: true),
            'modules.delete' => $this->tool('Delete module', 'Delete an owned curriculum module and its lessons.', self::WRITE, [
                'module_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['module_id'], destructive: true),
            'modules.reorder' => $this->tool('Reorder modules', 'Set module ordering for an owned course.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'module_ids' => ['type' => 'array', 'items' => ['type' => 'integer'], 'minItems' => 1],
            ], ['course_id','module_ids']),
            'lessons.list' => $this->tool('List lessons', 'List lessons for an owned module.', self::READ, [
                'module_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['module_id']),
            'lessons.create' => $this->tool('Create lesson', 'Create a lesson inside an owned module.', self::WRITE, [
                'module_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'content' => ['type' => 'string', 'maxLength' => 30000],
                'transcript' => ['type' => 'string', 'maxLength' => 60000],
                'duration' => ['type' => 'integer', 'minimum' => 1],
                'is_free' => ['type' => 'boolean', 'default' => false],
                'type' => ['type' => 'string', 'enum' => ['text','video_url','audio','pdf']],
                'video_url' => ['type' => 'string', 'maxLength' => 2048],
                'audio_url' => ['type' => 'string', 'maxLength' => 2048],
                'pdf_url' => ['type' => 'string', 'maxLength' => 2048],
            ], ['module_id', 'title']),
            'lessons.update' => $this->tool('Update lesson', 'Update an owned lesson and its media references.', self::WRITE, [
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'content' => ['type' => 'string', 'maxLength' => 30000],
                'transcript' => ['type' => 'string', 'maxLength' => 60000],
                'duration' => ['type' => 'integer', 'minimum' => 1],
                'is_free' => ['type' => 'boolean'],
                'type' => ['type' => 'string', 'enum' => ['text','video_url','audio','pdf']],
                'video_url' => ['type' => 'string', 'maxLength' => 2048],
                'audio_url' => ['type' => 'string', 'maxLength' => 2048],
                'pdf_url' => ['type' => 'string', 'maxLength' => 2048],
            ], ['lesson_id'], destructive: true),
            'lessons.delete' => $this->tool('Delete lesson', 'Delete an owned lesson.', self::WRITE, [
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['lesson_id'], destructive: true),
            'lessons.reorder' => $this->tool('Reorder lessons', 'Set lesson ordering inside an owned module.', self::WRITE, [
                'module_id' => ['type' => 'integer', 'minimum' => 1],
                'lesson_ids' => ['type' => 'array', 'items' => ['type' => 'integer'], 'minItems' => 1],
            ], ['module_id','lesson_ids']),
            'assessments.list' => $this->tool('List assessments', 'List authored quizzes and assessments for an owned course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'assessments.get' => $this->tool('Get assessment', 'Return one authored assessment with questions and answer keys for the creator.', self::READ, [
                'assessment_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['assessment_id']),
            'assessments.create' => $this->tool('Create assessment', 'Create an authored auto-gradable assessment inside an owned course.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'module_id' => ['type' => 'integer', 'minimum' => 1],
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'description' => ['type' => 'string', 'maxLength' => 12000],
                'kind' => ['type' => 'string', 'enum' => ['quiz','assessment']],
                'passing_score_percent' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 100],
                'max_attempts' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100],
                'shuffle_questions' => ['type' => 'boolean'],
                'shuffle_options' => ['type' => 'boolean'],
                'show_explanations' => ['type' => 'boolean'],
                'is_enabled' => ['type' => 'boolean'],
                'questions' => ['type' => 'array', 'minItems' => 1, 'items' => ['type' => 'object', 'additionalProperties' => true]],
            ], ['course_id','title','kind','passing_score_percent','questions']),
            'assessments.update' => $this->tool('Update assessment', 'Update an owned authored assessment.', self::WRITE, [
                'assessment_id' => ['type' => 'integer', 'minimum' => 1],
                'module_id' => ['type' => ['integer','null'], 'minimum' => 1],
                'lesson_id' => ['type' => ['integer','null'], 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'description' => ['type' => ['string','null'], 'maxLength' => 12000],
                'kind' => ['type' => 'string', 'enum' => ['quiz','assessment']],
                'passing_score_percent' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 100],
                'max_attempts' => ['type' => ['integer','null'], 'minimum' => 1, 'maximum' => 100],
                'shuffle_questions' => ['type' => 'boolean'],
                'shuffle_options' => ['type' => 'boolean'],
                'show_explanations' => ['type' => 'boolean'],
                'is_enabled' => ['type' => 'boolean'],
                'questions' => ['type' => 'array', 'minItems' => 1, 'items' => ['type' => 'object', 'additionalProperties' => true]],
            ], ['assessment_id'], destructive: true),
            'assessments.delete' => $this->tool('Delete assessment', 'Delete an owned authored assessment.', self::WRITE, [
                'assessment_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['assessment_id'], destructive: true),
            'assessment.questions.create' => $this->tool('Create assessment question', 'Append one auto-gradable question to an owned assessment.', self::WRITE, [
                'assessment_id' => ['type' => 'integer', 'minimum' => 1],
                'type' => ['type' => 'string', 'enum' => ['single_choice','multiple_choice','true_false']],
                'prompt' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 12000],
                'explanation' => ['type' => 'string', 'maxLength' => 12000],
                'points' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100],
                'options' => ['type' => 'array', 'minItems' => 2, 'maxItems' => 20, 'items' => ['type' => 'object', 'properties' => ['text' => ['type' => 'string'], 'is_correct' => ['type' => 'boolean']], 'required' => ['text','is_correct'], 'additionalProperties' => false]],
            ], ['assessment_id','type','prompt','points','options']),
            'assessment.questions.update' => $this->tool('Update assessment question', 'Update one question and its options.', self::WRITE, [
                'question_id' => ['type' => 'integer', 'minimum' => 1],
                'type' => ['type' => 'string', 'enum' => ['single_choice','multiple_choice','true_false']],
                'prompt' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 12000],
                'explanation' => ['type' => ['string','null'], 'maxLength' => 12000],
                'points' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100],
                'options' => ['type' => 'array', 'minItems' => 2, 'maxItems' => 20, 'items' => ['type' => 'object', 'additionalProperties' => true]],
            ], ['question_id'], destructive: true),
            'assessment.questions.delete' => $this->tool('Delete assessment question', 'Delete one question from an owned assessment.', self::WRITE, [
                'question_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['question_id'], destructive: true),
            'assessment.questions.reorder' => $this->tool('Reorder assessment questions', 'Set question order for an owned assessment.', self::WRITE, [
                'assessment_id' => ['type' => 'integer', 'minimum' => 1],
                'question_ids' => ['type' => 'array', 'items' => ['type' => 'integer'], 'minItems' => 1],
            ], ['assessment_id','question_ids']),
            'assignments.list' => $this->tool('List assignments', 'List authored assignments/projects for an owned course. Student submissions are never returned.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'assignments.get' => $this->tool('Get assignment', 'Return one authored assignment definition and rubric. Student submissions are never returned.', self::READ, [
                'assignment_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['assignment_id']),
            'assignments.create' => $this->tool('Create assignment', 'Create an authored assignment/project definition. This never reviews student work.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'module_id' => ['type' => 'integer', 'minimum' => 1],
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 255],
                'instructions' => ['type' => 'string', 'minLength' => 5, 'maxLength' => 60000],
                'kind' => ['type' => 'string', 'enum' => ['assignment','project']],
                'deliverable_type' => ['type' => 'string', 'enum' => ['text','link','file','mixed']],
                'is_enabled' => ['type' => 'boolean'],
                'rubric' => ['type' => 'array', 'minItems' => 1, 'maxItems' => 20, 'items' => ['type' => 'object', 'additionalProperties' => true]],
            ], ['course_id','title','instructions','kind','deliverable_type','rubric']),
            'assignments.update' => $this->tool('Update assignment', 'Update an authored assignment definition before student history exists.', self::WRITE, [
                'assignment_id' => ['type' => 'integer', 'minimum' => 1],
                'module_id' => ['type' => ['integer','null'], 'minimum' => 1],
                'lesson_id' => ['type' => ['integer','null'], 'minimum' => 1],
                'title' => ['type' => 'string', 'maxLength' => 255],
                'instructions' => ['type' => 'string', 'maxLength' => 60000],
                'kind' => ['type' => 'string', 'enum' => ['assignment','project']],
                'deliverable_type' => ['type' => 'string', 'enum' => ['text','link','file','mixed']],
                'is_enabled' => ['type' => 'boolean'],
                'rubric' => ['type' => 'array', 'minItems' => 1, 'maxItems' => 20, 'items' => ['type' => 'object', 'additionalProperties' => true]],
            ], ['assignment_id'], destructive: true),
            'assignments.delete' => $this->tool('Delete assignment', 'Delete an authored assignment only when no student submission exists.', self::WRITE, [
                'assignment_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['assignment_id'], destructive: true),
            'assignment.rubric.create' => $this->tool('Create rubric item', 'Append a rubric criterion before student history exists.', self::WRITE, [
                'assignment_id' => ['type' => 'integer', 'minimum' => 1], 'criterion' => ['type' => 'string'], 'description' => ['type' => 'string'], 'max_points' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 1000],
            ], ['assignment_id','criterion','max_points']),
            'assignment.rubric.update' => $this->tool('Update rubric item', 'Update one rubric criterion before student history exists.', self::WRITE, [
                'rubric_id' => ['type' => 'integer', 'minimum' => 1], 'criterion' => ['type' => 'string'], 'description' => ['type' => ['string','null']], 'max_points' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 1000],
            ], ['rubric_id'], destructive: true),
            'assignment.rubric.delete' => $this->tool('Delete rubric item', 'Delete one rubric criterion before student history exists.', self::WRITE, [
                'rubric_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['rubric_id'], destructive: true),
            'assignment.rubric.reorder' => $this->tool('Reorder rubric', 'Set rubric criterion order before student history exists.', self::WRITE, [
                'assignment_id' => ['type' => 'integer', 'minimum' => 1], 'rubric_ids' => ['type' => 'array', 'items' => ['type' => 'integer'], 'minItems' => 1],
            ], ['assignment_id','rubric_ids']),
            'learning.access.rules.list' => $this->tool('List learning access rules', 'List drip and prerequisite rules for an owned course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'learning.access.rules.create' => $this->tool('Create learning access rule', 'Create one drip or prerequisite rule for a module, lesson, assessment or assignment.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'target_type' => ['type' => 'string', 'enum' => ['module','lesson','assessment','assignment']],
                'target_id' => ['type' => 'integer', 'minimum' => 1],
                'rule_type' => ['type' => 'string', 'enum' => ['enrollment_delay_days','fixed_datetime','module_completed','lesson_completed','assessment_passed','assignment_approved']],
                'source_id' => ['type' => ['integer','null'], 'minimum' => 1],
                'delay_days' => ['type' => ['integer','null'], 'minimum' => 0, 'maximum' => 3650],
                'available_at' => ['type' => ['string','null'], 'format' => 'date-time'],
                'is_enabled' => ['type' => 'boolean'],
                'position' => ['type' => 'integer', 'minimum' => 0],
            ], ['course_id','target_type','target_id','rule_type']),
            'learning.access.rules.update' => $this->tool('Update learning access rule', 'Update one owned drip or prerequisite rule.', self::WRITE, [
                'unlock_rule_id' => ['type' => 'integer', 'minimum' => 1],
                'target_type' => ['type' => 'string', 'enum' => ['module','lesson','assessment','assignment']],
                'target_id' => ['type' => 'integer', 'minimum' => 1],
                'rule_type' => ['type' => 'string', 'enum' => ['enrollment_delay_days','fixed_datetime','module_completed','lesson_completed','assessment_passed','assignment_approved']],
                'source_id' => ['type' => ['integer','null'], 'minimum' => 1],
                'delay_days' => ['type' => ['integer','null'], 'minimum' => 0, 'maximum' => 3650],
                'available_at' => ['type' => ['string','null'], 'format' => 'date-time'],
                'is_enabled' => ['type' => 'boolean'],
                'position' => ['type' => 'integer', 'minimum' => 0],
            ], ['unlock_rule_id'], destructive: true),
            'learning.access.rules.delete' => $this->tool('Delete learning access rule', 'Delete one owned drip or prerequisite rule.', self::WRITE, [
                'unlock_rule_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['unlock_rule_id'], destructive: true),
            'completion.policy.get' => $this->tool('Get completion policy', 'Read completion requirements for an owned course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'completion.policy.update' => $this->tool('Update completion policy', 'Configure lesson, assessment, assignment and certificate completion requirements for an owned course.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'require_all_accessible_lessons' => ['type' => 'boolean'],
                'certificate_enabled' => ['type' => 'boolean'],
                'certificate_title' => ['type' => ['string','null'], 'maxLength' => 160],
                'issuer_name' => ['type' => ['string','null'], 'maxLength' => 160],
                'assessment_required_ids' => ['type' => 'array', 'items' => ['type' => 'integer']],
                'assignment_required_ids' => ['type' => 'array', 'items' => ['type' => 'integer']],
            ], ['course_id'], destructive: true),
            'certificates.list' => $this->tool('List certificates', 'List completion certificates issued for an owned course. Recipient names are personal data.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 50],
            ], ['course_id']),
            'certificates.get' => $this->tool('Get certificate', 'Read one certificate issued by an owned course.', self::READ, [
                'certificate_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['certificate_id']),
            'certificates.revoke' => $this->tool('Revoke certificate', 'Revoke an issued certificate. This invalidates its public verification status and requires strong approval.', self::SENSITIVE, [
                'certificate_id' => ['type' => 'integer', 'minimum' => 1],
                'reason' => ['type' => 'string', 'minLength' => 5, 'maxLength' => 500],
            ], ['certificate_id','reason'], destructive: true, idempotent: false),
            'students.search' => $this->tool('Search students', 'Search students enrolled in the creator courses.', self::READ, [
                'query' => ['type' => 'string', 'maxLength' => 120],
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 25],
            ], []),
            'students.segment' => $this->tool('Segment students', 'Aggregate student progress into learning segments.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'students.risk.summary' => $this->tool('Student risk summary', 'Return aggregated inactive and not-started student risk without exposing student PII.', self::READ, [], []),
            'analytics.summary' => $this->tool('Analytics summary', 'Return creator-level course, student and completion metrics.', self::READ, [], []),
            'analytics.learning' => $this->tool('Learning analytics', 'Return per-course learning completion analytics.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], []),
            'events.list' => $this->tool('List events', 'List upcoming Academy events.', self::READ, [
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 25],
            ], []),
            'events.create' => $this->tool('Create event', 'Create and publish an Academy event.', self::WRITE, [
                'title' => ['type' => 'string', 'minLength' => 4, 'maxLength' => 180],
                'description' => ['type' => 'string', 'minLength' => 10, 'maxLength' => 12000],
                'starts_at' => ['type' => 'string', 'format' => 'date-time'],
                'ends_at' => ['type' => 'string', 'format' => 'date-time'],
                'timezone' => ['type' => 'string', 'maxLength' => 80],
                'meeting_url' => ['type' => 'string', 'format' => 'uri', 'maxLength' => 2048],
                'location' => ['type' => 'string', 'maxLength' => 255],
                'capacity' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100000],
                'reminder_minutes' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 10080, 'default' => 60],
            ], ['title', 'description', 'starts_at', 'ends_at', 'timezone']),
            'community.posts.list' => $this->tool('List community posts', 'List visible community posts and basic engagement counts.', self::READ, [
                'space_id' => ['type' => 'integer', 'minimum' => 1],
                'query' => ['type' => 'string', 'maxLength' => 120],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 25],
            ], []),
            'learning.progress.get' => $this->tool('Learning progress', 'Return the authenticated student progress for an enrolled course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'course.knowledge.search' => $this->tool('Search course knowledge', 'Search authorized Academy knowledge for an enrolled course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'query' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 1000],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 10, 'default' => 5],
            ], ['course_id', 'query']),
            'lesson.get' => $this->tool('Get lesson', 'Return lesson text only when the student is enrolled in its course.', self::READ, [
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['lesson_id']),
            'tutor.quiz.generate' => $this->tool('Generate tutor quiz', 'Generate a grounded quiz for an enrolled course or lesson.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
                'prompt' => ['type' => 'string', 'maxLength' => 2000],
            ], ['course_id']),
            'offers.list' => $this->tool('List sales offers', 'List offers for an owned course.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['course_id']),
            'offers.update' => $this->tool('Update sales offer', 'Update an owned inactive or active offer.', self::SENSITIVE, [
                'offer_id' => ['type' => 'integer', 'minimum' => 1],
                'name' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 120],
                'amount' => ['type' => 'integer', 'minimum' => 0],
                'currency' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 3],
                'access_rank' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 1000],
                'trial_days' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 365],
                'is_default' => ['type' => 'boolean'],
                'is_active' => ['type' => 'boolean'],
            ], ['offer_id'], destructive: true),
            'offers.deactivate' => $this->tool('Deactivate sales offer', 'Deactivate an owned sales offer without deleting ledger references.', self::WRITE, [
                'offer_id' => ['type' => 'integer', 'minimum' => 1],
            ], ['offer_id'], destructive: true),
            'pages.list' => $this->tool('List pages', 'List creator Academy pages.', self::READ, [
                'status' => ['type' => 'string', 'enum' => ['draft','published']],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 25],
            ], []),
            'pages.create' => $this->tool('Create landing page', 'Create a draft landing page using the existing safe Page Builder blocks.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'title' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 255],
                'headline' => ['type' => 'string', 'maxLength' => 500],
                'subheadline' => ['type' => 'string', 'maxLength' => 2000],
                'cta_label' => ['type' => 'string', 'maxLength' => 120],
                'meta_description' => ['type' => 'string', 'maxLength' => 1000],
            ], ['course_id','title','headline']),
            'course.cover.generate' => $this->tool('Generate course cover', 'Generate and attach a 16:9 course cover using the configured image provider.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'prompt' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 4000],
            ], ['course_id','prompt'], openWorld: true),
            'course.thumbnail.generate' => $this->tool('Generate course thumbnail', 'Generate and attach a square course thumbnail using the configured image provider.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'prompt' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 4000],
            ], ['course_id','prompt'], openWorld: true),
            'lesson.audio.generate' => $this->tool('Generate lesson narration', 'Generate and attach lesson narration from lesson text.', self::WRITE, [
                'lesson_id' => ['type' => 'integer', 'minimum' => 1],
                'voice' => ['type' => 'string', 'maxLength' => 80],
                'instructions' => ['type' => 'string', 'maxLength' => 1000],
            ], ['lesson_id'], openWorld: true),
            'offers.create' => $this->tool('Create sales offer', 'Create a free, one-time or subscription offer for an owned course.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'name' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 120],
                'billing_type' => ['type' => 'string', 'enum' => ['free','one_time','subscription']],
                'amount' => ['type' => 'integer', 'minimum' => 0],
                'currency' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 3],
                'interval' => ['type' => 'string', 'enum' => ['month','year']],
                'access_rank' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 1000],
                'trial_days' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 365],
            ], ['course_id','name','billing_type','amount','currency','access_rank']),
            'coupons.create' => $this->tool('Create coupon', 'Create an Academy coupon before Stripe fee calculation.', self::WRITE, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'code' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 64],
                'discount_type' => ['type' => 'string', 'enum' => ['percent','fixed']],
                'discount_value' => ['type' => 'integer', 'minimum' => 1],
                'currency' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 3],
                'max_redemptions' => ['type' => 'integer', 'minimum' => 1],
            ], ['code','discount_type','discount_value']),
            'affiliates.create' => $this->tool('Create affiliate', 'Create an affiliate attribution code and commission rate.', self::WRITE, [
                'name' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 120],
                'email' => ['type' => 'string', 'format' => 'email', 'maxLength' => 255],
                'code' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 64],
                'commission_bps' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 10000],
            ], ['name']),
            'memberships.list' => $this->tool('List memberships', 'List active and canceled paid course memberships.', self::READ, [
                'course_id' => ['type' => 'integer', 'minimum' => 1],
                'status' => ['type' => 'string', 'enum' => ['active','trialing','canceled','past_due','unpaid']],
                'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100, 'default' => 25],
            ], []),
            'sales.refund' => $this->tool('Refund order', 'Issue a full or partial Stripe refund and reverse the destination transfer/application fee.', self::SENSITIVE, [
                'order_id' => ['type' => 'integer', 'minimum' => 1],
                'amount' => ['type' => 'integer', 'minimum' => 1],
                'reason' => ['type' => 'string', 'maxLength' => 500],
            ], ['order_id','amount'], destructive: true, idempotent: false, openWorld: true),
            'sales.summary' => $this->tool('Sales summary', 'Return checkout conversion, revenue, refunds, MRR, churn and realized LTV from the commerce ledger.', self::READ, [], []),
            'ai.usage.summary' => $this->tool('AI usage summary', 'Return aggregated Academy AI and Tutor usage, provider mix, tokens and estimated Tutor cost.', self::READ, [], []),
        ];
    }

    /** @return array<string, mixed> */
    public function get(string $name): array
    {
        return $this->all()[$name] ?? throw new InvalidArgumentException("Unknown Academy MCP tool: {$name}");
    }


    public function allowedForUser(string $name, User $user): bool
    {
        $studentTools = ['learning.progress.get', 'course.knowledge.search', 'lesson.get', 'tutor.quiz.generate'];

        if (in_array($name, $studentTools, true)) {
            return $user->hasRole('student');
        }

        return $user->hasAnyRole(['trainer', 'admin', 'super-admin']);
    }

    /** @return array<int, array<string, mixed>> */
    public function mcpTools(): array
    {
        return collect($this->all())->map(function (array $tool, string $name): array {
            return [
                'name' => $name,
                'title' => $tool['title'],
                'description' => $tool['description'],
                'inputSchema' => $tool['inputSchema'],
                'outputSchema' => ['type' => 'object'],
                'annotations' => $tool['annotations'],
                '_meta' => [
                    'com.numtema.academy/risk' => $tool['risk'],
                    'com.numtema.academy/approvalRequired' => $tool['risk'] !== self::READ,
                    'com.numtema.academy/dataClass' => match ($name) {
                        'students.search' => 'personal',
                        'learning.progress.get' => 'personal',
                        'tutor.quiz.generate' => 'personal',
                        'certificates.list', 'certificates.get', 'certificates.revoke' => 'personal',
                        'sales.summary', 'offers.list', 'offers.create', 'offers.update', 'offers.deactivate', 'coupons.create', 'affiliates.create', 'memberships.list', 'sales.refund' => 'financial',
                        default => 'internal',
                    },
                    'com.numtema.academy/scope' => in_array($name, ['learning.progress.get', 'course.knowledge.search', 'lesson.get', 'tutor.quiz.generate'], true) ? 'student' : 'academy',
                ],
                'execution' => ['taskSupport' => 'forbidden'],
            ];
        })->values()->all();
    }

    /** @param array<string, array<string, mixed>> $properties @param array<int, string> $required */
    private function tool(
        string $title,
        string $description,
        string $risk,
        array $properties,
        array $required,
        bool $destructive = false,
        ?bool $idempotent = null,
        bool $openWorld = false,
    ): array {
        return [
            'title' => $title,
            'description' => $description,
            'risk' => $risk,
            'inputSchema' => [
                '$schema' => 'https://json-schema.org/draft/2020-12/schema',
                'type' => 'object',
                'properties' => $properties,
                'required' => $required,
                'additionalProperties' => false,
            ],
            'annotations' => [
                'title' => $title,
                'readOnlyHint' => $risk === self::READ,
                'destructiveHint' => $destructive,
                'idempotentHint' => $idempotent ?? $risk === self::READ,
                'openWorldHint' => $openWorld,
            ],
        ];
    }
}
