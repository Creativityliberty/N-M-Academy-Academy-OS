<?php

declare(strict_types=1);

namespace App\Factory;

use Illuminate\Support\Str;

class AcademyFactoryBlueprintBuilder
{
    public function __construct(
        private readonly AcademyFactoryTemplateRegistry $templates,
        private readonly AcademyFactoryCapabilityRegistry $capabilities,
    ) {}

    public function build(array $input): array
    {
        $template = $this->templates->get((string) $input['template_key']);
        $theme = array_merge($template['theme'], array_filter((array) ($input['theme'] ?? []), fn ($v) => $v !== null && $v !== ''));
        $capabilityProfile = (string) ($input['capability_profile'] ?? $template['capability_profile'] ?? 'creator');
        $features = $this->capabilities->resolveFeatures($capabilityProfile, (array) ($input['features'] ?? []));
        $name = trim((string) $input['client_name']);
        $shortName = trim((string) ($input['short_name'] ?? '')) ?: Str::upper(Str::substr(Str::slug($name, ''), 0, 4));
        $domain = strtolower(trim((string) $input['domain']));
        $domain = preg_replace('#^https?://#', '', $domain) ?: '';
        $domain = rtrim($domain, '/');
        $slug = Str::slug((string) ($input['slug'] ?? $name));

        $learningInput = (array) ($input['learning'] ?? []);
        $learning = [
            'require_all_accessible_lessons' => (bool) ($learningInput['require_all_accessible_lessons'] ?? true),
            'issuer_name' => trim((string) ($learningInput['issuer_name'] ?? '')) ?: $name,
            'certificate_title' => trim((string) ($learningInput['certificate_title'] ?? '')) ?: 'Certificat de réussite',
            'public_verification' => (bool) ($learningInput['public_verification'] ?? true),
            'pdf_download' => (bool) ($learningInput['pdf_download'] ?? true),
            'student_sharing' => (bool) ($learningInput['student_sharing'] ?? true),
        ];

        if (! $features['certificates']) {
            $learning['public_verification'] = false;
            $learning['pdf_download'] = false;
            $learning['student_sharing'] = false;
        }
        if (! $learning['public_verification']) {
            $learning['student_sharing'] = false;
        }

        $environment = [
            'APP_NAME' => $name,
            'APP_ENV' => 'production',
            'APP_DEBUG' => 'false',
            'APP_URL' => 'https://'.$domain,
            'APP_LOCALE' => (string) ($input['locale'] ?? 'fr'),
            'APP_FALLBACK_LOCALE' => 'en',
            'ACADEMY_NAME' => $name,
            'ACADEMY_SHORT_NAME' => $shortName ?: 'ACAD',
            'ACADEMY_DESCRIPTOR' => (string) ($input['descriptor'] ?? $template['descriptor']),
            'ACADEMY_LOGO_URL' => (string) ($input['logo_url'] ?? ''),
            'ACADEMY_TEMPLATE_KEY' => $template['key'],
            'ACADEMY_CAPABILITY_PROFILE' => $capabilityProfile,
            'ACADEMY_THEME_PRESET' => (string) $theme['preset'],
            'ACADEMY_PRIMARY' => (string) $theme['primary'],
            'ACADEMY_PRIMARY_HOVER' => (string) $theme['primary_hover'],
            'ACADEMY_PRIMARY_SOFT' => (string) $theme['primary_soft'],
            'ACADEMY_PRIMARY_SURFACE' => (string) $theme['primary_surface'],
            'ACADEMY_SECONDARY' => (string) $theme['secondary'],
            'ACADEMY_ACCENT' => (string) $theme['accent'],
            'ACADEMY_RADIUS' => (string) $theme['radius'],
            'ACADEMY_DENSITY' => (string) $theme['density'],
            'ACADEMY_DEPLOYMENT_MODE' => 'single-tenant',
            'ACADEMY_FACTORY_ENABLED' => 'false',
            'ACADEMY_FEATURE_COMMUNITY' => $features['community'] ? 'true' : 'false',
            'ACADEMY_FEATURE_EVENTS' => $features['events'] ? 'true' : 'false',
            'ACADEMY_FEATURE_AI' => $features['ai'] ? 'true' : 'false',
            'ACADEMY_FEATURE_TUTOR' => $features['tutor'] ? 'true' : 'false',
            'ACADEMY_FEATURE_SALES' => $features['sales'] ? 'true' : 'false',
            'ACADEMY_FEATURE_PAGES' => $features['pages'] ? 'true' : 'false',
            'ACADEMY_FEATURE_MCP' => $features['mcp'] ? 'true' : 'false',
            'ACADEMY_FEATURE_TOWER' => $features['tower'] ? 'true' : 'false',
            'TOWER_ENABLED' => $features['tower'] ? 'true' : 'false',
            'TOWER_ACADEMY_MCP_IN_PROCESS' => $features['tower'] ? 'true' : 'false',
            'ACADEMY_FEATURE_ASSESSMENTS' => $features['assessments'] ? 'true' : 'false',
            'ACADEMY_FEATURE_ASSIGNMENTS' => $features['assignments'] ? 'true' : 'false',
            'ACADEMY_FEATURE_COMPLETION' => $features['completion'] ? 'true' : 'false',
            'ACADEMY_FEATURE_CERTIFICATES' => $features['certificates'] ? 'true' : 'false',
            'ACADEMY_FEATURE_DRIP' => $features['drip'] ? 'true' : 'false',
            'ACADEMY_COMPLETION_REQUIRE_ALL_ACCESSIBLE_LESSONS' => $learning['require_all_accessible_lessons'] ? 'true' : 'false',
            'ACADEMY_CERTIFICATE_ISSUER_NAME' => $learning['issuer_name'],
            'ACADEMY_CERTIFICATE_TITLE' => $learning['certificate_title'],
            'ACADEMY_CERTIFICATE_PUBLIC_VERIFICATION' => $learning['public_verification'] ? 'true' : 'false',
            'ACADEMY_CERTIFICATE_PDF_DOWNLOAD' => $learning['pdf_download'] ? 'true' : 'false',
            'ACADEMY_CERTIFICATE_STUDENT_SHARING' => $learning['student_sharing'] ? 'true' : 'false',
            'DB_CONNECTION' => 'pgsql', 'DB_HOST' => 'postgres', 'DB_PORT' => '5432',
            'DB_DATABASE' => 'num_academy', 'DB_USERNAME' => 'num_academy',
            'REDIS_CLIENT' => 'phpredis', 'REDIS_HOST' => 'redis', 'REDIS_PORT' => '6379',
            'SESSION_DRIVER' => 'redis', 'CACHE_STORE' => 'redis', 'QUEUE_CONNECTION' => 'redis',
            'FILESYSTEM_DISK' => 'public', 'MEDIA_DISK' => 'public', 'INERTIA_SSR_ENABLED' => 'true',
            'MAIL_MAILER' => (string) ($input['mail']['mailer'] ?? 'log'),
            'MAIL_HOST' => (string) ($input['mail']['host'] ?? ''),
            'MAIL_PORT' => (string) ($input['mail']['port'] ?? '587'),
            'MAIL_USERNAME' => (string) ($input['mail']['username'] ?? ''),
            'MAIL_FROM_ADDRESS' => (string) ($input['mail']['from_address'] ?? 'hello@'.$domain),
            'MAIL_FROM_NAME' => (string) ($input['mail']['from_name'] ?? $name),
            'STRIPE_KEY' => (string) ($input['stripe']['key'] ?? ''),
            'STRIPE_CLIENT_ID' => (string) ($input['stripe']['client_id'] ?? ''),
            'ACADEMY_PLATFORM_FEE_BPS' => (string) ($input['stripe']['platform_fee_bps'] ?? '0'),
            'ACADEMY_DEFAULT_AFFILIATE_BPS' => (string) ($input['stripe']['affiliate_bps'] ?? '1000'),
            'ACADEMY_COMMERCE_CURRENCY' => strtoupper((string) ($input['stripe']['currency'] ?? 'EUR')),
            'ACADEMY_AI_PROVIDER' => (string) ($input['ai']['provider'] ?? 'disabled'),
            'ACADEMY_AI_MODEL' => (string) ($input['ai']['model'] ?? ''),
            'OPENAI_MODEL' => (string) ($input['ai']['openai_model'] ?? 'gpt-5.6-terra'),
            'OPENAI_BASE_URL' => 'https://api.openai.com/v1',
            'DEEPSEEK_MODEL' => (string) ($input['ai']['deepseek_model'] ?? 'deepseek-v4-pro'),
            'DEEPSEEK_BASE_URL' => 'https://api.deepseek.com',
            'DEEPSEEK_REASONING_EFFORT' => (string) ($input['ai']['reasoning_effort'] ?? 'high'),
            'ACADEMY_IMAGE_PROVIDER' => (string) ($input['ai']['image_provider'] ?? 'gemini'),
            'GEMINI_BASE_URL' => 'https://generativelanguage.googleapis.com',
            'GEMINI_IMAGE_MODEL' => (string) ($input['ai']['image_model'] ?? 'gemini-3.1-flash-lite-image'),
            'ACADEMY_IMAGE_SIZE' => (($input['ai']['image_model'] ?? 'gemini-3.1-flash-lite-image') === 'gemini-3.1-flash-lite-image')
                ? '1K'
                : (string) ($input['ai']['image_size'] ?? '1K'),
            'ACADEMY_IMAGE_PROMPT_PRESET' => (string) ($input['ai']['image_prompt_preset'] ?? 'academy-premium'),
            'ACADEMY_IMAGE_RESPECT_BRANDING' => 'true',
            'ACADEMY_IMAGE_AVOID_EMBEDDED_TEXT' => 'true',
            'ACADEMY_TUTOR_ENABLED' => $features['tutor'] ? 'true' : 'false',
            'ACADEMY_TUTOR_PROVIDER' => 'inherit',
            'ACADEMY_EMBEDDING_PROVIDER' => (string) ($input['ai']['embedding_provider'] ?? 'disabled'),
            'ACADEMY_EMBEDDING_MODEL' => (string) ($input['ai']['embedding_model'] ?? 'text-embedding-3-small'),
            'ACADEMY_BOOTSTRAP_OWNER_NAME' => (string) ($input['owner']['name'] ?? 'Academy Owner'),
            'ACADEMY_BOOTSTRAP_OWNER_EMAIL' => strtolower((string) ($input['owner']['email'] ?? '')),
        ];

        $secrets = array_filter([
            'APP_KEY' => 'base64:'.base64_encode(random_bytes(32)),
            'DB_PASSWORD' => bin2hex(random_bytes(24)),
            'ACADEMY_BOOTSTRAP_OWNER_PASSWORD' => (string) ($input['owner']['password'] ?? ''),
            'MAIL_PASSWORD' => (string) ($input['mail']['password'] ?? ''),
            'STRIPE_SECRET' => (string) ($input['stripe']['secret'] ?? ''),
            'STRIPE_WEBHOOK_SECRET' => (string) ($input['stripe']['webhook_secret'] ?? ''),
            'OPENAI_API_KEY' => (string) ($input['ai']['openai_api_key'] ?? ''),
            'DEEPSEEK_API_KEY' => (string) ($input['ai']['deepseek_api_key'] ?? ''),
            'GEMINI_API_KEY' => (string) ($input['ai']['gemini_api_key'] ?? ''),
            'TOWER_ACADEMY_MCP_TOKEN' => $features['tower'] ? 'num_mcp_'.Str::random(64) : '',
            'IMAGEKIT_PRIVATE_KEY' => (string) ($input['media']['imagekit_private_key'] ?? ''),
        ], fn ($value) => $value !== '');

        foreach (['IMAGEKIT_PUBLIC_KEY','IMAGEKIT_ENDPOINT_URL'] as $key) {
            $sourceKey = strtolower($key);
            if (! empty($input['media'][$sourceKey])) {
                $environment[$key] = (string) $input['media'][$sourceKey];
            }
        }

        return [
            'blueprint' => [
                'slug' => $slug,
                'domain' => $domain,
                'template' => $template['key'],
                'capability_profile' => $capabilityProfile,
                'features' => $features,
                'learning' => $learning,
                'theme' => $theme,
                'environment' => $environment,
                'source' => [
                    'mode' => config('factory.coolify.source_mode'),
                    'repository' => config('factory.coolify.git_repository'),
                    'branch' => config('factory.coolify.git_branch'),
                    'compose_location' => config('factory.coolify.compose_location'),
                ],
            ],
            'secrets' => $secrets,
        ];
    }
}
