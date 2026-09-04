import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AnalyticsController::index
* @see app/Http/Controllers/Trainer/AnalyticsController.php:15
* @route '/trainer/analytics'
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

const AnalyticsController = { index }

export default AnalyticsController