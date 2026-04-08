<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;
    use HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
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


    public function marking_centers()
    {
        return $this->belongsToMany(MarkingCenter::class)
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function hasCenterRole(string $centerId, string $role): bool
    {
        return $this->marking_centers()
                    ->where('marking_centers.id', $centerId)
                    ->wherePivot('role', $role)
                    ->exists();
    }

    public function getRolesForCenter(string $centerId): array
    {
        return $this->marking_centers()
                    ->where('marking_centers.id', $centerId)
                    ->pluck('marking_center_user.role')
                    ->toArray();
    }
}
