import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
export const show = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/stripe/payment/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
show.url = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
show.get = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
show.head = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
const showForm = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
showForm.get = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\PaymentController::show
* @see app/Http/Controllers/Public/BecomeTrainer/PaymentController.php:30
* @route '/stripe/payment/{payment}'
*/
showForm.head = (args: { payment: string | number } | [payment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const PaymentController = { show }

export default PaymentController