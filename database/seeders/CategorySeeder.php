<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'YouTube & Montage Vidéo',
            'WordPress & Web Design',
            'Bande Dessinée & Illustration',
            'E-Commerce & Marketing',
            'Design Graphique & IA',
            'Formations Certifiantes',
        ];

        foreach ($categories as $index => $name) {
            Category::firstOrCreate(
                ['name' => $name],
                [
                    'slug' => Str::slug($name),
                    'order' => $index + 1,
                ],
            );
        }
    }
}
