<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class TutorQuizSession extends Model
{
    protected $fillable=['user_id','course_id','lesson_id','title','questions','score','max_score','completed_at'];
    protected function casts(): array { return ['questions'=>'array','completed_at'=>'datetime']; }
    public function answers(): HasMany { return $this->hasMany(TutorQuizAnswer::class,'session_id'); }
}
