<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TutorQuizAnswer extends Model
{
    protected $fillable=['session_id','question_index','answer','is_correct','feedback'];
    protected function casts(): array { return ['is_correct'=>'boolean']; }
}
