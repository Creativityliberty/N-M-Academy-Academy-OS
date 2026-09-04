<?php

return [
    'name' => env('ACADEMY_NAME', env('APP_NAME', 'NÜM Academy')),
    'version' => env('ACADEMY_VERSION', '1.6.0'),
    'short_name' => env('ACADEMY_SHORT_NAME', 'NÜM'),
    'descriptor' => env('ACADEMY_DESCRIPTOR', 'Academy OS'),
    'logo_url' => env('ACADEMY_LOGO_URL'),

    'theme' => [
        'preset' => env('ACADEMY_THEME_PRESET', 'soft-glass'),
        'primary' => env('ACADEMY_PRIMARY', '#6F7F70'),
        'primary_hover' => env('ACADEMY_PRIMARY_HOVER', '#576A59'),
        'primary_soft' => env('ACADEMY_PRIMARY_SOFT', '#EAF0E8'),
        'primary_surface' => env('ACADEMY_PRIMARY_SURFACE', '#F4F7F2'),
        'secondary' => env('ACADEMY_SECONDARY', '#202720'),
        'accent' => env('ACADEMY_ACCENT', '#B79B72'),
        'radius' => env('ACADEMY_RADIUS', '1rem'),
        'density' => env('ACADEMY_DENSITY', 'comfortable'),
        'dark_primary' => env('ACADEMY_DARK_PRIMARY', '#9DB29F'),
        'dark_primary_hover' => env('ACADEMY_DARK_PRIMARY_HOVER', '#B5C6B6'),
        'dark_primary_soft' => env('ACADEMY_DARK_PRIMARY_SOFT', '#263127'),
        'dark_primary_surface' => env('ACADEMY_DARK_PRIMARY_SURFACE', '#1B231C'),
        'dark_secondary' => env('ACADEMY_DARK_SECONDARY', '#DDE6DD'),
        'dark_accent' => env('ACADEMY_DARK_ACCENT', '#D1B98F'),
    ],

    'features' => [
        'community' => filter_var(env('ACADEMY_FEATURE_COMMUNITY', true), FILTER_VALIDATE_BOOL),
        'events' => filter_var(env('ACADEMY_FEATURE_EVENTS', true), FILTER_VALIDATE_BOOL),
        'ai' => filter_var(env('ACADEMY_FEATURE_AI', true), FILTER_VALIDATE_BOOL),
        'tutor' => filter_var(env('ACADEMY_FEATURE_TUTOR', true), FILTER_VALIDATE_BOOL),
        'sales' => filter_var(env('ACADEMY_FEATURE_SALES', true), FILTER_VALIDATE_BOOL),
        'pages' => filter_var(env('ACADEMY_FEATURE_PAGES', true), FILTER_VALIDATE_BOOL),
        'mcp' => filter_var(env('ACADEMY_FEATURE_MCP', true), FILTER_VALIDATE_BOOL),
        'tower' => filter_var(env('ACADEMY_FEATURE_TOWER', false), FILTER_VALIDATE_BOOL),
        'assessments' => filter_var(env('ACADEMY_FEATURE_ASSESSMENTS', true), FILTER_VALIDATE_BOOL),
        'assignments' => filter_var(env('ACADEMY_FEATURE_ASSIGNMENTS', true), FILTER_VALIDATE_BOOL),
        'completion' => filter_var(env('ACADEMY_FEATURE_COMPLETION', true), FILTER_VALIDATE_BOOL),
        'certificates' => filter_var(env('ACADEMY_FEATURE_CERTIFICATES', true), FILTER_VALIDATE_BOOL),
        'drip' => filter_var(env('ACADEMY_FEATURE_DRIP', true), FILTER_VALIDATE_BOOL),
    ],


    'learning' => [
        'completion' => [
            'require_all_accessible_lessons' => filter_var(env('ACADEMY_COMPLETION_REQUIRE_ALL_ACCESSIBLE_LESSONS', true), FILTER_VALIDATE_BOOL),
        ],
        'certificates' => [
            'issuer_name' => env('ACADEMY_CERTIFICATE_ISSUER_NAME'),
            'title' => env('ACADEMY_CERTIFICATE_TITLE', 'Certificat de réussite'),
            'public_verification' => filter_var(env('ACADEMY_CERTIFICATE_PUBLIC_VERIFICATION', true), FILTER_VALIDATE_BOOL),
            'pdf_download' => filter_var(env('ACADEMY_CERTIFICATE_PDF_DOWNLOAD', true), FILTER_VALIDATE_BOOL),
            'student_sharing' => filter_var(env('ACADEMY_CERTIFICATE_STUDENT_SHARING', true), FILTER_VALIDATE_BOOL),
        ],
    ],

    'mcp' => [
        'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', (string) env('ACADEMY_MCP_ALLOWED_ORIGINS', ''))))),
        'max_body_bytes' => (int) env('ACADEMY_MCP_MAX_BODY_BYTES', 1048576),
    ],

    'deployment' => [
        'mode' => env('ACADEMY_DEPLOYMENT_MODE', 'single-tenant'),
    ],
];
