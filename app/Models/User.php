<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use Billable, HasFactory, HasRoles, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'trainer_title',
        'trainer_bio',
        'trainer_avatar',
        'stripe_id',
        'stripe_account_id',
        'stripe_onboarding_completed',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isTrainer(): bool
    {
        return $this->hasRole('trainer');
    }

    public function isStudent(): bool
    {
        return $this->hasRole('student');
    }

    public function scopeTrainers(Builder $query): void
    {
        $query->whereHas('roles', fn (Builder $q) => $q->where('name', 'trainer'));
    }

    public function scopeStudents(Builder $query): void
    {
        $query->whereHas('roles', fn (Builder $q) => $q->where('name', 'student'));
    }

    public function scopeAdmins(Builder $query): void
    {
        $query->whereHas('roles', fn (Builder $q) => $q->whereIn('name', ['admin', 'super-admin']));
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'trainer_id');
    }

    public function communityPosts(): HasMany
    {
        return $this->hasMany(CommunityPost::class);
    }

    public function communityComments(): HasMany
    {
        return $this->hasMany(CommunityComment::class);
    }

    public function academyEvents(): HasMany
    {
        return $this->hasMany(AcademyEvent::class, 'creator_id');
    }

    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function academyMcpTokens(): HasMany
    {
        return $this->hasMany(AcademyMcpToken::class);
    }

    public function academyMcpCalls(): HasMany
    {
        return $this->hasMany(AcademyMcpCall::class);
    }

    public function academyAiRuns(): HasMany
    {
        return $this->hasMany(AcademyAiRun::class);
    }

    public function academyOrders(): HasMany
    {
        return $this->hasMany(AcademyOrder::class);
    }

    public function academyMemberships(): HasMany
    {
        return $this->hasMany(AcademyMembership::class);
    }

    public function academyPages(): HasMany
    {
        return $this->hasMany(AcademyPage::class, 'trainer_id');
    }
}
