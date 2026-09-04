#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
require(){ test -e "$1" || { echo "MISSING $1"; exit 1; }; }
contains(){ grep -Fq -- "$2" "$1" || { echo "MISSING_PATTERN $1 :: $2"; exit 1; }; }
require app/Models/AcademyKnowledgeDocument.php
require app/Models/AcademyKnowledgeChunk.php
require app/Models/AcademyTutorThread.php
require app/Models/AcademyTutorMessage.php
require app/Models/AcademyTutorRun.php
require app/Models/TutorQuizSession.php
require app/Models/TutorQuizAnswer.php
require app/Models/AcademyTutorSetting.php
require app/Tutor/KnowledgeIndexer.php
require app/Tutor/KnowledgeRetriever.php
require app/Tutor/AcademyTutor.php
require app/Tutor/Contracts/EmbeddingProvider.php
require app/Tutor/Providers/OpenAiEmbeddingProvider.php
require app/Jobs/IndexCourseKnowledge.php
require app/Console/Commands/ReindexAcademyKnowledge.php
require app/Http/Controllers/Student/TutorController.php
contains app/Http/Controllers/Student/TutorController.php '503'
require app/Http/Controllers/Trainer/TutorSettingsController.php
contains docker-compose.coolify.yml 'pgvector/pgvector:0.8.6-pg17'
contains routes/student.php 'TutorController'
contains routes/trainer.php 'TutorSettingsController'
contains config/academy-tutor.php "'daily_limit'"
contains app/Tutor/KnowledgeRetriever.php 'LearningAccessService'
contains app/Tutor/KnowledgeRetriever.php 'accessibleLessonIds'
contains app/Tutor/KnowledgeRetriever.php '<=>'
contains app/Tutor/KnowledgeRetriever.php 'allowUnscored'
contains app/Tutor/AcademyTutor.php 'allowUnscored'
contains app/Tutor/PdfTextExtractor.php 'Http::'
contains app/Tutor/PdfTextExtractor.php "config('filesystems.disks.imagekit.endpoint_url')"
contains app/Tutor/AcademyTutor.php 'tutor.ask'
contains app/Tutor/AcademyTutor.php 'tutor.explain'
contains app/Tutor/AcademyTutor.php 'tutor.summarize'
contains app/Tutor/AcademyTutor.php 'tutor.quiz'
contains app/Tutor/AcademyTutor.php 'tutor.study_plan'
contains app/Models/AcademyTutorSetting.php 'forTrainer'
contains database/migrations/2026_08_31_170000_create_academy_tutor_tables.php "foreignId('trainer_id')"
contains app/Tutor/AcademyTutor.php 'course->trainer_id'
contains resources/js/pages/student/courses/show.tsx 'AI Tutor'
contains app/Console/Commands/ReindexAcademyKnowledge.php "--missing"
contains docker/start.sh 'academy:knowledge-reindex --missing'
contains app/Mcp/AcademyMcpToolRegistry.php 'tutor.quiz.generate'
contains app/Mcp/AcademyMcpToolRegistry.php 'lesson.get'
contains app/Mcp/AcademyMcpToolRegistry.php 'course.knowledge.search'
contains app/Mcp/AcademyMcpToolRegistry.php 'learning.progress.get'
echo 'M09 TUTOR CONTRACT PASS'
