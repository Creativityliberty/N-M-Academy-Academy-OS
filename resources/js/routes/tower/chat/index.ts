import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import thread from './thread'
/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::index
* @see app/MissionTower/Http/Controllers/TowerChatController.php:29
* @route '/tower/chat'
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

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
export const message = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: message.url(options),
    method: 'post',
})

message.definition = {
    methods: ["post"],
    url: '/tower/chat/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
message.url = (options?: RouteQueryOptions) => {
    return message.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
message.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: message.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
const messageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: message.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
messageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: message.url(options),
    method: 'post',
})

message.form = messageForm

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
export const show = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tower/chat/{thread}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
show.url = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { thread: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { thread: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            thread: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        thread: typeof args.thread === 'object'
        ? args.thread.id
        : args.thread,
    }

    return show.definition.url
            .replace('{thread}', parsedArgs.thread.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
show.get = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
show.head = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
const showForm = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
showForm.get = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::show
* @see app/MissionTower/Http/Controllers/TowerChatController.php:37
* @route '/tower/chat/{thread}'
*/
showForm.head = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::approval
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
export const approval = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approval.url(args, options),
    method: 'post',
})

approval.definition = {
    methods: ["post"],
    url: '/tower/chat/{thread}/approvals/{approval}/decision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::approval
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
approval.url = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            thread: args[0],
            approval: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        thread: typeof args.thread === 'object'
        ? args.thread.id
        : args.thread,
        approval: typeof args.approval === 'object'
        ? args.approval.id
        : args.approval,
    }

    return approval.definition.url
            .replace('{thread}', parsedArgs.thread.toString())
            .replace('{approval}', parsedArgs.approval.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::approval
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
approval.post = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approval.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::approval
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
const approvalForm = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approval.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::approval
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
approvalForm.post = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approval.url(args, options),
    method: 'post',
})

approval.form = approvalForm

const chat = {
    index: Object.assign(index, index),
    message: Object.assign(message, message),
    show: Object.assign(show, show),
    thread: Object.assign(thread, thread),
    approval: Object.assign(approval, approval),
}

export default chat