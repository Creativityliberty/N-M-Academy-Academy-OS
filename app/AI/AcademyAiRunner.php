<?php

declare(strict_types=1);

namespace App\AI;

use App\Models\AcademyAiRun;
use App\Models\User;
use Throwable;

class AcademyAiRunner
{
    public function __construct(
        private readonly AcademyAiCapabilityRegistry $registry,
        private readonly AiProviderManager $providers,
    ) {}

    public function run(User $trainer, string $capabilityName, string $prompt, array $input = []): AcademyAiRun
    {
        $capability = $this->registry->get($capabilityName);
        $provider = $this->providers->provider();

        $run = AcademyAiRun::create([
            'user_id' => $trainer->id,
            'capability' => $capability->name(),
            'mode' => $capability->mode(),
            'prompt' => $prompt,
            'input' => $input,
            'provider' => $provider->name(),
            'model' => $provider->model(),
            'status' => 'pending',
        ]);

        try {
            $output = $capability->execute($trainer, $prompt, $input, $provider);
            $run->update(['output' => $output, 'status' => 'succeeded']);
        } catch (Throwable $error) {
            $run->update([
                'status' => 'failed',
                'error_message' => mb_substr($error->getMessage(), 0, 4000),
            ]);
            throw $error;
        }

        return $run->fresh();
    }
}
