import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\MissionTower\Http\Controllers\TowerChatController::sendNew
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
export const sendNew = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendNew.url(options),
    method: 'post',
})

sendNew.definition = {
    methods: ["post"],
    url: '/tower/chat/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::sendNew
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
sendNew.url = (options?: RouteQueryOptions) => {
    return sendNew.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::sendNew
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
sendNew.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendNew.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::sendNew
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
const sendNewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendNew.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::sendNew
* @see app/MissionTower/Http/Controllers/TowerChatController.php:45
* @route '/tower/chat/messages'
*/
sendNewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendNew.url(options),
    method: 'post',
})

sendNew.form = sendNewForm

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
* @see \App\MissionTower\Http\Controllers\TowerChatController::send
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
export const send = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/tower/chat/{thread}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::send
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
send.url = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return send.definition.url
            .replace('{thread}', parsedArgs.thread.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::send
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
send.post = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::send
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
const sendForm = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::send
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
sendForm.post = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
})

send.form = sendForm

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::decide
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
export const decide = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decide.url(args, options),
    method: 'post',
})

decide.definition = {
    methods: ["post"],
    url: '/tower/chat/{thread}/approvals/{approval}/decision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::decide
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
decide.url = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return decide.definition.url
            .replace('{thread}', parsedArgs.thread.toString())
            .replace('{approval}', parsedArgs.approval.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::decide
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
decide.post = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decide.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::decide
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
const decideForm = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decide.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::decide
* @see app/MissionTower/Http/Controllers/TowerChatController.php:67
* @route '/tower/chat/{thread}/approvals/{approval}/decision'
*/
decideForm.post = (args: { thread: number | { id: number }, approval: number | { id: number } } | [thread: number | { id: number }, approval: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decide.url(args, options),
    method: 'post',
})

decide.form = decideForm

const TowerChatController = { index, sendNew, show, send, decide }

export default TowerChatController