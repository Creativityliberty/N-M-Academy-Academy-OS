<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Public\BecomeTrainer\WebhookController as TrainerWebhookController;
use App\Http\Controllers\Public\Courses\WebhookController as CoursesWebhookController;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use Symfony\Component\HttpFoundation\Response;

class WebhookController extends CashierWebhookController
{
    public function __construct(
        private readonly TrainerWebhookController $trainerWebhook,
        private readonly CoursesWebhookController $coursesWebhook,
    ) {
        parent::__construct();
    }

    public function handleCheckoutSessionCompleted(array $payload): Response
    {
        $type = $payload['data']['object']['metadata']['type'] ?? null;

        return match ($type) {
            'trainer_subscription' => $this->trainerWebhook->handleCheckoutSessionCompleted($payload),
            'course_purchase', 'academy_course_checkout' => $this->coursesWebhook->handleCheckoutSessionCompleted($payload),
            default => $this->successMethod(),
        };
    }
    public function handleCustomerSubscriptionUpdated(array $payload): Response
    {
        return $this->coursesWebhook->handleCustomerSubscriptionUpdated($payload);
    }

    public function handleCustomerSubscriptionDeleted(array $payload): Response
    {
        return $this->coursesWebhook->handleCustomerSubscriptionDeleted($payload);
    }

    public function handleInvoicePaid(array $payload): Response
    {
        return $this->coursesWebhook->handleInvoicePaid($payload);
    }

    public function handleRefundUpdated(array $payload): Response
    {
        return $this->coursesWebhook->handleRefundUpdated($payload);
    }

    public function handleRefundFailed(array $payload): Response
    {
        return $this->coursesWebhook->handleRefundUpdated($payload);
    }

}
