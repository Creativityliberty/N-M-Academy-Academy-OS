<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Plans;

use App\Enums\PlanCurrencyEnum;
use App\Enums\PlanIntervalEnum;
use App\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Plan::class) ?? false;
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
