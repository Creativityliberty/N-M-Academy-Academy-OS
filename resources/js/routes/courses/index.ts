import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import purchase from './purchase'
/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::index
* @see app/Http/Controllers/Public/Courses/CourseController.php:21
* @route '/courses'
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
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/courses/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
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
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\Courses\CourseController::show
* @see app/Http/Controllers/Public/Courses/CourseController.php:34
* @route '/courses/{id}'
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
* @see \App\Http\Controllers\Public\Courses\CheckoutController::checkout
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/courses/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::checkout
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::checkout
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::checkout
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\Courses\CheckoutController::checkout
* @see app/Http/Controllers/Public/Courses/CheckoutController.php:27
* @route '/courses/checkout'
*/
checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

checkout.form = checkoutForm

const courses = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    checkout: Object.assign(checkout, checkout),
    purchase: Object.assign(purchase, purchase),
}

export default courses