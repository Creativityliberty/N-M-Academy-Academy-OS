import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\WebhookController::webhook
* @see app/Http/Controllers/Public/WebhookController.php:40
* @route '/stripe/webhook'
*/
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: '/stripe/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\WebhookController::webhook
* @see app/Http/Controllers/Public/WebhookController.php:40
* @route '/stripe/webhook'
*/
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\WebhookController::webhook
* @see app/Http/Controllers/Public/WebhookController.php:40
* @route '/stripe/webhook'
*/
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\WebhookController::webhook
* @see app/Http/Controllers/Public/WebhookController.php:40
* @route '/stripe/webhook'
*/
const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: webhook.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\WebhookController::webhook
* @see app/Http/Controllers/Public/WebhookController.php:40
* @route '/stripe/webhook'
*/
webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: webhook.url(options),
    method: 'post',
})

webhook.form = webhookForm

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
export const payment = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/stripe/payment/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
payment.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: args.payment,
    }

    return payment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
payment.get = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
payment.head = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
const paymentForm = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
paymentForm.get = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::payment
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
paymentForm.head = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payment.form = paymentForm

const cashier = {
    webhook: Object.assign(webhook, webhook),
    payment: Object.assign(payment, payment),
}

export default cashier