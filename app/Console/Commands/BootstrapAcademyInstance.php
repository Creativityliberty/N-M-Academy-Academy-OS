<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Factory\AcademyFactoryTemplateRegistry;
use App\Models\AcademyPage;
use App\Models\Category;
use App\Models\CommunitySpace;
use App\Models\User;
use App\MissionTower\Services\TowerBootstrapTokenProvisioner;
use App\PageBuilder\PageBlockRegistry;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BootstrapAcademyInstance extends Command
{
    protected $signature = 'academy:bootstrap-instance';
    protected $description = 'Idempotently bootstrap the owner and starter Academy structure from environment variables.';

    public function handle(AcademyFactoryTemplateRegistry $templates, PageBlockRegistry $blocks, TowerBootstrapTokenProvisioner $towerTokens): int
    {
        $email = strtolower(trim((string) env('ACADEMY_BOOTSTRAP_OWNER_EMAIL', '')));
        if ($email === '') {
            $this->components->info('No Academy bootstrap owner configured.');
            return self::SUCCESS;
        }

        app(RolesAndPermissionsSeeder::class)->run();

        $name = trim((string) env('ACADEMY_BOOTSTRAP_OWNER_NAME', 'Academy Owner')) ?: 'Academy Owner';
        $password = (string) env('ACADEMY_BOOTSTRAP_OWNER_PASSWORD', '');
        $owner = User::query()->where('email', $email)->first();
        if (! $owner && $password === '') {
            $this->components->error('Owner password is required for the first bootstrap.');
            return self::FAILURE;
        }

        if (! $owner) {
            $owner = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]);
        } else {
            $owner->forceFill(['name'=>$name, 'email_verified_at'=>$owner->email_verified_at ?: now()])->save();
        }
        $owner->syncRoles(['admin', 'trainer']);

        if ((bool) config('mission-tower.enabled')) {
            $towerToken = trim((string) env('TOWER_ACADEMY_MCP_TOKEN', ''));
            if ($towerToken === '') {
                $this->components->warn('Mission Tower is enabled but TOWER_ACADEMY_MCP_TOKEN is missing.');
            } else {
                $towerTokens->provision($owner, $towerToken);
                $this->components->info('Mission Tower Bootstrap MCP identity is ready.');
            }
        }

        foreach (['Business', 'Marketing', 'Tech', 'Créativité', 'Bien-être', 'Autre'] as $position => $categoryName) {
            Category::firstOrCreate(
                ['slug'=>Str::slug($categoryName)],
                ['name'=>$categoryName, 'order'=>$position + 1],
            );
        }

        if ((bool) config('academy.features.community')) {
            foreach ([
                ['Bienvenue', 'Présentez-vous et découvrez la communauté.'],
                ['Questions', 'Posez vos questions et partagez vos blocages.'],
                ['Ressources', 'Partagez outils, documents et ressources utiles.'],
            ] as $position => [$spaceName, $description]) {
                CommunitySpace::firstOrCreate(
                    ['slug'=>Str::slug($spaceName)],
                    ['name'=>$spaceName, 'description'=>$description, 'position'=>$position, 'is_active'=>true],
                );
            }
        }

        if ((bool) config('academy.features.pages')) {
            $templateKey = (string) env('ACADEMY_TEMPLATE_KEY', 'creator');
            $template = $templates->get($templateKey);
            $page = AcademyPage::firstOrCreate(
                ['trainer_id'=>$owner->id, 'slug'=>'accueil'],
                [
                    'title'=>config('academy.name'),
                    'page_type'=>'landing',
                    'status'=>'draft',
                    'meta_title'=>config('academy.name'),
                    'meta_description'=>config('academy.descriptor'),
                ],
            );
            if ($page->sections()->count() === 0) {
                $seed = [
                    ['hero', ['headline'=>config('academy.name'), 'subheadline'=>'Une expérience de formation qui vous appartient.', 'primary_label'=>'Découvrir', 'primary_url'=>'/courses']],
                    ['features', ['title'=>'Une académie pensée pour progresser', 'items'=>[
                        ['title'=>'Apprendre', 'description'=>'Des formations structurées et accessibles.'],
                        ['title'=>'Échanger', 'description'=>'Une communauté reliée à votre apprentissage.'],
                        ['title'=>'Progresser', 'description'=>'Suivez votre progression et avancez à votre rythme.'],
                    ]]],
                    ['cta', ['title'=>'Bienvenue dans votre académie', 'description'=>$template['descriptor'], 'button_label'=>'Voir les formations', 'button_url'=>'/courses']],
                    ['footer', ['tagline'=>config('academy.descriptor')]],
                ];
                foreach ($seed as $index => [$type, $settings]) {
                    $page->sections()->create([
                        'type'=>$type,
                        'variant'=>$blocks->defaultVariant($type),
                        'sort_order'=>$index,
                        'is_visible'=>true,
                        'settings'=>$blocks->sanitizeSettings($type, $settings),
                    ]);
                }
            }
        }

        $this->components->info("Academy owner {$email} bootstrapped.");
        return self::SUCCESS;
    }
}
