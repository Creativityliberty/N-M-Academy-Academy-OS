<?php

declare(strict_types=1);

namespace App\AI;

use App\AI\Capabilities\AnalyzeStudentsCapability;
use App\AI\Capabilities\AskAcademyCapability;
use App\AI\Capabilities\GenerateCourseCapability;
use App\AI\Capabilities\GenerateAssessmentCapability;
use App\AI\Capabilities\GenerateAssignmentCapability;
use App\AI\Capabilities\GenerateCurriculumCapability;
use App\AI\Capabilities\GenerateLessonsCapability;
use App\AI\Capabilities\RewriteLessonCapability;
use App\AI\Capabilities\RewriteCoursePositioningCapability;
use App\AI\Capabilities\RewriteModuleCapability;
use App\AI\Capabilities\GeneratePageCapability;
use App\AI\Capabilities\OptimizePageCapability;
use InvalidArgumentException;

class AcademyAiCapabilityRegistry
{
    /** @var array<string, AcademyAiCapability> */
    private array $capabilities;

    public function __construct(
        AskAcademyCapability $ask,
        GenerateCourseCapability $course,
        GenerateAssessmentCapability $assessment,
        GenerateAssignmentCapability $assignment,
        GenerateCurriculumCapability $curriculum,
        GenerateLessonsCapability $lessons,
        RewriteLessonCapability $rewrite,
        AnalyzeStudentsCapability $analysis,
        GeneratePageCapability $pageGenerate,
        OptimizePageCapability $pageOptimize,
        RewriteCoursePositioningCapability $coursePositioning,
        RewriteModuleCapability $moduleRewrite,
    ) {
        $this->capabilities = [
            'academy.ask' => $ask,
            'course.generate' => $course,
            'assessment.generate' => $assessment,
            'assignment.generate' => $assignment,
            'curriculum.generate' => $curriculum,
            'lessons.generate' => $lessons,
            'lesson.rewrite' => $rewrite,
            'students.analyze' => $analysis,
            'page.generate' => $pageGenerate,
            'page.optimize' => $pageOptimize,
            'course.positioning.rewrite' => $coursePositioning,
            'module.rewrite' => $moduleRewrite,
        ];
    }

    public function get(string $name): AcademyAiCapability
    {
        return $this->capabilities[$name]
            ?? throw new InvalidArgumentException("Capability Academy AI inconnue : {$name}");
    }

    /** @return array<int, array{name: string, label: string, mode: string, risk: string, canApply: bool}> */
    public function metadata(): array
    {
        return collect($this->capabilities)->map(fn (AcademyAiCapability $capability) => [
            'name' => $capability->name(),
            'label' => $capability->label(),
            'mode' => $capability->mode(),
            'risk' => $capability->risk(),
            'canApply' => $capability->canApply(),
        ])->values()->all();
    }
}
