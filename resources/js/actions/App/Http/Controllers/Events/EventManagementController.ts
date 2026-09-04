import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Events\EventManagementController::store
* @see app/Http/Controllers/Events/EventManagementController.php:16
* @route '/communaute/evenements'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/communaute/evenements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Events\EventManagementController::store
* @see app/Http/Controllers/Events/EventManagementController.php:16
* @route '/communaute/evenements'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Events\EventManagementController::store
* @see app/Http/Controllers/Events/EventManagementController.php:16
* @route '/communaute/evenements'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Events\EventManagementController::store
* @see app/Http/Controllers/Events/EventManagementController.php:16
* @route '/communaute/evenements'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Events\EventManagementController::store
* @see app/Http/Controllers/Events/EventManagementController.php:16
* @route '/communaute/evenements'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Events\EventManagementController::cancel
* @see app/Http/Controllers/Events/EventManagementController.php:66
* @route '/communaute/evenements/{event}/cancel'
*/
export const cancel = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/communaute/evenements/{event}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Events\EventManagementController::cancel
* @see app/Http/Controllers/Events/EventManagementController.php:66
* @route '/communaute/evenements/{event}/cancel'
*/
cancel.url = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { event: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { event: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            event: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        event: typeof args.event === 'object'
        ? args.event.id
        : args.event,
    }

    return cancel.definition.url
            .replace('{event}', parsedArgs.event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Events\EventManagementController::cancel
* @see app/Http/Controllers/Events/EventManagementController.php:66
* @route '/communaute/evenements/{event}/cancel'
*/
cancel.patch = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Events\EventManagementController::cancel
* @see app/Http/Controllers/Events/EventManagementController.php:66
* @route '/communaute/evenements/{event}/cancel'
*/
const cancelForm = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Events\EventManagementController::cancel
* @see app/Http/Controllers/Events/EventManagementController.php:66
* @route '/communaute/evenements/{event}/cancel'
*/
cancelForm.patch = (args: { event: number | { id: number } } | [event: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

cancel.form = cancelForm

const EventManagementController = { store, cancel }

export default EventManagementController