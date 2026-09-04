<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionEnum: string
{
    // Courses
    case ViewCourses = 'view.courses';
    case CreateCourses = 'create.courses';
    case UpdateOwnCourses = 'update.own.courses';
    case DeleteOwnCourses = 'delete.own.courses';
    case PublishOwnCourses = 'publish.own.courses';
    case UpdateAnyCourse = 'update.any.course';
    case DeleteAnyCourse = 'delete.any.course';
    case PublishAnyCourse = 'publish.any.course';

    // Students
    case PurchaseCourses = 'purchase.courses';
    case LeaveReviews = 'leave.reviews';
    case ViewOwnStudents = 'view.own.students';

    // Categories
    case ManageCategories = 'manage.categories';

    // Users
    case ManageUsers = 'manage.users';

    // Trainer applications
    case ManageTrainerApplications = 'manage.trainer.applications';
}
