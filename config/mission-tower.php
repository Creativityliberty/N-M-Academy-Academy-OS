<?php

declare(strict_types=1);

return [
    'enabled' => filter_var(env('TOWER_ENABLED', false), FILTER_VALIDATE_BOOL),
    'ai' => [
        'provider' => strtolower((string) env('TOWER_AI_PROVIDER', 'inherit')),
        'model' => env('TOWER_AI_MODEL'),
    ],
    'academy_mcp' => [
        'url' => rtrim((string) env('TOWER_ACADEMY_MCP_URL', rtrim((string) env('APP_URL', 'http://localhost'), '/').'/mcp'), '/'),
        'token' => env('TOWER_ACADEMY_MCP_TOKEN'),
        'timeout' => (int) env('TOWER_ACADEMY_MCP_TIMEOUT', 10),
        'in_process' => filter_var(env('TOWER_ACADEMY_MCP_IN_PROCESS', true), FILTER_VALIDATE_BOOL),
    ],
    'numflow' => [
        'enabled' => filter_var(env('TOWER_NUMFLOW_ENABLED', false), FILTER_VALIDATE_BOOL),
        'url' => rtrim((string) env('TOWER_NUMFLOW_URL', ''), '/'),
        'token' => env('TOWER_NUMFLOW_TOKEN'),
    ],
    'harness' => [
        'enabled' => filter_var(env('TOWER_HARNESS_ENABLED', false), FILTER_VALIDATE_BOOL),
        'url' => rtrim((string) env('TOWER_HARNESS_URL', ''), '/'),
        'token' => env('TOWER_HARNESS_TOKEN'),
    ],
    'fleet' => [
        'enabled' => filter_var(env('TOWER_FLEET_ENABLED', false), FILTER_VALIDATE_BOOL),
        'coolify_api_url' => rtrim((string) env('COOLIFY_API_URL', ''), '/'),
        'coolify_api_token' => env('COOLIFY_API_TOKEN'),
        'coolify_server_uuid' => env('COOLIFY_SERVER_UUID'),
    ],
    'chat' => [
        'enabled' => filter_var(env('TOWER_CHAT_ENABLED', true), FILTER_VALIDATE_BOOL),
        'history_messages' => (int) env('TOWER_CHAT_HISTORY_MESSAGES', 8),
        'max_message_length' => (int) env('TOWER_CHAT_MAX_MESSAGE_LENGTH', 12000),
        'request_timeout_seconds' => (int) env('TOWER_CHAT_REQUEST_TIMEOUT', 180),
        'auto_run_read' => filter_var(env('TOWER_CHAT_AUTO_RUN_READ', true), FILTER_VALIDATE_BOOL),
        'summary_trigger_messages' => (int) env('TOWER_CHAT_SUMMARY_TRIGGER_MESSAGES', 16),
        'summary_batch_messages' => (int) env('TOWER_CHAT_SUMMARY_BATCH_MESSAGES', 16),
        'max_summary_length' => (int) env('TOWER_CHAT_MAX_SUMMARY_LENGTH', 6000),
    ],
    'memory' => [
        'enabled' => filter_var(env('TOWER_MEMORY_ENABLED', true), FILTER_VALIDATE_BOOL),
        'max_context' => (int) env('TOWER_MEMORY_MAX_CONTEXT', 8),
        'semantic' => filter_var(env('TOWER_MEMORY_SEMANTIC', true), FILTER_VALIDATE_BOOL),
        'retention_days' => (int) env('TOWER_MEMORY_RETENTION_DAYS', 365),
        'thread_retention_days' => (int) env('TOWER_MEMORY_THREAD_RETENTION_DAYS', 30),
    ],
    'observatory' => [
        'enabled' => filter_var(env('TOWER_OBSERVATORY_ENABLED', true), FILTER_VALIDATE_BOOL),
        'refund_rate_warn' => (float) env('TOWER_OBSERVATORY_REFUND_RATE_WARN', 5),
        'conversion_drop_pct' => (float) env('TOWER_OBSERVATORY_CONVERSION_DROP_PCT', 15),
        'learning_risk_pct' => (float) env('TOWER_OBSERVATORY_LEARNING_RISK_PCT', 25),
        'event_fill_warn' => (float) env('TOWER_OBSERVATORY_EVENT_FILL_WARN', 30),
        'community_silence_hours' => (int) env('TOWER_OBSERVATORY_COMMUNITY_SILENCE_HOURS', 72),
        'ai_cost_spike_pct' => (float) env('TOWER_OBSERVATORY_AI_COST_SPIKE_PCT', 50),
        'ai_cost_min_baseline_cents' => (int) env('TOWER_OBSERVATORY_AI_COST_MIN_BASELINE_CENTS', 100),
    ],
    'limits' => [
        'max_mission_steps' => (int) env('TOWER_MAX_MISSION_STEPS', 24),
        'max_parallel_steps' => (int) env('TOWER_MAX_PARALLEL_STEPS', 4),
    ],
];
