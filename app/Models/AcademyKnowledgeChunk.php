<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademyKnowledgeChunk extends Model
{
    protected $fillable = ['document_id','course_id','lesson_id','chunk_index','content','token_count','metadata'];
    protected function casts(): array { return ['metadata'=>'array']; }
    public function document(): BelongsTo { return $this->belongsTo(AcademyKnowledgeDocument::class, 'document_id'); }
}
