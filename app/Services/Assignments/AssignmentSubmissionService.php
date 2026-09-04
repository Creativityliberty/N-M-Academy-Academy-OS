<?php

declare(strict_types=1);

namespace App\Services\Assignments;

use App\Enums\AssignmentDeliverableType;
use App\Enums\AssignmentSubmissionStatus;
use App\Models\CourseAssignment;
use App\Models\CourseAssignmentSubmission;
use App\Models\User;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AssignmentSubmissionService
{
    public function __construct(private readonly LearningAccessService $access) {}

    /** @param array<string,mixed> $payload @param array<int,UploadedFile> $files */
    public function submit(User $student, CourseAssignment $assignment, array $payload, array $files = []): CourseAssignmentSubmission
    {
        $this->assertAccess($student, $assignment);
        $assignment->loadMissing('rubricItems');
        $this->assertDeliverable($assignment, $payload, $files);

        $latest = $assignment->submissions()->where('user_id', $student->id)->latest('version')->first();
        if ($latest?->status === AssignmentSubmissionStatus::Submitted) {
            throw ValidationException::withMessages(['submission' => 'Votre rendu est déjà en attente de revue.']);
        }
        if ($latest?->status === AssignmentSubmissionStatus::Approved) {
            throw ValidationException::withMessages(['submission' => 'Ce travail a déjà été approuvé.']);
        }

        $version = ((int) ($latest?->version ?? 0)) + 1;
        $storedPaths = [];
        try {
            return DB::transaction(function () use ($student, $assignment, $payload, $files, $version, &$storedPaths): CourseAssignmentSubmission {
                $submission = $assignment->submissions()->create([
                    'user_id' => $student->id,
                    'version' => $version,
                    'status' => AssignmentSubmissionStatus::Submitted->value,
                    'text_content' => filled($payload['text_content'] ?? null) ? trim((string) $payload['text_content']) : null,
                    'link_url' => filled($payload['link_url'] ?? null) ? trim((string) $payload['link_url']) : null,
                    'submitted_at' => now(),
                ]);

                foreach ($files as $file) {
                    if (! $file instanceof UploadedFile) { continue; }
                    $path = $file->store("{$assignment->id}/{$student->id}/v{$version}", 'assignments');
                    if (! $path) { throw ValidationException::withMessages(['files' => 'Impossible de stocker le fichier.']); }
                    $storedPaths[] = $path;
                    $submission->files()->create([
                        'disk' => 'assignments',
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getClientMimeType(),
                        'size_bytes' => (int) $file->getSize(),
                    ]);
                }

                return $submission->fresh('files');
            });
        } catch (\Throwable $e) {
            foreach ($storedPaths as $path) { Storage::disk('assignments')->delete($path); }
            throw $e;
        }
    }

    public function assertAccess(User $student, CourseAssignment $assignment): void
    {
        $assignment->loadMissing(['course','module','lesson.module']);
        abort_unless($assignment->is_enabled && $assignment->course?->status?->value === 'published', 404);
        abort_unless($this->access->canAccessAssignment($student, $assignment), 403);
    }

    /** @param array<string,mixed> $payload @param array<int,UploadedFile> $files */
    private function assertDeliverable(CourseAssignment $assignment, array $payload, array $files): void
    {
        $type = $assignment->deliverable_type;
        $hasText = filled($payload['text_content'] ?? null);
        $hasLink = filled($payload['link_url'] ?? null);
        $hasFiles = count($files) > 0;

        if ($type === AssignmentDeliverableType::Text && ! $hasText) {
            throw ValidationException::withMessages(['text_content' => 'Un rendu texte est requis.']);
        }
        if ($type === AssignmentDeliverableType::Link && ! $hasLink) {
            throw ValidationException::withMessages(['link_url' => 'Un lien est requis.']);
        }
        if ($type === AssignmentDeliverableType::File && ! $hasFiles) {
            throw ValidationException::withMessages(['files' => 'Au moins un fichier est requis.']);
        }
        if ($type === AssignmentDeliverableType::Mixed && ! ($hasText || $hasLink || $hasFiles)) {
            throw ValidationException::withMessages(['submission' => 'Ajoutez au moins un texte, un lien ou un fichier.']);
        }
    }
}
