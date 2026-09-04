import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
export const message = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: message.url(args, options),
    method: 'post',
})

message.definition = {
    methods: ["post"],
    url: '/tower/chat/{thread}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
message.url = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return message.definition.url
            .replace('{thread}', parsedArgs.thread.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
message.post = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: message.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
const messageForm = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: message.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\TowerChatController::message
* @see app/MissionTower/Http/Controllers/TowerChatController.php:56
* @route '/tower/chat/{thread}/messages'
*/
messageForm.post = (args: { thread: number | { id: number } } | [thread: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: message.url(args, options),
    method: 'post',
})

message.form = messageForm

const thread = {
    message: Object.assign(message, message),
}

export default thread