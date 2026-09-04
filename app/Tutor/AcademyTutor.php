<?php

declare(strict_types=1);
namespace App\Tutor;
use App\AI\AiProviderManager;
use App\Models\AcademyTutorMessage;
use App\Models\AcademyTutorRun;
use App\Models\AcademyTutorSetting;
use App\Models\AcademyTutorThread;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Services\LearningAccess\LearningAccessService;
use App\Models\TutorQuizSession;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use Throwable;
class AcademyTutor
{
    public const CAPABILITIES=['tutor.ask','tutor.explain','tutor.summarize','tutor.quiz','tutor.study_plan'];
    public function __construct(
        private readonly KnowledgeRetriever $retriever,
        private readonly AiProviderManager $providers,
        private readonly TutorUsageEstimator $usage,
        private readonly LearningAccessService $access,
    ) {}
    public function run(User $student,Course $course,?Lesson $lesson,string $capability,string $prompt,?int $threadId=null,bool $allowGeneral=false): array
    {
        if (!in_array($capability,self::CAPABILITIES,true)) throw ValidationException::withMessages(['capability'=>'Capability Tutor inconnue.']);
        $settings=AcademyTutorSetting::forTrainer((int) $course->trainer_id);
        $this->authorize($student,$course,$settings);
        if ($lesson !== null && ! $this->access->canAccessLesson($student, $lesson)) {
            throw new AuthorizationException('Cette leçon n’est pas encore accessible.');
        }
        $this->enforceLimits($student,$settings);
        $thread=$this->resolveThread($student,$course,$lesson,$threadId);
        $userMessage = AcademyTutorMessage::create(['thread_id'=>$thread->id,'role'=>'user','content'=>$prompt]);
        $started=microtime(true);
        $run=AcademyTutorRun::create(['user_id'=>$student->id,'thread_id'=>$thread->id,'course_id'=>$course->id,'lesson_id'=>$lesson?->id,'capability'=>$capability,'question'=>$prompt,'status'=>'pending']);
        try {
            $query=$this->retrievalQuery($capability,$prompt,$lesson);
            $retrievalLessonId = in_array($capability, ['tutor.explain', 'tutor.summarize', 'tutor.quiz'], true) ? $lesson?->id : null;
            $allowUnscored = in_array($capability, ['tutor.summarize', 'tutor.quiz', 'tutor.study_plan'], true);
            $chunks=$this->retriever->search($student,$course,$query,$retrievalLessonId,null,$allowUnscored);
            $run->update(['retrieved_chunk_ids'=>array_column($chunks,'id')]);
            if ($chunks === [] && ($capability === 'tutor.quiz' || $settings->outside_content_policy === 'never' || ($settings->outside_content_policy === 'ask' && ! $allowGeneral))) {
                $needsPermission = $capability !== 'tutor.quiz' && $settings->outside_content_policy === 'ask' && ! $allowGeneral;
                $answer = $needsPermission
                    ? 'Je ne trouve pas cette information dans les contenus autorisés de cette formation. Autorisez-vous une explication générale hors du contenu de l’Academy ?'
                    : 'Je ne trouve pas cette information dans les contenus autorisés de cette formation.';
                $this->completeRun($run,'grounded',$answer,$started,0,0,0);
                AcademyTutorMessage::create(['thread_id'=>$thread->id,'role'=>'assistant','content'=>$answer,'sources'=>[],'provider'=>'grounded','model'=>'none']);
                return ['threadId'=>$thread->id,'runId'=>$run->id,'answer'=>$answer,'sources'=>[],'quiz'=>null,'needsGeneralPermission'=>$needsPermission];
            }
            $provider=$this->providerFor($settings, $capability);
            $context=$this->context($chunks);
            $system=$this->systemPrompt($settings,$context,$chunks!==[]);
            $conversation = $this->conversationContext($thread, $userMessage->id);
            $input=$this->capabilityPrompt($capability,$prompt,$course,$lesson,$student,$context,$conversation);
            if ($capability==='tutor.quiz') {
                $output=$provider->structured($system,$input,'academy_tutor_quiz',$this->quizSchema());
                $questions=array_slice(array_values((array)($output['questions'] ?? [])),0,10);
                $quiz=TutorQuizSession::create(['user_id'=>$student->id,'course_id'=>$course->id,'lesson_id'=>$lesson?->id,'title'=>(string)($output['title'] ?? 'Quiz de révision'),'questions'=>$questions,'max_score'=>count($questions)]);
                $answer='Quiz généré à partir des contenus de la formation.';
            } else {
                $quiz=null;
                $answer=$provider->text($system,$input);
            }
            $sources=$this->sources($chunks);
            $inputTokens=$this->usage->tokens($system.$input);
            $outputTokens=$this->usage->tokens($answer.($quiz ? json_encode($quiz->questions) : ''));
            $cost=$this->usage->costCents($inputTokens,$outputTokens);
            $this->completeRun($run,$provider->name(),$answer,$started,$inputTokens,$outputTokens,$cost,$provider->model());
            AcademyTutorMessage::create(['thread_id'=>$thread->id,'role'=>'assistant','content'=>$answer,'sources'=>$sources,'provider'=>$provider->name(),'model'=>$provider->model(),'input_tokens'=>$inputTokens,'output_tokens'=>$outputTokens]);
            return ['threadId'=>$thread->id,'runId'=>$run->id,'answer'=>$answer,'sources'=>$sources,'quiz'=>$quiz ? ['id'=>$quiz->id,'title'=>$quiz->title,'questions'=>$this->publicQuestions($quiz->questions)] : null,'needsGeneralPermission'=>false];
        } catch (Throwable $e) {
            $run->update(['status'=>'failed','error'=>mb_substr($e->getMessage(),0,2000),'latency_ms'=>(int)((microtime(true)-$started)*1000)]);
            throw $e;
        }
    }
    private function authorize(User $student,Course $course,AcademyTutorSetting $settings): void
    {
        if (!$settings->enabled) throw new AuthorizationException('Le Tutor AI est désactivé pour cette académie.');
        if (!$settings->allowsCourse($course->id)) throw new AuthorizationException('Le Tutor AI est désactivé pour cette formation.');
        if (!Enrollment::where('user_id',$student->id)->where('course_id',$course->id)->exists()) throw new AuthorizationException('Inscription requise pour utiliser le Tutor AI.');
    }
    private function enforceLimits(User $student, AcademyTutorSetting $settings): void
    {
        $trainerCourseIds = Course::query()
            ->where('trainer_id', $settings->trainer_id)
            ->pluck('id');

        if (
            $settings->daily_limit > 0
            && AcademyTutorRun::query()
                ->where('user_id', $student->id)
                ->whereIn('course_id', $trainerCourseIds)
                ->whereDate('created_at', today())
                ->count() >= $settings->daily_limit
        ) {
            throw ValidationException::withMessages(['limit' => 'Limite quotidienne du Tutor atteinte.']);
        }

        if ($settings->monthly_budget_cents > 0) {
            if (
                (int) config('academy-tutor.cost.input_per_million_cents', 0) <= 0
                && (int) config('academy-tutor.cost.output_per_million_cents', 0) <= 0
            ) {
                throw ValidationException::withMessages([
                    'limit' => 'Un budget Tutor est configuré mais les tarifs estimatifs du provider ne le sont pas.',
                ]);
            }

            $monthlySpend = AcademyTutorRun::query()
                ->whereIn('course_id', $trainerCourseIds)
                ->where('created_at', '>=', now()->startOfMonth())
                ->sum('estimated_cost_cents');

            if ($monthlySpend >= $settings->monthly_budget_cents) {
                throw ValidationException::withMessages(['limit' => 'Budget mensuel Tutor atteint.']);
            }
        }
    }
    private function resolveThread(User $student,Course $course,?Lesson $lesson,?int $threadId): AcademyTutorThread
    {
        if ($threadId) {
            $thread=AcademyTutorThread::where('id',$threadId)->where('user_id',$student->id)->where('course_id',$course->id)->first();
            if ($thread) return $thread;
        }
        return AcademyTutorThread::create(['user_id'=>$student->id,'course_id'=>$course->id,'lesson_id'=>$lesson?->id,'title'=>$lesson?->title ?? $course->title]);
    }
    private function providerFor(AcademyTutorSetting $settings, string $capability)
    {
        $name=$settings->provider==='inherit' ? null : $settings->provider;
        $premium = in_array($capability, ['tutor.quiz', 'tutor.study_plan'], true);
        $model = $premium && filled($settings->premium_model) ? $settings->premium_model : $settings->model;
        return $this->providers->providerFor($name,$model ?: null);
    }
    private function context(array $chunks): string
    {
        $limit=(int)config('academy-tutor.max_context_chars',18000); $text='';
        foreach($chunks as $i=>$chunk){ $piece='[S'.($i+1).'] '.$chunk['title']."\n".$chunk['content']."\n\n"; if(mb_strlen($text.$piece)>$limit) break; $text.=$piece; }
        return trim($text);
    }
    private function systemPrompt(AcademyTutorSetting $settings,string $context,bool $hasContext): string
    {
        $personality=match($settings->personality){'concise'=>'Réponds de façon concise et directe.','coach'=>'Agis comme un coach pédagogique exigeant mais bienveillant.',default=>'Sois clair, pédagogique et utile.'};
        $grounding=$hasContext ? 'Utilise prioritairement les SOURCES ci-dessous. Lorsque tu affirmes un point provenant du cours, cite [S1], [S2], etc. N’invente jamais une source.' : 'Aucune source Academy pertinente n’a été retrouvée.';
        return "Tu es le Tutor AI privé de cette Academy. {$personality} {$grounding}\n\nSOURCES:\n{$context}";
    }
    private function capabilityPrompt(string $capability,string $prompt,Course $course,?Lesson $lesson,User $student,string $context,string $conversation): string
    {
        $progress=$this->progress($student,$course);
        $instruction=match($capability){'tutor.explain'=>'Explique le concept demandé avec un exemple simple puis une mini vérification de compréhension.','tutor.summarize'=>'Résume les points essentiels de manière structurée et actionnable.','tutor.study_plan'=>'Propose un plan de révision réaliste, séquencé, basé sur la progression et la demande.','tutor.quiz'=>'Crée un quiz strictement fondé sur les sources disponibles. Pour les QCM et vrai/faux, le champ answer doit être exactement égal à une des options proposées.',default=>'Réponds précisément à la question de l’étudiant.'};
        return "CAPABILITY: {$capability}\nCOURSE: {$course->title}\nLESSON: ".($lesson?->title ?? 'formation entière')."\nPROGRESS: {$progress['completed']}/{$progress['total']} ({$progress['percentage']}%)\nRECENT CONVERSATION:\n{$conversation}\nINSTRUCTION: {$instruction}\nQUESTION: {$prompt}";
    }
    private function conversationContext(AcademyTutorThread $thread, int $currentMessageId): string
    {
        $limit = max(0, min(20, (int) config('academy-tutor.conversation_messages', 8)));
        if ($limit === 0) return '';

        return AcademyTutorMessage::query()
            ->where('thread_id', $thread->id)
            ->where('id', '<', $currentMessageId)
            ->latest('id')
            ->limit($limit)
            ->get(['role', 'content'])
            ->reverse()
            ->map(fn (AcademyTutorMessage $message) => strtoupper($message->role).': '.mb_substr($message->content, 0, 1200))
            ->implode("\n");
    }

    private function retrievalQuery(string $capability,string $prompt,?Lesson $lesson): string { return trim(($lesson?->title ?? '').' '.$capability.' '.$prompt); }
    private function progress(User $student,Course $course): array
    {
        $ids = collect($this->access->accessibleLessonIds($student, $course));
        $completed=LessonProgress::where('user_id',$student->id)->whereIn('lesson_id',$ids)->count(); $total=$ids->count();
        return ['completed'=>$completed,'total'=>$total,'percentage'=>$total? (int)round($completed/$total*100):0];
    }
    private function sources(array $chunks): array
    {
        return array_values(array_map(fn($chunk,$i)=>['label'=>'S'.($i+1),'chunkId'=>$chunk['id'],'title'=>$chunk['title'],'sourceType'=>$chunk['source_type'],'lessonId'=>$chunk['lesson_id'],'snippet'=>mb_substr($chunk['content'],0,220)],$chunks,array_keys($chunks)));
    }
    private function completeRun(AcademyTutorRun $run,string $provider,string $answer,float $started,int $input,int $output,int $cost,?string $model=null): void
    {
        $run->update(['status'=>'succeeded','provider'=>$provider,'model'=>$model,'input_tokens'=>$input,'output_tokens'=>$output,'estimated_cost_cents'=>$cost,'latency_ms'=>(int)((microtime(true)-$started)*1000)]);
    }
    private function quizSchema(): array
    {
        return ['type'=>'object','additionalProperties'=>false,'required'=>['title','questions'],'properties'=>['title'=>['type'=>'string'],'questions'=>['type'=>'array','minItems'=>3,'maxItems'=>10,'items'=>['type'=>'object','additionalProperties'=>false,'required'=>['type','question','options','answer','explanation'],'properties'=>['type'=>['type'=>'string','enum'=>['mcq','true_false','short']],'question'=>['type'=>'string'],'options'=>['type'=>'array','items'=>['type'=>'string']],'answer'=>['type'=>'string'],'explanation'=>['type'=>'string']]]]]];
    }
    private function publicQuestions(array $questions): array
    {
        return array_values(array_map(fn($q,$i)=>['index'=>$i,'type'=>$q['type'] ?? 'mcq','question'=>$q['question'] ?? '','options'=>$q['options'] ?? []],$questions,array_keys($questions)));
    }
}
