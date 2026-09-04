<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        Course::all()->each(function (Course $course): void {
            Module::factory(rand(3, 6))->create([
                'course_id' => $course->id,
            ]);
        });
    }
}
