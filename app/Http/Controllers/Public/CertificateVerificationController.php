<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CourseCertificate;
use App\Services\Certificates\CertificatePdfService;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class CertificateVerificationController extends Controller
{
    public function show(string $verificationCode): Response
    {
        abort_unless((bool) config('academy.features.certificates', true) && (bool) config('academy.learning.certificates.public_verification', true), 404);
        $certificate = $this->certificate($verificationCode);

        return Inertia::render('public/certificates/verify', [
            'certificate' => [
                'recipientName' => $certificate->recipient_name,
                'courseTitle' => $certificate->course_title,
                'issuerName' => $certificate->issuer_name,
                'certificateTitle' => $certificate->certificate_title,
                'verificationCode' => $certificate->verification_code,
                'issuedAt' => $certificate->issued_at?->toIso8601String(),
                'revokedAt' => $certificate->revoked_at?->toIso8601String(),
                'valid' => $certificate->revoked_at === null,
                'pdfUrl' => route('certificates.verify.pdf', $certificate->verification_code),
            ],
        ]);
    }

    public function pdf(string $verificationCode, CertificatePdfService $pdf): HttpResponse
    {
        abort_unless((bool) config('academy.features.certificates', true) && (bool) config('academy.learning.certificates.public_verification', true) && (bool) config('academy.learning.certificates.pdf_download', true), 404);
        $certificate = $this->certificate($verificationCode);
        $bytes = $pdf->render($certificate);
        $filename = 'certificat-'.$certificate->verification_code.'.pdf';

        return response($bytes, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }

    private function certificate(string $verificationCode): CourseCertificate
    {
        return CourseCertificate::query()
            ->where('verification_code', $verificationCode)
            ->firstOrFail();
    }
}
