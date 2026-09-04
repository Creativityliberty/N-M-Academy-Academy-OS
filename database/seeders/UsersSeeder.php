<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['roles' => [RoleEnum::Admin],   'name' => 'Admin',   'email' => 'admin@pmindfull.com'],
            ['roles' => [RoleEnum::Trainer], 'name' => 'Trainer', 'email' => 'trainer@pmindfull.com'],
            ['roles' => [RoleEnum::Student], 'name' => 'Student', 'email' => 'student@pmindfull.com'],
            ['roles' => [RoleEnum::Admin],   'name' => 'Lionel Numtema',   'email' => 'numtemalionel@gmail.com'],
            ['roles' => [RoleEnum::Admin, RoleEnum::Trainer], 'name' => 'Fabie', 'email' => 'fabieolliveaud@gmail.com'],
        ];

        foreach ($users as $entry) {
            $user = User::firstOrCreate(
                ['email' => $entry['email']],
                [
                    'name' => $entry['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ],
            );

            // Update name if changed
            if ($user->name !== $entry['name']) {
                $user->update(['name' => $entry['name']]);
            }

            $roles = array_map(fn ($role) => $role->value, $entry['roles']);
            $user->syncRoles($roles);
        }
    }
}
