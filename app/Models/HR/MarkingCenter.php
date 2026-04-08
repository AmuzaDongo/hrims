<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;

class MarkingCenter extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'code', 'type', 'region', 'district', 'address', 'is_active'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($model) => $model->id = Uuid::uuid4()->toString());
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('role')
                    ->withTimestamps();
    }
}