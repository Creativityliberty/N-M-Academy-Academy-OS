import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Community\CommunityCommentController::store
* @see app/Http/Controllers/Community/CommunityCommentController.php:14
* @route '/communaute/forum/posts/{post}/comments'
*/
export const store = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/communaute/forum/posts/{post}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Community\CommunityCommentController::store
* @see app/Http/Controllers/Community/CommunityCommentController.php:14
* @route '/communaute/forum/posts/{post}/comments'
*/
store.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityCommentController::store
* @see app/Http/Controllers/Community/CommunityCommentController.php:14
* @route '/communaute/forum/posts/{post}/comments'
*/
store.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityCommentController::store
* @see app/Http/Controllers/Community/CommunityCommentController.php:14
* @route '/communaute/forum/posts/{post}/comments'
*/
const storeForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityCommentController::store
* @see app/Http/Controllers/Community/CommunityCommentController.php:14
* @route '/communaute/forum/posts/{post}/comments'
*/
storeForm.post = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
export const moderate = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: moderate.url(args, options),
    method: 'patch',
})

moderate.definition = {
    methods: ["patch"],
    url: '/communaute/forum/comments/{comment}/moderation',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
moderate.url = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return moderate.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
moderate.patch = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: moderate.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::moderate
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
const moderateForm = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
moderateForm.patch = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: moderate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

moderate.form = moderateForm

const comments = {
    store: Object.assign(store, store),
    moderate: Object.assign(moderate, moderate),
}

export default comments