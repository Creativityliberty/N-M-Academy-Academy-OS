import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/sales/affiliates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::store
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
export const toggle = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/trainer/sales/affiliates/{affiliate}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
toggle.url = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { affiliate: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { affiliate: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            affiliate: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        affiliate: typeof args.affiliate === 'object'
        ? args.affiliate.id
        : args.affiliate,
    }

    return toggle.definition.url
            .replace('{affiliate}', parsedArgs.affiliate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
toggle.patch = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggle
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
const toggleForm = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
toggleForm.patch = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle.form = toggleForm

const affiliates = {
    store: Object.assign(store, store),
    toggle: Object.assign(toggle, toggle),
}

export default affiliates