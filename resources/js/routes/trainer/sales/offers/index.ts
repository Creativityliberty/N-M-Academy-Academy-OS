import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/sales/offers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
export const toggle = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/trainer/sales/offers/{offer}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
toggle.url = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { offer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.id
        : args.offer,
    }

    return toggle.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
toggle.patch = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
const toggleForm = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
toggleForm.patch = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle.form = toggleForm

const offers = {
    store: Object.assign(store, store),
    toggle: Object.assign(toggle, toggle),
}

export default offers