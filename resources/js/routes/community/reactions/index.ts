import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Community\CommunityReactionController::store
* @see app/Http/Controllers/Community/CommunityReactionController.php:17
* @route '/communaute/forum/reactions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/communaute/forum/reactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Community\CommunityReactionController::store
* @see app/Http/Controllers/Community/CommunityReactionController.php:17
* @route '/communaute/forum/reactions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityReactionController::store
* @see app/Http/Controllers/Community/CommunityReactionController.php:17
* @route '/communaute/forum/reactions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityReactionController::store
* @see app/Http/Controllers/Community/CommunityReactionController.php:17
* @route '/communaute/forum/reactions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityReactionController::store
* @see app/Http/Controllers/Community/CommunityReactionController.php:17
* @route '/communaute/forum/reactions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const reactions = {
    store: Object.assign(store, store),
}

export default reactions