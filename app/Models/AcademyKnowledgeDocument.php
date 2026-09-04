<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademyKnowledgeDocument extends Model
{
    protected $fillable = ['course_id','module_id','lesson_id','source_type','source_ref','title','content','checksum','visibility','index_status','index_error','metadata','indexed_at'];
    protected function casts(): array { return ['metadata'=>'array','indexed_at'=>'datetime']; }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function lesson(): BelongsTo { return $this->belongsTo(Lesson::class); }
    public function chunks(): HasMany { return $this->hasMany(AcademyKnowledgeChunk::class, 'document_id'); }
}
