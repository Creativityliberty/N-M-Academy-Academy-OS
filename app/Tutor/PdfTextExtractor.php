<?php

declare(strict_types=1);

namespace App\Tutor;

use Illuminate\Support\Facades\Http;

class PdfTextExtractor
{
    public function extract(?string $url): ?string
    {
        if (! is_string($url) || trim($url) === '') {
            return null;
        }

        $path = $this->localPath($url);
        $temporaryPdf = null;

        if (! $path) {
            $temporaryPdf = $this->downloadTrustedRemote($url);
            $path = $temporaryPdf;
        }

        if (! $path || ! is_file($path)) {
            return null;
        }

        $binary = trim((string) shell_exec('command -v pdftotext 2>/dev/null'));

        if ($binary === '') {
            if ($temporaryPdf) {
                @unlink($temporaryPdf);
            }

            return null;
        }

        $output = tempnam(sys_get_temp_dir(), 'academy_pdf_text_');

        if ($output === false) {
            if ($temporaryPdf) {
                @unlink($temporaryPdf);
            }

            return null;
        }

        @unlink($output);
        $output .= '.txt';

        $command = escapeshellcmd($binary)
            .' -layout '
            .escapeshellarg($path)
            .' '
            .escapeshellarg($output)
            .' 2>/dev/null';

        shell_exec($command);

        $text = is_file($output) ? trim((string) file_get_contents($output)) : '';

        @unlink($output);

        if ($temporaryPdf) {
            @unlink($temporaryPdf);
        }

        return $text === ''
            ? null
            : mb_substr($text, 0, (int) config('academy-tutor.pdf.max_text_chars', 200000));
    }

    private function localPath(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;

        if (! str_starts_with($path, '/storage/')) {
            return null;
        }

        $relative = ltrim(substr($path, strlen('/storage/')), '/');
        $candidate = storage_path('app/public/'.$relative);
        $base = realpath(storage_path('app/public'));
        $real = realpath($candidate);

        if (! $base || ! $real || ! str_starts_with($real, $base.DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $real;
    }

    private function downloadTrustedRemote(string $url): ?string
    {
        $endpoint = rtrim((string) config('filesystems.disks.imagekit.endpoint_url'), '/');

        if ($endpoint === '' || ! $this->isTrustedImageKitUrl($url, $endpoint)) {
            return null;
        }

        $response = Http::accept('application/pdf')
            ->timeout(20)
            ->retry(2, 250)
            ->get($url);

        if (! $response->successful()) {
            return null;
        }

        $body = $response->body();
        $maxBytes = (int) config('academy-tutor.pdf.max_bytes', 52428800);

        if ($body === '' || strlen($body) > $maxBytes) {
            return null;
        }

        $tmp = tempnam(sys_get_temp_dir(), 'academy_pdf_source_');

        if ($tmp === false) {
            return null;
        }

        if (file_put_contents($tmp, $body) === false) {
            @unlink($tmp);

            return null;
        }

        return $tmp;
    }

    private function isTrustedImageKitUrl(string $url, string $endpoint): bool
    {
        $urlParts = parse_url($url);
        $endpointParts = parse_url($endpoint);

        if (! is_array($urlParts) || ! is_array($endpointParts)) {
            return false;
        }

        $urlScheme = strtolower((string) ($urlParts['scheme'] ?? ''));
        $endpointScheme = strtolower((string) ($endpointParts['scheme'] ?? ''));
        $urlHost = strtolower((string) ($urlParts['host'] ?? ''));
        $endpointHost = strtolower((string) ($endpointParts['host'] ?? ''));
        $urlPort = (int) ($urlParts['port'] ?? ($urlScheme === 'https' ? 443 : 80));
        $endpointPort = (int) ($endpointParts['port'] ?? ($endpointScheme === 'https' ? 443 : 80));

        if (
            $urlScheme === ''
            || ! in_array($urlScheme, ['http', 'https'], true)
            || $urlScheme !== $endpointScheme
            || $urlHost === ''
            || $urlHost !== $endpointHost
            || $urlPort !== $endpointPort
        ) {
            return false;
        }

        $basePath = rtrim((string) ($endpointParts['path'] ?? ''), '/');
        $urlPath = (string) ($urlParts['path'] ?? '');

        return $basePath === ''
            || $urlPath === $basePath
            || str_starts_with($urlPath, $basePath.'/');
    }
}
