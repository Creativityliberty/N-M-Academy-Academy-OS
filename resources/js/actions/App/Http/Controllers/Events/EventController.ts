import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/communaute/evenements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Events\EventController::index
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
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

const EventController = { index }

export default EventController