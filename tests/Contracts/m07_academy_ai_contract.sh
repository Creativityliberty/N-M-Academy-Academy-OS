#!/usr/bin/env bash
set -euo pipefail

fail() { echo "M07 CONTRACT FAIL: $1" >&2; exit 1; }

[[ -f config/academy-ai.php ]] || fail "missing AI config"
[[ -f app/AI/Contracts/AiProvider.php ]] || fail "missing provider contract"
[[ -f app/AI/AiProviderManager.php ]] || fail "missing provider manager"
[[ -f app/AI/AcademyAiCapabilityRegistry.php ]] || fail "missing capability registry"
[[ -f app/AI/AcademyAiRunner.php ]] || fail "missing AI runner"
[[ -f app/AI/Providers/DeepSeekResponsesProvider.php ]] || fail "missing DeepSeek provider"
[[ -f app/Models/AcademyAiRun.php ]] || fail "missing AI run model"
[[ -f resources/js/pages/trainer/academy-ai/index.tsx ]] || fail "missing Academy AI workspace"

grep -q "academy.ask" app/AI/AcademyAiCapabilityRegistry.php || fail "missing academy.ask capability"
grep -q "course.generate" app/AI/AcademyAiCapabilityRegistry.php || fail "missing course.generate capability"
grep -q "curriculum.generate" app/AI/AcademyAiCapabilityRegistry.php || fail "missing curriculum.generate capability"
grep -q "lessons.generate" app/AI/AcademyAiCapabilityRegistry.php || fail "missing lessons.generate capability"
grep -q "lesson.rewrite" app/AI/AcademyAiCapabilityRegistry.php || fail "missing lesson.rewrite capability"
grep -q "students.analyze" app/AI/AcademyAiCapabilityRegistry.php || fail "missing students.analyze capability"

grep -q "academy-ai" routes/trainer.php || fail "missing trainer AI routes"
grep -q "Academy AI" resources/js/components/app-sidebar.tsx || fail "missing sidebar entry"
grep -q "'content'" app/Models/Lesson.php || fail "lesson content not first-class"
grep -q "text.*format\|json_schema" app/AI/Providers/OpenAiResponsesProvider.php || fail "structured output not wired"
grep -q "ACADEMY_AI_PROVIDER" .env.coolify.example || fail "Coolify AI env missing"
grep -q "deepseek" app/AI/AiProviderManager.php || fail "DeepSeek not registered"
grep -q "DEEPSEEK_API_KEY" config/academy-ai.php || fail "DeepSeek API key config missing"
grep -q "deepseek-v4-pro" .env.coolify.example || fail "DeepSeek model example missing"
grep -q "reasoningEffort" app/AI/Providers/DeepSeekResponsesProvider.php || fail "DeepSeek reasoning control missing"

echo "M07 CONTRACT PASS"
