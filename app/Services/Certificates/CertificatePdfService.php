<?php

declare(strict_types=1);

namespace App\Services\Certificates;

use App\Models\CourseCertificate;
use Carbon\CarbonInterface;

class CertificatePdfService
{
    public function render(CourseCertificate $certificate): string
    {
        $verifyUrl = url('/certificates/verify/'.$certificate->verification_code);
        $status = $certificate->revoked_at ? 'CERTIFICAT RÉVOQUÉ' : 'CERTIFICAT VALIDE';
        $issued = $certificate->issued_at instanceof CarbonInterface
            ? $certificate->issued_at->locale('fr')->translatedFormat('d F Y')
            : (string) $certificate->issued_at;

        $content = implode("\n", [
            'q 1.5 w 55 45 732 505 re S Q',
            $this->text(421, 520, 15, $certificate->issuer_name, true),
            $this->text(421, 465, 28, $certificate->certificate_title, true),
            $this->text(421, 410, 12, 'Ce certificat atteste que', true),
            $this->text(421, 365, 25, $certificate->recipient_name, true),
            $this->text(421, 320, 12, 'a satisfait aux exigences de la formation', true),
            $this->text(421, 280, 20, $certificate->course_title, true),
            $this->text(421, 220, 11, 'Délivré le '.$issued, true),
            $this->text(421, 180, 10, $status, true),
            $this->text(421, 135, 9, 'Code de vérification : '.$certificate->verification_code, true),
            $this->text(421, 110, 8, $verifyUrl, true),
        ]);

        return $this->pdf($content);
    }

    private function text(float $x, float $y, int $size, string $text, bool $center = false): string
    {
        $encoded = $this->winAnsi($text); // Windows-1252 / WinAnsiEncoding, no bundled font file.
        $escaped = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $encoded);
        if ($center) {
            $estimatedWidth = strlen($encoded) * $size * 0.48;
            $x -= $estimatedWidth / 2;
        }

        return sprintf("BT /F1 %d Tf 1 0 0 1 %.2F %.2F Tm (%s) Tj ET", $size, max(60, $x), $y, $escaped);
    }

    private function winAnsi(string $value): string
    {
        $encoded = iconv('UTF-8', 'Windows-1252//TRANSLIT//IGNORE', $value);
        if ($encoded !== false) {
            return $encoded;
        }

        return preg_replace('/[^\x20-\x7E]/', '?', $value) ?? $value;
    }

    private function pdf(string $content): string
    {
        $objects = [
            1 => '<< /Type /Catalog /Pages 2 0 R >>',
            2 => '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            3 => '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
            4 => '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
            5 => "<< /Length ".strlen($content)." >>\nstream\n{$content}\nendstream",
        ];

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
        $offsets = [0 => 0];
        foreach ($objects as $number => $body) {
            $offsets[$number] = strlen($pdf);
            $pdf .= "{$number} 0 obj\n{$body}\nendobj\n";
        }

        $xref = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n";
        $pdf .= "0000000000 65535 f \n";
        foreach (array_keys($objects) as $number) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$number]);
        }
        $pdf .= "trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";

        return $pdf;
    }
}
