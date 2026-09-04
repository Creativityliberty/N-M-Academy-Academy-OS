<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Plans;

use App\Enums\PlanCurrencyEnum;
use App\Enums\PlanIntervalEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('plan')) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:1'],
            'currency' => ['required', Rule::enum(PlanCurrencyEnum::class)],
            'interval' => ['required', Rule::enum(PlanIntervalEnum::class)],
            'features' => ['required', 'array', 'min:1'],
            'features.*' => ['required', 'string', 'max:255'],
            'highlight' => ['boolean'],
            'is_active' => ['boolean'],
        ];
    }
}
