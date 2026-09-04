<?php

return [
    'platform_fee_bps' => (int) env('ACADEMY_PLATFORM_FEE_BPS', 1500),
    'default_affiliate_bps' => (int) env('ACADEMY_DEFAULT_AFFILIATE_BPS', 1000),
    'currency' => env('ACADEMY_COMMERCE_CURRENCY', 'EUR'),
    'refund_confirmation_prefix' => env('ACADEMY_REFUND_CONFIRMATION_PREFIX', 'REFUND ORDER'),
];
