<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\Courses;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\Commerce\CommerceWebhookService;
use Symfony\Component\HttpFoundation\Response;

class WebhookController extends Controller
{
    public function __construct(private readonly CommerceWebhookService $commerce) {}

    public function handleCheckoutSessionCompleted(array $payload): Response
    {
        $session = $payload['data']['object'] ?? [];
        $metadata = $session['metadata'] ?? [];

        if (! empty($metadata['order_id'])) {
            $this->commerce->checkoutCompleted($session);
        } else {
            // Backward-compatible projection for pre-M10 checkout sessions.
            $studentId = $metadata['student_id'] ?? null;
            $courseId = $metadata['course_id'] ?? null;
            if ($studentId && $courseId) {
                Enrollment::updateOrCreate(
                    ['user_id'=>$studentId,'course_id'=>$courseId],
                    [
                        'access_rank'=>100,
                        'stripe_payment_intent_id'=>$session['payment_intent'] ?? null,
                        'amount_paid'=>isset($session['amount_total']) ? ((int)$session['amount_total'])/100 : null,
                        'currency'=>isset($session['currency']) ? strtoupper((string)$session['currency']) : null,
                        'paid_at'=>isset($session['created']) ? now()->setTimestamp((int)$session['created']) : now(),
                        'enrolled_at'=>now(),
                    ],
                );
                User::find($studentId)?->assignRole(RoleEnum::Student->value);
            }
        }

        return response('',200);
    }

    public function handleCustomerSubscriptionUpdated(array $payload): Response
    {
        $this->commerce->subscriptionUpdated($payload['data']['object'] ?? []);
        return response('',200);
    }

    public function handleCustomerSubscriptionDeleted(array $payload): Response
    {
        $this->commerce->subscriptionDeleted($payload['data']['object'] ?? []);
        return response('',200);
    }

    public function handleInvoicePaid(array $payload): Response
    {
        $this->commerce->invoicePaid($payload['data']['object'] ?? []);
        return response('',200);
    }

    public function handleRefundUpdated(array $payload): Response
    {
        $this->commerce->refundUpdated($payload['data']['object'] ?? []);
        return response('',200);
    }
}
