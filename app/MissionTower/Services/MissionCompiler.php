<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerCompilation;
use App\Models\User;
use Throwable;

class MissionCompiler
{
    public function __construct(
        private readonly TowerAiProviderResolver $providers,
        private readonly TowerToolCatalog $tools,
        private readonly CompiledMissionValidator $validator,
    ) {}

    public function compile(User $user, string $prompt): TowerCompilation
    {
        $prompt = trim($prompt);
        if (mb_strlen($prompt) < 10 || mb_strlen($prompt) > 12000) {
            throw new \InvalidArgumentException('La demande Mission Compiler doit contenir entre 10 et 12000 caractères.');
        }

        $compilation = TowerCompilation::create([
            'owner_id' => $user->id,
            'status' => 'compiling',
            'prompt' => $prompt,
            'warnings' => [],
        ]);

        try {
            $provider = $this->providers->resolve();
            $compilation->update(['provider' => $provider->name(), 'model' => $provider->model()]);

            $catalog = array_values(array_filter(
                $this->tools->keyed(),
                fn (array $tool): bool => ($tool['scope'] ?? 'academy') === 'academy',
            ));
            if ($catalog === []) {
                throw new \RuntimeException('Aucun tool Academy MCP n’est accessible au token Mission Tower.');
            }

            $toolContext = array_map(fn (array $tool): array => [
                'name' => $tool['name'],
                'title' => $tool['title'],
                'description' => $tool['description'],
                'risk' => $tool['risk'],
                'inputSchema' => $tool['inputSchema'],
                'annotations' => $tool['annotations'],
            ], $catalog);

            $raw = $provider->structured(
                $this->systemPrompt(),
                "USER REQUEST:\n{$prompt}\n\nACCESSIBLE MCP TOOLS:\n".json_encode($toolContext, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'mission_plan',
                $this->missionPlanSchema(),
            );

            $proposal = $this->validator->normalizeModelOutput($raw);
            $warnings = $this->warnings($proposal);
            $compilation->update([
                'status' => 'proposal',
                'proposal' => $proposal,
                'warnings' => $warnings,
                'error_message' => null,
            ]);

            return $compilation->fresh(['mission']);
        } catch (Throwable $error) {
            $compilation->update(['status' => 'failed', 'error_message' => mb_substr($error->getMessage(), 0, 10000)]);
            throw $error;
        }
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are NÜM Mission Compiler. Convert the user's business/academy intent into a minimal executable plan using ONLY the MCP tools supplied in ACCESSIBLE MCP TOOLS.

Rules:
- Langue par défaut : français. Écris le titre, l'objectif, le résumé, les raisons et les hypothèses destinés à l'utilisateur en français, sauf si l'utilisateur demande explicitement une autre langue.
- Output a proposal only. Never claim that anything was executed.
- Never invent a tool, field, ID, course, student, order, date, price, email, URL, or external fact.
- Prefer READ tools first when information is needed before a mutation.
- Use WRITE/SENSITIVE tools only when the user explicitly requests an outcome that requires mutation.
- Keep the plan minimal and sequential. A later step may rely on information from an earlier READ step conceptually, but do not fabricate dynamic IDs that are unknown now.
- If a mutation needs an identifier or value that is not already known from the user request, do not invent it and do not plan that mutation yet. Keep the mission analytical/read-only for that part and state what must be reviewed before a follow-up mission. This runtime does not bind outputs from one step into later step arguments yet.
- When the user asks to create a course and category_id is not already known, use categories.list first and stop before courses.create; ask for or review the resolved category in a follow-up mission.
- Do not place modules.create or lessons.create after courses.create in the same mission when the new course_id would only exist as an output of courses.create. This runtime does not bind dynamic outputs between steps yet.
- For a rich course creation request, when the courses.create schema supports them and the user intent provides enough context, populate description, target_audience, level, positioning, benefits, objectives, prerequisites and duration. Generate pedagogical/marketing copy from the user's stated intent, but never invent external facts, IDs or unverifiable claims.
- `arguments_json` must be a valid JSON object string matching the selected tool inputSchema. Do not add unknown fields.
- Keep assumptions explicit and short.
- Risk metadata in the catalog is informational for planning only; authorization and risk are recalculated by Tower after generation.
PROMPT;
    }

    /** @return array<string, mixed> */
    private function missionPlanSchema(): array
    {
        return [
            'type' => 'object',
            'additionalProperties' => false,
            'properties' => [
                'title' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 180],
                'objective' => ['type' => 'string', 'minLength' => 10, 'maxLength' => 10000],
                'priority' => ['type' => 'string', 'enum' => ['low', 'normal', 'high']],
                'summary' => ['type' => 'string', 'maxLength' => 4000],
                'assumptions' => [
                    'type' => 'array',
                    'maxItems' => 12,
                    'items' => ['type' => 'string', 'maxLength' => 500],
                ],
                'steps' => [
                    'type' => 'array',
                    'minItems' => 1,
                    'maxItems' => max(1, (int) config('mission-tower.limits.max_mission_steps', 24)),
                    'items' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'properties' => [
                            'tool' => ['type' => 'string', 'minLength' => 1, 'maxLength' => 190],
                            'arguments_json' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 20000],
                            'reason' => ['type' => 'string', 'maxLength' => 1000],
                        ],
                        'required' => ['tool', 'arguments_json', 'reason'],
                    ],
                ],
            ],
            'required' => ['title', 'objective', 'priority', 'summary', 'assumptions', 'steps'],
        ];
    }

    /** @param array<string, mixed> $proposal @return array<int, string> */
    private function warnings(array $proposal): array
    {
        $warnings = [];
        $risk = (array) ($proposal['riskSummary'] ?? []);
        if (($risk['sensitive'] ?? 0) > 0) {
            $warnings[] = 'Cette proposition contient une ou plusieurs actions SENSITIVE qui exigeront une validation forte avant exécution.';
        } elseif (($risk['write'] ?? 0) > 0) {
            $warnings[] = 'Cette proposition contient des mutations WRITE qui exigeront une validation avant exécution.';
        }
        if (($proposal['assumptions'] ?? []) !== []) {
            $warnings[] = 'Vérifiez les hypothèses avant de matérialiser la mission.';
        }

        return $warnings;
    }
}
