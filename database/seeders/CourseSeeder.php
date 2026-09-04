<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Enums\CourseStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        // 1. Trouver ou créer des formateurs pour ces formations
        // Charles Light (YouTube & Montage)
        $charles = User::where('email', 'charles@libertycreativity.com')->first();
        if (!$charles) {
            $charles = User::factory()->create([
                'name' => 'Charles Light',
                'email' => 'charles@libertycreativity.com',
                'password' => bcrypt('password'),
            ]);
            $charles->syncRoles([RoleEnum::Trainer->value]);
        }

        // Lionel Numtema (Design Graphique & IA)
        $lionel = User::where('email', 'lionel@libertycreativity.com')->first();
        if (!$lionel) {
            $lionel = User::factory()->create([
                'name' => 'Lionel Numtema',
                'email' => 'lionel@libertycreativity.com',
                'password' => bcrypt('password'),
            ]);
            $lionel->syncRoles([RoleEnum::Trainer->value]);
        }

        // Kiran Mehta (WordPress & Web)
        $kiran = User::where('email', 'kiran@libertycreativity.com')->first();
        if (!$kiran) {
            $kiran = User::factory()->create([
                'name' => 'Kiran Mehta',
                'email' => 'kiran@libertycreativity.com',
                'password' => bcrypt('password'),
            ]);
            $kiran->syncRoles([RoleEnum::Trainer->value]);
        }

        // Valérie Renaud (E-Commerce & Copywriting)
        $valerie = User::where('email', 'valerie@libertycreativity.com')->first();
        if (!$valerie) {
            $valerie = User::factory()->create([
                'name' => 'Valérie Renaud',
                'email' => 'valerie@libertycreativity.com',
                'password' => bcrypt('password'),
            ]);
            $valerie->syncRoles([RoleEnum::Trainer->value]);
        }

        // Catégories correspondantes
        $youtubeCategory = Category::where('slug', 'youtube-montage-video')->first() ?? $categories->first();
        $wordpressCategory = Category::where('slug', 'wordpress-web-design')->first() ?? $categories->first();
        $bdCategory = Category::where('slug', 'bande-dessinee-illustration')->first() ?? $categories->first();
        $ecommerceCategory = Category::where('slug', 'e-commerce-marketing')->first() ?? $categories->first();
        $designCategory = Category::where('slug', 'design-graphique-ia')->first() ?? $categories->first();

        // 1. Maîtrisez le Montage Vidéo avec DaVinci Resolve
        Course::create([
            'trainer_id' => $charles->id,
            'category_id' => $youtubeCategory->id,
            'title' => 'Maîtrisez le Montage Vidéo avec DaVinci Resolve',
            'slug' => Str::slug('Maîtrisez le Montage Vidéo avec DaVinci Resolve'),
            'description' => 'Apprenez le montage vidéo professionnel de A à Z avec DaVinci Resolve. Du dérushage aux effets spéciaux, en passant par l\'étalonnage couleur et le sound design.',
            'price' => 49.00,
            'duration' => 480, // 8 heures
            'image' => '/assets/images/course_montage_video.png',
            'featured' => true,
            'benefits' => ['Accès à vie', 'Attestation de complétion', 'Fichiers de projet téléchargeables', 'Exercices pratiques corrigés'],
            'status' => CourseStatus::Published->value,
            'published_at' => now(),
        ]);

        // 2. Lancer et Monétiser sa Chaîne YouTube
        Course::create([
            'trainer_id' => $charles->id,
            'category_id' => $youtubeCategory->id,
            'title' => 'Lancer et Monétiser sa Chaîne YouTube',
            'slug' => Str::slug('Lancer et Monétiser sa Chaîne YouTube'),
            'description' => 'Un programme complet pour créer votre chaîne YouTube, optimiser votre référencement, fidéliser votre audience et générer des revenus récurrents.',
            'price' => 39.00,
            'duration' => 360, // 6 heures
            'image' => '/assets/images/course_pleine_conscience.jpg',
            'featured' => true,
            'benefits' => ['Accès à vie', 'Attestation de complétion', 'Templates de miniatures Canva', 'Guide SEO YouTube complet'],
            'status' => CourseStatus::Published->value,
            'published_at' => now(),
        ]);

        // 3. Créer un Site WordPress Professionnel de A à Z
        Course::create([
            'trainer_id' => $kiran->id,
            'category_id' => $wordpressCategory->id,
            'title' => 'Créer un Site WordPress Professionnel de A à Z',
            'slug' => Str::slug('Créer un Site WordPress Professionnel de A à Z'),
            'description' => 'Apprenez à installer, configurer et personnaliser WordPress pour créer un site vitrine ou un blog professionnel sans aucune ligne de code.',
            'price' => 45.00,
            'duration' => 420, // 7 heures
            'image' => '/assets/images/course_lumiere_interieure.jpg',
            'featured' => true,
            'benefits' => ['Accès à vie', 'Thème enfant offert', 'Checklist SEO on-page', 'Support communautaire'],
            'status' => CourseStatus::Published->value,
            'published_at' => now(),
        ]);

        // 4. E-Commerce : Lancer sa Boutique en Ligne avec WooCommerce
        Course::create([
            'trainer_id' => $valerie->id,
            'category_id' => $ecommerceCategory->id,
            'title' => 'Lancer sa Boutique en Ligne avec WooCommerce',
            'slug' => Str::slug('Lancer sa Boutique en Ligne avec WooCommerce'),
            'description' => 'De l\'installation à la première vente : créez et gérez votre boutique e-commerce avec WooCommerce, optimisez vos fiches produits et configurez les paiements.',
            'price' => 35.00,
            'duration' => 300, // 5 heures
            'image' => '/assets/images/course_ecommerce.png',
            'featured' => true,
            'benefits' => ['Accès à vie', 'Templates de fiches produits', 'Guide de copywriting e-commerce'],
            'status' => CourseStatus::Published->value,
            'published_at' => now(),
        ]);

        // 5. Design Graphique & IA Générative
        Course::create([
            'trainer_id' => $lionel->id,
            'category_id' => $designCategory->id,
            'title' => 'Design Graphique & Intelligence Artificielle Générative',
            'slug' => Str::slug('Design Graphique et Intelligence Artificielle Generative'),
            'description' => 'Explorez les outils d\'IA générative (Midjourney, DALL-E, Firefly) pour accélérer votre processus créatif et produire des visuels professionnels.',
            'price' => 59.00,
            'duration' => 600, // 10 heures
            'image' => '/assets/images/course_design_ia.png',
            'featured' => true,
            'benefits' => ['Accès à vie', 'Bibliothèque de prompts', 'Templates Figma inclus', 'Attestation de complétion'],
            'status' => CourseStatus::Published->value,
            'published_at' => now(),
        ]);
    }
}
