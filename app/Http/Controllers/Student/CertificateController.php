<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseCertificate;
use App\Services\Certificates\CertificatePdfService;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $publicVerificationEnabled = (bool) config('academy.learning.certificates.public_verification', true);
        $pdfDownloadEnabled = (bool) config('academy.learning.certificates.pdf_download', true);
        $sharingEnabled = $publicVerificationEnabled && (bool) config('academy.learning.certificates.student_sharing', true);

        $certificates = CourseCertificate::query()
            ->where('user_id', $request->user()->id)
            ->latest('issued_at')
            ->get();

        return Inertia::render('student/certificates/index', [
            'publicVerificationEnabled' => $publicVerificationEnabled,
            'pdfDownloadEnabled' => $pdfDownloadEnabled,
            'sharingEnabled' => $sharingEnabled,
            'certificates' => $certificates->map(fn (CourseCertificate $certificate) => [
                'id' => $certificate->id,
                'courseTitle' => $certificate->course_title,
                'certificateTitle' => $certificate->certificate_title,
                'issuerName' => $certificate->issuer_name,
                'verificationCode' => $certificate->verification_code,
                'issuedAt' => $certificate->issued_at?->toIso8601String(),
                'revokedAt' => $certificate->revoked_at?->toIso8601String(),
                'verifyUrl' => $publicVerificationEnabled ? url('/certificates/verify/'.$certificate->verification_code) : null,
                'pdfUrl' => $pdfDownloadEnabled ? route('student.certificates.pdf', $certificate) : null,
            ])->values(),
        ]);
    }

    public function pdf(Request $request, CourseCertificate $certificate, CertificatePdfService $pdf): HttpResponse
    {
        abort_unless((bool) config('academy.learning.certificates.pdf_download', true), 404);
        abort_unless((int) $certificate->user_id === (int) $request->user()->id, 404);

        $bytes = $pdf->render($certificate);
        $filename = 'certificat-'.$certificate->verification_code.'.pdf';

        return response($bytes, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
            'Cache-Control' => 'private, no-store',
        ]);
    }
}
