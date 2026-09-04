<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AcademyTutorRun extends Model
{
    protected $fillable=['user_id','thread_id','course_id','lesson_id','capability','provider','model','question','retrieved_chunk_ids','status','input_tokens','output_tokens','estimated_cost_cents','latency_ms','error'];
    protected function casts(): array { return ['retrieved_chunk_ids'=>'array']; }
}
