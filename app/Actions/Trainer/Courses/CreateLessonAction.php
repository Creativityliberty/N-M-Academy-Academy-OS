<?php

declare(strict_types=1);

namespace App\Actions\Trainer\Courses;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\UploadedFile;

class CreateLessonAction
{
    public function __construct(
        private readonly UploadLessonMediaAction $uploadMedia,
    ) {}

    public function handle(Module $module, array $data): Lesson
    {
        $audioFile = $data['audio_file'] ?? null;
        $pdfFile = $data['pdf_file'] ?? null;
        unset($data['audio_file'], $data['pdf_file'], $data['id']);

        if ($audioFile instanceof UploadedFile) {
            $data['audio_url'] = $this->uploadMedia->handleAudio($audioFile);
        }

        if ($pdfFile instanceof UploadedFile) {
            $data['pdf_url'] = $this->uploadMedia->handlePdf($pdfFile);
        }

        /** @var Lesson $lesson */
        $lesson = $module->lessons()->create($data);

        return $lesson;
    }
}
