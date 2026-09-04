<?php

declare(strict_types=1);

namespace App\Actions\Trainer\Courses;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadLessonMediaAction
{
    public function handleAudio(UploadedFile $file, ?string $existingUrl = null): string
    {
        return $this->upload($file, 'Mindfulness/Audio/Lessons', $existingUrl);
    }

    public function handlePdf(UploadedFile $file, ?string $existingUrl = null): string
    {
        return $this->upload($file, 'Mindfulness/Pdf/Lessons', $existingUrl);
    }

    public function remove(?string $url): void
    {
        if (! $url) {
            return;
        }

        $endpointUrl = rtrim(config('filesystems.disks.imagekit.endpoint_url'), '/');
        $path = ltrim(str_replace($endpointUrl.'/', '', $url), '/');

        try {
            Storage::disk('imagekit')->delete($path);
        } catch (\Throwable) {
            // Fichier introuvable sur ImageKit, on continue.
        }
    }

    private function upload(UploadedFile $file, string $folder, ?string $existingUrl): string
    {
        $this->remove($existingUrl);

        $path = $folder.'/'.Str::uuid().'.'.$file->getClientOriginalExtension();

        Storage::disk('imagekit')->put($path, $file->get());

        return rtrim(config('filesystems.disks.imagekit.endpoint_url'), '/').'/'.$path;
    }
}
