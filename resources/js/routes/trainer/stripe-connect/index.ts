import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/trainer/stripe-connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::edit
* @see app/Http/Controllers/Trainer/StripeConnectController.php:16
* @route '/trainer/stripe-connect'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
export const onboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: onboard.url(options),
    method: 'get',
})

onboard.definition = {
    methods: ["get","head"],
    url: '/trainer/stripe-connect/onboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
onboard.url = (options?: RouteQueryOptions) => {
    return onboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
onboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: onboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
onboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: onboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
const onboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: onboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
onboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: onboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::onboard
* @see app/Http/Controllers/Trainer/StripeConnectController.php:26
* @route '/trainer/stripe-connect/onboard'
*/
onboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: onboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

onboard.form = onboardForm

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
export const returnMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(options),
    method: 'get',
})

returnMethod.definition = {
    methods: ["get","head"],
    url: '/trainer/stripe-connect/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
returnMethod.url = (options?: RouteQueryOptions) => {
    return returnMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
returnMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
returnMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: returnMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
const returnMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: returnMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
returnMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: returnMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::returnMethod
* @see app/Http/Controllers/Trainer/StripeConnectController.php:60
* @route '/trainer/stripe-connect/return'
*/
returnMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: returnMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

returnMethod.form = returnMethodForm

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::disconnect
* @see app/Http/Controllers/Trainer/StripeConnectController.php:79
* @route '/trainer/stripe-connect'
*/
export const disconnect = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnect.url(options),
    method: 'delete',
})

disconnect.definition = {
    methods: ["delete"],
    url: '/trainer/stripe-connect',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::disconnect
* @see app/Http/Controllers/Trainer/StripeConnectController.php:79
* @route '/trainer/stripe-connect'
*/
disconnect.url = (options?: RouteQueryOptions) => {
    return disconnect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::disconnect
* @see app/Http/Controllers/Trainer/StripeConnectController.php:79
* @route '/trainer/stripe-connect'
*/
disconnect.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnect.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::disconnect
* @see app/Http/Controllers/Trainer/StripeConnectController.php:79
* @route '/trainer/stripe-connect'
*/
const disconnectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: disconnect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\StripeConnectController::disconnect
* @see app/Http/Controllers/Trainer/StripeConnectController.php:79
* @route '/trainer/stripe-connect'
*/
disconnectForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: disconnect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

disconnect.form = disconnectForm

const stripeConnect = {
    edit: Object.assign(edit, edit),
    onboard: Object.assign(onboard, onboard),
    return: Object.assign(returnMethod, returnMethod),
    disconnect: Object.assign(disconnect, disconnect),
}

export default stripeConnect