<?php

declare(strict_types=1);

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'admin';
    case Trainer = 'trainer';
    case Student = 'student';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrateur',
            self::Trainer => 'Formateur',
            self::Student => 'Étudiant',
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            self::Admin => PermissionEnum::cases(),

            self::Trainer => [
                PermissionEnum::ViewCourses,
                PermissionEnum::CreateCourses,
                PermissionEnum::UpdateOwnCourses,
                PermissionEnum::DeleteOwnCourses,
                PermissionEnum::PublishOwnCourses,
                PermissionEnum::ViewOwnStudents,
            ],

            self::Student => [
                PermissionEnum::ViewCourses,
                PermissionEnum::PurchaseCourses,
                PermissionEnum::LeaveReviews,
            ],
        };
    }
}
