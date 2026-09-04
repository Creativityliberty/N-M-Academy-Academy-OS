<?php

declare(strict_types=1);

use App\Enums\AssignmentSubmissionStatus;
use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\CourseOffer;
use App\Models\Enrollment;
use App\Models\Module;
use App\Models\User;
use App\Services\Assignments\AssignmentDefinitionService;
use App\Services\Assignments\AssignmentReviewService;
use App\Services\Assignments\AssignmentSubmissionService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

it('stores private versioned submissions and allows a revision after changes requested', function () {
    Storage::fake('assignments');
    $trainer = User::factory()->create();
    $student = User::factory()->create();
    $course = Course::factory()->create(['trainer_id'=>$trainer->id,'status'=>CourseStatus::Published]);
    $module = Module::factory()->create(['course_id'=>$course->id,'minimum_access_rank'=>0]);
    Enrollment::create(['user_id'=>$student->id,'course_id'=>$course->id,'access_rank'=>0,'enrolled_at'=>now()]);
    $assignment = app(AssignmentDefinitionService::class)->create($course, ['title'=>'Projet','instructions'=>'Livrer le projet','kind'=>'project','deliverable_type'=>'file','module_id'=>$module->id,'rubric'=>[['criterion'=>'Qualité','description'=>'','max_points'=>10]]]);
    $first = app(AssignmentSubmissionService::class)->submit($student, $assignment, [], [UploadedFile::fake()->create('v1.pdf', 10, 'application/pdf')]);
    expect($first->version)->toBe(1)->and(Storage::disk('assignments')->exists($first->files->first()->path))->toBeTrue();
    app(AssignmentReviewService::class)->review($trainer, $first, ['decision'=>'changes_requested','feedback'=>'Corrigez la conclusion','rubric_scores'=>[(string)$assignment->rubricItems->first()->id=>5]]);
    $second = app(AssignmentSubmissionService::class)->submit($student, $assignment, [], [UploadedFile::fake()->create('v2.pdf', 10, 'application/pdf')]);
    expect($second->version)->toBe(2)->and($first->fresh()->status)->toBe(AssignmentSubmissionStatus::ChangesRequested);
});

it('locks the authored definition once student history exists', function () {
    Storage::fake('assignments');
    $trainer=User::factory()->create(); $student=User::factory()->create();
    $course=Course::factory()->create(['trainer_id'=>$trainer->id,'status'=>CourseStatus::Published]);
    Enrollment::create(['user_id'=>$student->id,'course_id'=>$course->id,'access_rank'=>0,'enrolled_at'=>now()]);
    $assignment=app(AssignmentDefinitionService::class)->create($course,['title'=>'A','instructions'=>'I','kind'=>'assignment','deliverable_type'=>'text','rubric'=>[['criterion'=>'C','max_points'=>10]]]);
    app(AssignmentSubmissionService::class)->submit($student,$assignment,['text_content'=>'Mon travail']);
    expect(fn()=>app(AssignmentDefinitionService::class)->delete($assignment))->toThrow(ValidationException::class);
});
