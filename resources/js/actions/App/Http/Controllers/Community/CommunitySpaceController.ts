import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Community\CommunitySpaceController::store
* @see app/Http/Controllers/Community/CommunitySpaceController.php:18
* @route '/communaute/forum/spaces'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/communaute/forum/spaces',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Community\CommunitySpaceController::store
* @see app/Http/Controllers/Community/CommunitySpaceController.php:18
* @route '/communaute/forum/spaces'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunitySpaceController::store
* @see app/Http/Controllers/Community/CommunitySpaceController.php:18
* @route '/communaute/forum/spaces'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunitySpaceController::store
* @see app/Http/Controllers/Community/CommunitySpaceController.php:18
* @route '/communaute/forum/spaces'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunitySpaceController::store
* @see app/Http/Controllers/Community/CommunitySpaceController.php:18
* @route '/communaute/forum/spaces'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const CommunitySpaceController = { store }

export default CommunitySpaceController