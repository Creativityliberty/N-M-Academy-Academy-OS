import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import posts from './posts'
import comments from './comments'
import reactions from './reactions'
import spaces from './spaces'
/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
export const forum = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forum.url(options),
    method: 'get',
})

forum.definition = {
    methods: ["get","head"],
    url: '/communaute/forum',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
forum.url = (options?: RouteQueryOptions) => {
    return forum.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
forum.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forum.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
forum.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forum.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
const forumForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: forum.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
forumForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: forum.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Community\CommunityController::forum
* @see app/Http/Controllers/Community/CommunityController.php:20
* @route '/communaute/forum'
*/
forumForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: forum.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

forum.form = forumForm

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
export const events = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: events.url(options),
    method: 'get',
})

events.definition = {
    methods: ["get","head"],
    url: '/communaute/evenements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
events.url = (options?: RouteQueryOptions) => {
    return events.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
events.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: events.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
events.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: events.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
const eventsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: events.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
eventsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: events.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Events\EventController::events
* @see app/Http/Controllers/Events/EventController.php:17
* @route '/communaute/evenements'
*/
eventsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: events.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

events.form = eventsForm

const community = {
    forum: Object.assign(forum, forum),
    events: Object.assign(events, events),
    posts: Object.assign(posts, posts),
    comments: Object.assign(comments, comments),
    reactions: Object.assign(reactions, reactions),
    spaces: Object.assign(spaces, spaces),
}

export default community