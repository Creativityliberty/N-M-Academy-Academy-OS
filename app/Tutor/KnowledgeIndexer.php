<?php

declare(strict_types=1);
namespace App\Tutor;
use App\Models\AcademyKnowledgeChunk;
use App\Models\AcademyKnowledgeDocument;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Throwable;
class KnowledgeIndexer
{
    public function __construct(private readonly TextChunker $chunker, private readonly EmbeddingProviderManager $embeddings, private readonly PdfTextExtractor $pdf) {}
    public function indexCourse(Course $course): array
    {
        $course->load('modules.lessons');
        AcademyKnowledgeDocument::where('course_id',$course->id)->delete();
        $documents=0; $chunks=0; $provider=$this->embeddings->provider();
        foreach ($course->modules as $module) {
            foreach ($module->lessons as $lesson) {
                if (filled($lesson->content)) {
                    [$d,$c]=$this->indexDocument($course->id,$module->id,$lesson->id,'lesson','lesson:'.$lesson->id,$module->title.' · '.$lesson->title,(string)$lesson->content,$lesson->is_free?'public':'enrolled',['module_title'=>$module->title,'lesson_title'=>$lesson->title],$provider);
                    $documents += $d; $chunks += $c;
                }
                if (filled($lesson->transcript)) {
                    [$d,$c]=$this->indexDocument($course->id,$module->id,$lesson->id,'transcript','transcript:'.$lesson->id,$lesson->title.' · Transcription',(string)$lesson->transcript,$lesson->is_free?'public':'enrolled',['module_title'=>$module->title,'lesson_title'=>$lesson->title],$provider);
                    $documents += $d; $chunks += $c;
                }
                if (filled($lesson->pdf_url)) {
                    $pdfText=$this->pdf->extract($lesson->pdf_url);
                    if ($pdfText) {
                        [$d,$c]=$this->indexDocument($course->id,$module->id,$lesson->id,'pdf','pdf:'.$lesson->id,$lesson->title.' · PDF',$pdfText,$lesson->is_free?'public':'enrolled',['url'=>$lesson->pdf_url,'extracted'=>true],$provider);
                        $documents += $d; $chunks += $c;
                    } else {
                        AcademyKnowledgeDocument::create([
                            'course_id'=>$course->id,'module_id'=>$module->id,'lesson_id'=>$lesson->id,'source_type'=>'pdf','source_ref'=>'pdf:'.$lesson->id,'title'=>$lesson->title.' · PDF','content'=>null,'checksum'=>hash('sha256',(string)$lesson->pdf_url),'visibility'=>$lesson->is_free?'public':'enrolled','index_status'=>'error','index_error'=>'PDF text extraction unavailable for this source.','metadata'=>['url'=>$lesson->pdf_url,'extracted'=>false],
                        ]);
                        $documents++;
                    }
                }
            }
        }
        return ['documents'=>$documents,'chunks'=>$chunks,'embedding_provider'=>$provider->name(),'embedding_model'=>$provider->model()];
    }
    private function indexDocument(int $courseId,int $moduleId,int $lessonId,string $type,string $ref,string $title,string $content,string $visibility,array $metadata,$provider): array
    {
        $checksum=hash('sha256',$content);
        $document=AcademyKnowledgeDocument::create(['course_id'=>$courseId,'module_id'=>$moduleId,'lesson_id'=>$lessonId,'source_type'=>$type,'source_ref'=>$ref,'title'=>$title,'content'=>$content,'checksum'=>$checksum,'visibility'=>$visibility,'index_status'=>'indexing','metadata'=>$metadata]);
        $count=0;
        try {
            foreach ($this->chunker->chunk($content) as $index=>$chunkText) {
                $chunk=AcademyKnowledgeChunk::create(['document_id'=>$document->id,'course_id'=>$courseId,'lesson_id'=>$lessonId,'chunk_index'=>$index,'content'=>$chunkText,'token_count'=>$this->tokens($chunkText),'metadata'=>['title'=>$title,'source_type'=>$type]]);
                if ($provider->configured()) {
                    $vector=$provider->embed($chunkText);
                    $encoded=json_encode(array_values($vector), JSON_PRESERVE_ZERO_FRACTION);
                    if (DB::connection()->getDriverName()==='pgsql') DB::statement('UPDATE academy_knowledge_chunks SET embedding = ?::vector WHERE id = ?',[$encoded,$chunk->id]);
                    else DB::table('academy_knowledge_chunks')->where('id',$chunk->id)->update(['embedding'=>$encoded]);
                }
                $count++;
            }
            $document->update(['index_status'=>'indexed','index_error'=>null,'indexed_at'=>now()]);
        } catch (Throwable $e) {
            $document->update(['index_status'=>'error','index_error'=>mb_substr($e->getMessage(),0,2000)]);
            throw $e;
        }
        return [1,$count];
    }
    private function tokens(string $text): int { return max(1,(int)ceil(mb_strlen($text)/4)); }
}
