import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Community\CommunityPostController::store
* @see app/Http/Controllers/Community/CommunityPostController.php:18
* @route '/communaute/forum/posts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/communaute/forum/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Community\CommunityPostController::store
* @see app/Http/Controllers/Community/CommunityPostController.php:18
* @route '/communaute/forum/posts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityPostController::store
* @see app/Http/Controllers/Community/CommunityPostController.php:18
* @route '/communaute/forum/posts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityPostController::store
* @see app/Http/Controllers/Community/CommunityPostController.php:18
* @route '/communaute/forum/posts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityPostController::store
* @see app/Http/Controllers/Community/CommunityPostController.php:18
* @route '/communaute/forum/posts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const CommunityPostController = { store }

export default CommunityPostController