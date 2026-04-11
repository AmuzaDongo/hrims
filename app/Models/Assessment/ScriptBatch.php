<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ScriptBatch extends Model
{

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'paper_id', 'center_id', 'batch_code', 'total_scripts', 'metadata',
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
}


