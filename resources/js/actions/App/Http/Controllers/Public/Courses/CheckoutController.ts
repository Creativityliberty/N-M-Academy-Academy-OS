import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/courses/{id}/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::show
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:20
* @route '/courses/{id}/checkout'
*/
showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::store
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/courses/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::store
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::store
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::store
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::store
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const CheckoutController = { show, store }

export default CheckoutController