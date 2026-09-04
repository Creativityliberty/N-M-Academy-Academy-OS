<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);

$fail = static function (string $message): never {
    fwrite(STDERR, "M15.1.1 FAIL: {$message}\n");
    exit(1);
};

$read = static function (string $path) use ($root, $fail): string {
    $fullPath = $root.'/'.$path;
    if (! is_file($fullPath)) {
        $fail("Missing file: {$path}");
    }

    $contents = file_get_contents($fullPath);
    if ($contents === false) {
        $fail("Unable to read: {$path}");
    }

    return $contents;
};

$version = '1.6.1';

foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    if (trim($read($path)) !== $version) {
        $fail("{$path} must be exactly {$version}");
    }
}

$package = json_decode($read('package.json'), true, flags: JSON_THROW_ON_ERROR);
if (($package['version'] ?? null) !== $version) {
    $fail("package.json version must be {$version}");
}
if (($package['engines']['node'] ?? null) !== '>=24.0.0') {
    $fail('package.json must declare Node >=24.0.0');
}

$config = $read('config/academy.php');
if (! str_contains($config, "env('ACADEMY_VERSION', '{$version}')")) {
    $fail('config/academy.php fallback version is stale');
}

foreach (['.env.example', '.env.coolify.example', '.env.num-academy.example'] as $path) {
    $env = $read($path);
    if (! str_contains($env, "ACADEMY_VERSION={$version}")) {
        $fail("{$path} does not advertise {$version}");
    }
    if (str_contains($env, 'ACADEMY_VERSION=1.5.2')) {
        $fail("{$path} still advertises 1.5.2");
    }
}

foreach (['num-academy', 'num-academy.ps1'] as $path) {
    $launcher = $read($path);
    if (! str_contains($launcher, $version)) {
        $fail("{$path} launcher does not stamp {$version}");
    }
}

$resolver = $read('app/PageBuilder/PageSectionResolver.php');
if (! str_contains($resolver, "->withCount('enrollments')")) {
    $fail('PageSectionResolver must count enrollments in SQL');
}
if (str_contains($resolver, "'enrollments',")) {
    $fail('PageSectionResolver must not eager-load the enrollment collection for a count');
}
if (! str_contains($resolver, '$course->enrollments_count')) {
    $fail('PageSectionResolver must use enrollments_count');
}

$renderer = $read('resources/js/components/page-builder/page-renderer.tsx');
if (! str_contains($renderer, "import { useClipboard } from '@/hooks/use-clipboard';")) {
    $fail('Page renderer must reuse the shared clipboard hook');
}
if (str_contains($renderer, 'navigator.clipboard.writeText')) {
    $fail('Page renderer still bypasses the shared clipboard hook');
}

foreach ([
    'storage/framework/cache/.gitignore',
    'storage/framework/cache/data/.gitignore',
    'storage/framework/sessions/.gitignore',
    'storage/framework/views/.gitignore',
    'storage/logs/.gitignore',
] as $path) {
    $read($path);
}

$dockerfile = $read('Dockerfile');
if (! str_contains($dockerfile, 'FROM node:24-alpine AS node-runtime')) {
    $fail('Docker production path must use the Node 24 baseline');
}
if (str_contains($dockerfile, 'apk add --no-cache nodejs npm')) {
    $fail('Dockerfile must not fall back to Alpine Node 22/npm 10');
}
$runtimeDirectories = strpos($dockerfile, 'storage/framework/views');
$assetBuild = strpos($dockerfile, 'RUN npm run build:ssr');
if ($runtimeDirectories === false || $assetBuild === false || $runtimeDirectories > $assetBuild) {
    $fail('Docker must create Laravel runtime cache directories before Wayfinder/Vite build');
}

$workflow = $read('.github/workflows/tests.yml');
if (! str_contains($workflow, 'tests/Contract')) {
    $fail('CI must use the case-sensitive tests/Contract path');
}
if (str_contains($workflow, 'tests/contracts')) {
    $fail('CI still contains the invalid tests/contracts Linux path');
}

$composer = json_decode($read('composer.json'), true, flags: JSON_THROW_ON_ERROR);
if (($composer['require']['php'] ?? null) !== '^8.4') {
    $fail('composer.json must keep PHP ^8.4 aligned with the locked Symfony baseline');
}
if (($package['dependencies']['thinking-orbs'] ?? null) !== '^0.3.1') {
    $fail('thinking-orbs must remain on ^0.3.1');
}

fwrite(STDOUT, "M15.1.1 GitHub baseline hardening contract PASS\n");
