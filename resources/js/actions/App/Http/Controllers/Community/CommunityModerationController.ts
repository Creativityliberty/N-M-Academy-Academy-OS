import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updatePost
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
export const updatePost = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePost.url(args, options),
    method: 'patch',
})

updatePost.definition = {
    methods: ["patch"],
    url: '/communaute/forum/posts/{post}/moderation',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updatePost
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
updatePost.url = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updatePost.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updatePost
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
updatePost.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePost.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updatePost
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
const updatePostForm = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePost.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updatePost
* @see app/Http/Controllers/Community/CommunityModerationController.php:18
* @route '/communaute/forum/posts/{post}/moderation'
*/
updatePostForm.patch = (args: { post: number | { id: number } } | [post: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePost.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePost.form = updatePostForm

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updateComment
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
export const updateComment = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateComment.url(args, options),
    method: 'patch',
})

updateComment.definition = {
    methods: ["patch"],
    url: '/communaute/forum/comments/{comment}/moderation',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updateComment
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
updateComment.url = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateComment.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updateComment
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
updateComment.patch = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateComment.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updateComment
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
const updateCommentForm = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateComment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Community\CommunityModerationController::updateComment
* @see app/Http/Controllers/Community/CommunityModerationController.php:46
* @route '/communaute/forum/comments/{comment}/moderation'
*/
updateCommentForm.patch = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateComment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateComment.form = updateCommentForm

const CommunityModerationController = { updatePost, updateComment }

export default CommunityModerationController