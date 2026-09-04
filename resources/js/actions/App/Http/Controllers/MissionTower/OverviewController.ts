import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::index
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
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

const OverviewController = { index }

export default OverviewController