<?php

return [
    'enabled' => filter_var(env('ACADEMY_FACTORY_ENABLED', false), FILTER_VALIDATE_BOOL),
    'coolify' => [
        'base_url' => rtrim((string) env('COOLIFY_API_URL', ''), '/'),
        'api_token' => env('COOLIFY_API_TOKEN'),
        'server_uuid' => env('COOLIFY_SERVER_UUID'),
        'destination_uuid' => env('COOLIFY_DESTINATION_UUID'),
        'source_mode' => env('ACADEMY_FACTORY_SOURCE_MODE', 'public'),
        'git_repository' => env('ACADEMY_FACTORY_GIT_REPOSITORY'),
        'git_branch' => env('ACADEMY_FACTORY_GIT_BRANCH', 'main'),
        'private_key_uuid' => env('ACADEMY_FACTORY_PRIVATE_KEY_UUID'),
        'compose_location' => env('ACADEMY_FACTORY_COMPOSE_LOCATION', '/docker-compose.coolify.yml'),
    ],
    'verification' => [
        'scheme' => env('ACADEMY_FACTORY_DOMAIN_SCHEME', 'https'),
        'health_path' => env('ACADEMY_FACTORY_HEALTH_PATH', '/up'),
    ],
];
