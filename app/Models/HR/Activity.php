<?php

namespace App\Models\HR;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;
use App\Models\User;
use App\Models\HR\ActivityParticipant;

class Activity extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
        'type',
        'venue',
        'address',
        'budget',
        'actual_cost',
        'lead_id',
        'created_by',
        'updated_by',
        'metadata',
    ];

    protected $casts = [
        'start_date'   => 'datetime',
        'end_date'     => 'datetime',
        'budget'       => 'decimal:2',
        'actual_cost'  => 'decimal:2',
        'metadata'     => 'array',
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

    // Relationships
    public function lead()
    {
        return $this->belongsTo(Employee::class, 'lead_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function participants()
    {
        return $this->belongsToMany(Employee::class, 'activity_participant')
            ->using(ActivityParticipant::class)
            ->withPivot('role', 'status', 'notes')
            ->withTimestamps();
    }

    // Many-to-many with assessors/scouts
    public function assessors()
    {
        return $this->belongsToMany(Employee::class, 'activity_assessors')
                    ->withPivot('role')
                    ->withTimestamps();
    }
}