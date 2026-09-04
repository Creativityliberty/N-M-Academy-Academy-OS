<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        Module::all()->each(function (Module $module): void {
            Lesson::factory(rand(3, 6))->create([
                'module_id' => $module->id,
            ]);

            // First lesson of each module is free
            $module->lessons()->orderBy('order')->first()?->update(['is_free' => true]);
        });
    }
}
