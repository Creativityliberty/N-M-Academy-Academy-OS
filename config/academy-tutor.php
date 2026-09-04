<?php

declare(strict_types=1);

return [
    'enabled' => filter_var(env('ACADEMY_TUTOR_ENABLED', true), FILTER_VALIDATE_BOOL),
    'provider' => env('ACADEMY_TUTOR_PROVIDER', 'inherit'),
    'model' => env('ACADEMY_TUTOR_MODEL'),
    'premium_model' => env('ACADEMY_TUTOR_PREMIUM_MODEL'),
    'personality' => env('ACADEMY_TUTOR_PERSONALITY', 'helpful'),
    'outside_content_policy' => env('ACADEMY_TUTOR_OUTSIDE_CONTENT', 'never'),
    'daily_limit' => (int) env('ACADEMY_TUTOR_DAILY_LIMIT', 20),
    'monthly_budget_cents' => (int) env('ACADEMY_TUTOR_MONTHLY_BUDGET_CENTS', 0),
    'retrieval_limit' => (int) env('ACADEMY_TUTOR_RETRIEVAL_LIMIT', 6),
    'retrieval_min_similarity' => (float) env('ACADEMY_TUTOR_RETRIEVAL_MIN_SIMILARITY', 0.20),
    'max_context_chars' => (int) env('ACADEMY_TUTOR_MAX_CONTEXT_CHARS', 18000),
    'conversation_messages' => (int) env('ACADEMY_TUTOR_CONVERSATION_MESSAGES', 8),
    'embedding' => [
        'provider' => env('ACADEMY_EMBEDDING_PROVIDER', env('OPENAI_API_KEY') ? 'openai' : 'disabled'),
        'model' => env('ACADEMY_EMBEDDING_MODEL', 'text-embedding-3-small'),
        'dimensions' => (int) env('ACADEMY_EMBEDDING_DIMENSIONS', 1536),
    ],
    'cost' => [
        'input_per_million_cents' => (int) env('ACADEMY_TUTOR_INPUT_COST_PER_MILLION_CENTS', 0),
        'output_per_million_cents' => (int) env('ACADEMY_TUTOR_OUTPUT_COST_PER_MILLION_CENTS', 0),
    ],
];
