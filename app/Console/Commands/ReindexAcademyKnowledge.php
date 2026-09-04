<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\IndexCourseKnowledge;
use App\Models\AcademyKnowledgeDocument;
use App\Models\Course;
use Illuminate\Console\Command;

class ReindexAcademyKnowledge extends Command
{
    protected $signature = 'academy:knowledge-reindex
        {--course= : Reindex one course id}
        {--missing : Only queue courses without indexed knowledge documents}
        {--sync : Run synchronously instead of queueing}';

    protected $description = 'Rebuild Academy Tutor knowledge for one course or all courses.';

    public function handle(): int
    {
        $query = Course::query();

        if ($this->option('course')) {
            $query->whereKey((int) $this->option('course'));
        }

        if ($this->option('missing')) {
            $indexedCourseIds = AcademyKnowledgeDocument::query()
                ->where('index_status', 'indexed')
                ->distinct()
                ->pluck('course_id');

            if ($indexedCourseIds->isNotEmpty()) {
                $query->whereNotIn('id', $indexedCourseIds);
            }
        }

        $courses = $query->pluck('id');

        if ($courses->isEmpty()) {
            $this->info('Academy knowledge is already up to date.');

            return self::SUCCESS;
        }

        foreach ($courses as $courseId) {
            if ($this->option('sync')) {
                IndexCourseKnowledge::dispatchSync((int) $courseId);
            } else {
                IndexCourseKnowledge::dispatch((int) $courseId);
            }
        }

        $verb = $this->option('sync') ? 'Indexed ' : 'Queued ';
        $this->info($verb.$courses->count().' course(s).');

        return self::SUCCESS;
    }
}
