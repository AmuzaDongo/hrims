<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ScriptAllocation extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'type', 'script_id', 'batch_id','assessor_id', 'allocated_at', 'status', 'created_by', 'metadata',
    ];

    protected $casts = [
        'metadata' => 'array'
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

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

