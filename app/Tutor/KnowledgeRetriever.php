<?php

declare(strict_types=1);

namespace App\Tutor;

use App\Models\AcademyKnowledgeChunk;
use App\Models\Course;
use App\Models\User;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Throwable;

class KnowledgeRetriever
{
    public function __construct(
        private readonly EmbeddingProviderManager $embeddings,
        private readonly LearningAccessService $access,
    ) {}

    /** @return list<array{id:int,content:string,score:float,title:string,source_type:string,lesson_id:?int}> */
    public function search(
        User $student,
        Course $course,
        string $query,
        ?int $lessonId = null,
        ?int $limit = null,
        bool $allowUnscored = false,
    ): array {
        if ($this->access->rankFor((int) $student->id, (int) $course->id) === null) {
            throw new AuthorizationException('Cette formation n’est pas accessible à cet étudiant.');
        }

        $accessibleLessonIds = $this->access->accessibleLessonIds($student, $course);
        if ($lessonId !== null && ! in_array($lessonId, $accessibleLessonIds, true)) {
            throw new AuthorizationException('Cette leçon n’est pas encore accessible.');
        }

        $limit = max(1, min(10, $limit ?? (int) config('academy-tutor.retrieval_limit', 6)));
        $provider = $this->embeddings->provider();

        if (DB::connection()->getDriverName() === 'pgsql' && $provider->configured()) {
            try {
                $vector = json_encode($provider->embed($query), JSON_PRESERVE_ZERO_FRACTION);
                $fetchLimit = min(30, max($limit, $limit * 3));
                $sql = 'SELECT c.id,c.content,c.lesson_id,d.title,d.source_type,(1 - (c.embedding <=> ?::vector)) AS score FROM academy_knowledge_chunks c JOIN academy_knowledge_documents d ON d.id=c.document_id WHERE c.course_id=? AND c.embedding IS NOT NULL';
                $bindings = [$vector, $course->id];

                if ($lessonId !== null) {
                    $sql .= ' AND c.lesson_id=?';
                    $bindings[] = $lessonId;
                } elseif ($accessibleLessonIds === []) {
                    $sql .= ' AND c.lesson_id IS NULL';
                } else {
                    $placeholders = implode(',', array_fill(0, count($accessibleLessonIds), '?'));
                    $sql .= " AND (c.lesson_id IS NULL OR c.lesson_id IN ({$placeholders}))";
                    array_push($bindings, ...$accessibleLessonIds);
                }

                $sql .= ' ORDER BY c.embedding <=> ?::vector LIMIT ?';
                $bindings[] = $vector;
                $bindings[] = $fetchLimit;

                $rows = array_map(
                    fn ($row) => [
                        'id' => (int) $row->id,
                        'content' => (string) $row->content,
                        'score' => (float) $row->score,
                        'title' => (string) $row->title,
                        'source_type' => (string) $row->source_type,
                        'lesson_id' => $row->lesson_id ? (int) $row->lesson_id : null,
                    ],
                    DB::select($sql, $bindings),
                );

                if ($allowUnscored) {
                    return array_slice($rows, 0, $limit);
                }

                $minimum = (float) config('academy-tutor.retrieval_min_similarity', 0.20);
                $relevant = array_values(array_filter($rows, fn (array $row) => $row['score'] >= $minimum));
                if ($relevant !== []) {
                    return array_slice($relevant, 0, $limit);
                }
            } catch (Throwable) {
                // Deterministic lexical fallback keeps Tutor available if vector search/provider is unavailable.
            }
        }

        return $this->lexical($course->id, $query, $lessonId, $limit, $allowUnscored, $accessibleLessonIds);
    }

    /** @return list<array{id:int,content:string,score:float,title:string,source_type:string,lesson_id:?int}> */
    private function lexical(
        int $courseId,
        string $query,
        ?int $lessonId,
        int $limit,
        bool $allowUnscored,
        array $accessibleLessonIds,
    ): array {
        $terms = array_values(array_filter(
            array_unique(preg_split('/[^\pL\pN]+/u', mb_strtolower($query)) ?: []),
            fn ($term) => mb_strlen($term) >= 3,
        ));

        $chunks = AcademyKnowledgeChunk::query()
            ->with('document:id,title,source_type')
            ->where('course_id', $courseId)
            ->when($lessonId, fn ($query) => $query->where('lesson_id', $lessonId))
            ->when($lessonId === null, function ($query) use ($accessibleLessonIds): void {
                $query->where(function ($scope) use ($accessibleLessonIds): void {
                    $scope->whereNull('lesson_id');
                    if ($accessibleLessonIds !== []) {
                        $scope->orWhereIn('lesson_id', $accessibleLessonIds); // whereIn unlock filter
                    }
                });
            })
            ->limit(300)
            ->get();

        $ranked = $chunks->map(function (AcademyKnowledgeChunk $chunk) use ($terms): array {
            $title = $chunk->document?->title ?? 'Source';
            $haystack = mb_strtolower($title.' '.$chunk->content);
            $score = 0.0;
            foreach ($terms as $term) {
                $score += substr_count($haystack, $term);
            }

            return [
                'id' => $chunk->id,
                'content' => $chunk->content,
                'score' => $score,
                'title' => $title,
                'source_type' => $chunk->document?->source_type ?? 'lesson',
                'lesson_id' => $chunk->lesson_id,
            ];
        })->sortByDesc('score')->values();

        $scored = $ranked->filter(fn (array $item) => $item['score'] > 0)->take($limit)->values();
        if ($scored->isNotEmpty()) {
            return $scored->all();
        }

        return $allowUnscored ? $ranked->take($limit)->values()->all() : [];
    }

}
