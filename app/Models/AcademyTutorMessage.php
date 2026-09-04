<?php

declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AcademyTutorMessage extends Model
{
    protected $fillable=['thread_id','role','content','sources','provider','model','input_tokens','output_tokens'];
    protected function casts(): array { return ['sources'=>'array']; }
}
