import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/become-trainer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::checkout
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:22
* @route '/become-trainer/checkout'
*/
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/become-trainer/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::checkout
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:22
* @route '/become-trainer/checkout'
*/
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::checkout
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:22
* @route '/become-trainer/checkout'
*/
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::checkout
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:22
* @route '/become-trainer/checkout'
*/
const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\CheckoutController::checkout
* @see app/Http/Controllers/Public/BecomeTrainer/CheckoutController.php:22
* @route '/become-trainer/checkout'
*/
checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

checkout.form = checkoutForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
export const success = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})

success.definition = {
    methods: ["get","head"],
    url: '/become-trainer/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
success.url = (options?: RouteQueryOptions) => {
    return success.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
success.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
success.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
const successForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: success.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
successForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: success.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
successForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: success.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

success.form = successForm

const becomeTrainer = {
    index: Object.assign(index, index),
    checkout: Object.assign(checkout, checkout),
    success: Object.assign(success, success),
}

export default becomeTrainer