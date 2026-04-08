<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\HR\ActivityParticipant;

class Employee extends Model
{
    use SoftDeletes, HasUuids;

    /**
     * UUID settings
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'user_id',
        'department_id',
        'sub_department_id',
        'position_id',
        'employee_number',
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'hire_date',
        'probation_end_date',
        'termination_date',
        'employment_type',
        'status',
        'gross_salary',
        'custom_fields',
        'created_by',
        'updated_by',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'custom_fields'      => 'array',
        'gross_salary'       => 'decimal:2',
        'date_of_birth'      => 'date',
        'hire_date'          => 'date',
        'probation_end_date' => 'date',
        'termination_date'   => 'date',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function department()
    {
        return $this->belongsTo(\App\Models\HR\Department::class);
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_participant')
            ->using(ActivityParticipant::class)
            ->withPivot('role', 'status', 'notes')
            ->withTimestamps();
    }
    
    public function subDepartment()
    {
        return $this->belongsTo(\App\Models\HR\SubDepartment::class);
    }

    public function position()
    {
        return $this->belongsTo(\App\Models\HR\Position::class);
    }

    public function profile()
    {
        return $this->hasOne(\App\Models\HR\EmployeeProfile::class);
    }
}