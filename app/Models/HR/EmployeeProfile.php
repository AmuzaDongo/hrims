<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class EmployeeProfile extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'employee_id',
        'national_id',
        'passport_number',
        'tin_number',
        'nssf_number',
        'nhis_number',
        'gender',
        'marital_status',
        'religion',
        'blood_group',
        'disability_status',
        'disability_description',
        'residential_address',
        'city',
        'district',
        'country',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Uuid::uuid4()->toString();
            }
        });
    }

    // ────────────────────────────────────────────────
    // Relationships
    // ────────────────────────────────────────────────

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}