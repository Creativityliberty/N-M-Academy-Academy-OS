import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/communaute/forum',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::index
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
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

const CommunityController = { index }

export default CommunityController