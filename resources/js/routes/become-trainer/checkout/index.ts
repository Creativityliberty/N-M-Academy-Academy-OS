import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
export const show = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/become-trainer/checkout/{plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
show.url = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

    if (Array.isArray(args)) {
        args = {
            plan: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        plan: args.plan,
    }

    return show.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
show.get = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
show.head = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
const showForm = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
showForm.get = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::show
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:13
* @route '/become-trainer/checkout/{plan}'
*/
showForm.head = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm
