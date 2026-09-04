import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/sales/coupons',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
export const toggle = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/trainer/sales/coupons/{coupon}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
toggle.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { coupon: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            coupon: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        coupon: typeof args.coupon === 'object'
        ? args.coupon.id
        : args.coupon,
    }

    return toggle.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
toggle.patch = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
const toggleForm = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
toggleForm.patch = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle.form = toggleForm

const coupons = {
    store: Object.assign(store, store),
    toggle: Object.assign(toggle, toggle),
}

export default coupons