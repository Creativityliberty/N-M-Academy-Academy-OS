<?php

declare(strict_types=1);

namespace App\AI\Capabilities;

use App\AI\AcademyAiCapability;
use App\AI\Contracts\AiProvider;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class GenerateAssignmentCapability implements AcademyAiCapability
{
    public function name(): string { return 'assignment.generate'; }
    public function label(): string { return 'Générer un devoir / projet'; }
    public function mode(): string { return 'create'; }
    public function risk(): string { return 'draft_write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $course = Course::query()->where('trainer_id', $trainer->id)->with(['modules.lessons:id,module_id,title,content,transcript'])->find((int) ($input['course_id'] ?? 0));
        if (! $course) { throw new AuthorizationException('Formation cible introuvable ou non autorisée.'); }
        $module = null;
        if (! empty($input['module_id'])) {
            $module = $course->modules->firstWhere('id', (int) $input['module_id']);
            if (! $module) { throw new AuthorizationException('Module cible introuvable ou non autorisé.'); }
        }
        $lesson = null;
        if (! empty($input['lesson_id'])) {
            $lesson = Lesson::query()->with('module:id,course_id,title')->find((int) $input['lesson_id']);
            if (! $lesson || (int) $lesson->module?->course_id !== (int) $course->id) { throw new AuthorizationException('Leçon cible introuvable ou non autorisée.'); }
            $module = $course->modules->firstWhere('id', (int) $lesson->module_id);
        }
        $source = $lesson ? [
            'course'=>$course->title,'module'=>$lesson->module?->title,'lesson'=>$lesson->title,
            'content'=>mb_substr(trim((string) ($lesson->content ?: $lesson->transcript)),0,30000),
        ] : ($module ? [
            'course'=>$course->title,'module'=>$module->title,'description'=>$module->description,'objectives'=>$module->objectives ?? [],
            'lessons'=>$module->lessons->map(fn (Lesson $l)=>['title'=>$l->title,'content'=>mb_substr(trim((string) ($l->content ?: $l->transcript)),0,8000)])->values()->all(),
        ] : ['course'=>$course->title,'description'=>$course->description,'objectives'=>$course->objectives ?? []]);

        return $provider->structured(
            'Tu es un ingénieur pédagogique senior. Crée un devoir ou projet concret fondé uniquement sur le contenu fourni. Définis des consignes précises et une rubric observable. Ne note jamais un travail étudiant et n’utilise aucune donnée personnelle étudiant.',
            "Instruction : {$prompt}\nContenu source : ".json_encode($source, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'academy_assignment_blueprint',
            self::schema(),
        );
    }

    public static function schema(): array
    {
        return [
            'type'=>'object',
            'properties'=>[
                'title'=>['type'=>'string'],
                'instructions'=>['type'=>'string'],
                'kind'=>['type'=>'string','enum'=>['assignment','project']],
                'deliverable_type'=>['type'=>'string','enum'=>['text','link','file','mixed']],
                'rubric'=>['type'=>'array','minItems'=>1,'maxItems'=>10,'items'=>[
                    'type'=>'object','properties'=>[
                        'criterion'=>['type'=>'string'],
                        'description'=>['type'=>'string'],
                        'max_points'=>['type'=>'integer','minimum'=>1,'maximum'=>100],
                    ],
                    'required'=>['criterion','description','max_points'],'additionalProperties'=>false,
                ]],
            ],
            'required'=>['title','instructions','kind','deliverable_type','rubric'],
            'additionalProperties'=>false,
        ];
    }
}
