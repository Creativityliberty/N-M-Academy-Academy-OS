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

class GenerateAssessmentCapability implements AcademyAiCapability
{
    public function name(): string { return 'assessment.generate'; }
    public function label(): string { return 'Générer un quiz / une évaluation'; }
    public function mode(): string { return 'create'; }
    public function risk(): string { return 'draft_write'; }
    public function canApply(): bool { return true; }

    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array
    {
        $course = Course::query()
            ->where('trainer_id', $trainer->id)
            ->with(['modules.lessons:id,module_id,title,content,transcript'])
            ->find((int) ($input['course_id'] ?? 0));
        if (! $course) { throw new AuthorizationException('Formation cible introuvable ou non autorisée.'); }

        $module = null;
        if (! empty($input['module_id'])) {
            $module = $course->modules->firstWhere('id', (int) $input['module_id']);
            if (! $module) { throw new AuthorizationException('Module cible introuvable ou non autorisé.'); }
        }

        $lesson = null;
        if (! empty($input['lesson_id'])) {
            $lesson = Lesson::query()->with('module:id,course_id,title')->find((int) $input['lesson_id']);
            if (! $lesson || (int) $lesson->module?->course_id !== (int) $course->id) {
                throw new AuthorizationException('Leçon cible introuvable ou non autorisée.');
            }
            $module = $course->modules->firstWhere('id', (int) $lesson->module_id);
        }

        $source = $lesson
            ? [
                'course' => $course->title,
                'module' => $lesson->module?->title,
                'lesson' => $lesson->title,
                'content' => mb_substr(trim((string) ($lesson->content ?: $lesson->transcript)), 0, 30000),
            ]
            : ($module
                ? [
                    'course' => $course->title,
                    'module' => $module->title,
                    'description' => $module->description,
                    'objectives' => $module->objectives ?? [],
                    'lessons' => $module->lessons->map(fn (Lesson $item) => [
                        'title' => $item->title,
                        'content' => mb_substr(trim((string) ($item->content ?: $item->transcript)), 0, 8000),
                    ])->values()->all(),
                ]
                : [
                    'course' => $course->title,
                    'description' => $course->description,
                    'objectives' => $course->objectives ?? [],
                    'modules' => $course->modules->map(fn (Module $item) => [
                        'title' => $item->title,
                        'lessons' => $item->lessons->pluck('title')->values()->all(),
                    ])->values()->all(),
                ]);

        $questionCount = min(20, max(3, (int) ($input['question_count'] ?? 5)));
        $kind = in_array(($input['kind'] ?? 'quiz'), ['quiz','assessment'], true) ? (string) $input['kind'] : 'quiz';
        $passing = min(100, max(0, (int) ($input['passing_score_percent'] ?? 70)));

        return $provider->structured(
            'Tu es un évaluateur pédagogique senior. Crée uniquement des questions auto-corrigeables fondées sur le contenu fourni. N’invente aucune information extérieure. Les distracteurs doivent être plausibles, sans ambiguïté. Pour chaque question, explique brièvement pourquoi la réponse est correcte. N’utilise aucune donnée personnelle étudiant.',
            "Instruction : {$prompt}\nType : {$kind}\nNombre de questions : {$questionCount}\nScore de réussite : {$passing}%\nContenu source : ".json_encode($source, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'academy_assessment_blueprint',
            self::schema($questionCount),
        );
    }

    public static function schema(int $questionCount = 5): array
    {
        $option = [
            'type' => 'object',
            'properties' => [
                'text' => ['type' => 'string'],
                'is_correct' => ['type' => 'boolean'],
            ],
            'required' => ['text', 'is_correct'],
            'additionalProperties' => false,
        ];

        $question = [
            'type' => 'object',
            'properties' => [
                'type' => ['type' => 'string', 'enum' => ['single_choice','multiple_choice','true_false']],
                'prompt' => ['type' => 'string'],
                'explanation' => ['type' => 'string'],
                'points' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 100],
                'options' => ['type' => 'array', 'items' => $option, 'minItems' => 2, 'maxItems' => 8],
            ],
            'required' => ['type','prompt','explanation','points','options'],
            'additionalProperties' => false,
        ];

        return [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'kind' => ['type' => 'string', 'enum' => ['quiz','assessment']],
                'passing_score_percent' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 100],
                'questions' => ['type' => 'array', 'items' => $question, 'minItems' => max(3, $questionCount), 'maxItems' => max(3, $questionCount)],
            ],
            'required' => ['title','description','kind','passing_score_percent','questions'],
            'additionalProperties' => false,
        ];
    }
}
