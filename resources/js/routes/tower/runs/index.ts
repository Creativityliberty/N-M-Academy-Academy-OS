import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/runs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\RunController::index
* @see app/MissionTower/Http/Controllers/RunController.php:18
* @route '/tower/runs'
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

const runs = {
    index: Object.assign(index, index),
}

export default runs