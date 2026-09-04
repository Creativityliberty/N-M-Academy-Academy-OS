import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
export const moderate = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: moderate.url(args, options),
    method: 'patch',
})

moderate.definition = {
    methods: ["patch"],
    url: '/communaute/forum/posts/{post}/moderation',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
moderate.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { post: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: typeof args.post === 'object'
        ? args.post.id
        : args.post,
    }

    return moderate.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
moderate.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: moderate.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
const moderateForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: moderate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
moderateForm.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: moderate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

moderate.form = moderateForm

const posts = {
    store: Object.assign(store, store),
    moderate: Object.assign(moderate, moderate),
}

export default posts