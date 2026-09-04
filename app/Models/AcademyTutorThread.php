<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class AcademyTutorThread extends Model
{
    protected $fillable=['user_id','course_id','lesson_id','title'];
    public function messages(): HasMany { return $this->hasMany(AcademyTutorMessage::class,'thread_id'); }
}
