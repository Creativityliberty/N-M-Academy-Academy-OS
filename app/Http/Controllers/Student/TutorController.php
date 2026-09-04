<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\TutorQuizAnswer;
use App\Models\TutorQuizSession;
use App\Tutor\AcademyTutor;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class TutorController extends Controller
{
    public function run(Request $request, Course $course, AcademyTutor $tutor, LearningAccessService $access): JsonResponse
    {
        $data = $request->validate([
            'capability' => ['required', 'string'],
            'prompt' => ['required', 'string', 'max:4000'],
            'lesson_id' => ['nullable', 'integer'],
            'thread_id' => ['nullable', 'integer'],
            'allow_general' => ['nullable', 'boolean'],
        ]);

        $lesson = null;

        if (! empty($data['lesson_id'])) {
            $lesson = Lesson::query()
                ->whereKey((int) $data['lesson_id'])
                ->whereHas('module', fn ($query) => $query->where('course_id', $course->id))
                ->firstOrFail();
            abort_unless($access->canAccessLesson($request->user(), $lesson), 403);
        }

        try {
            return response()->json($tutor->run(
                $request->user(),
                $course,
                $lesson,
                (string) $data['capability'],
                (string) $data['prompt'],
                isset($data['thread_id']) ? (int) $data['thread_id'] : null,
                (bool) ($data['allow_general'] ?? false),
            ));
        } catch (AuthorizationException|ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Le Tutor AI est temporairement indisponible. Votre progression et vos cours restent accessibles.',
            ], 503);
        }
    }

    public function submitQuiz(Request $request, TutorQuizSession $session): JsonResponse
    {
        abort_unless($session->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*' => ['nullable', 'string', 'max:2000'],
        ]);

        $questions = $session->questions ?? [];
        $score = 0;
        $results = [];

        foreach ($questions as $index => $question) {
            $given = (string) ($data['answers'][$index] ?? '');
            $expected = (string) ($question['answer'] ?? '');
            $correct = $this->normalize($given) === $this->normalize($expected);

            if (($question['type'] ?? '') === 'short' && ! $correct) {
                $correct = $expected !== ''
                    && str_contains($this->normalize($given), $this->normalize($expected));
            }

            if ($correct) {
                $score++;
            }

            TutorQuizAnswer::updateOrCreate(
                ['session_id' => $session->id, 'question_index' => $index],
                [
                    'answer' => $given,
                    'is_correct' => $correct,
                    'feedback' => (string) ($question['explanation'] ?? ''),
                ],
            );

            $results[] = [
                'index' => $index,
                'correct' => $correct,
                'expected' => $expected,
                'explanation' => (string) ($question['explanation'] ?? ''),
            ];
        }

        $session->update([
            'score' => $score,
            'max_score' => count($questions),
            'completed_at' => now(),
        ]);

        return response()->json([
            'score' => $score,
            'maxScore' => count($questions),
            'results' => $results,
        ]);
    }

    private function normalize(string $value): string
    {
        return trim(mb_strtolower(preg_replace('/\s+/u', ' ', $value) ?? $value));
    }
}
