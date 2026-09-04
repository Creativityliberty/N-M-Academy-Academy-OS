<?php

declare(strict_types=1);
namespace App\Jobs;
use App\Models\Course;
use App\Tutor\KnowledgeIndexer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
class IndexCourseKnowledge implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public int $uniqueFor=60;
    public int $tries=3;
    public function __construct(public readonly int $courseId) {}
    public function uniqueId(): string { return (string)$this->courseId; }
    public function handle(KnowledgeIndexer $indexer): void
    {
        $course=Course::find($this->courseId);
        if ($course) $indexer->indexCourse($course);
    }
}
