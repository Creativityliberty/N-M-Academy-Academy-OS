import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/memory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::index
* @see app/MissionTower/Http/Controllers/MemoryController.php:19
* @route '/tower/memory'
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
* @see \App\MissionTower\Http\Controllers\MemoryController::pin
* @see app/MissionTower/Http/Controllers/MemoryController.php:50
* @route '/tower/memory/{memory}/pin'
*/
export const pin = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pin.url(args, options),
    method: 'post',
})

pin.definition = {
    methods: ["post"],
    url: '/tower/memory/{memory}/pin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::pin
* @see app/MissionTower/Http/Controllers/MemoryController.php:50
* @route '/tower/memory/{memory}/pin'
*/
pin.url = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { memory: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { memory: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            memory: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        memory: typeof args.memory === 'object'
        ? args.memory.id
        : args.memory,
    }

    return pin.definition.url
            .replace('{memory}', parsedArgs.memory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::pin
* @see app/MissionTower/Http/Controllers/MemoryController.php:50
* @route '/tower/memory/{memory}/pin'
*/
pin.post = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pin.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::pin
* @see app/MissionTower/Http/Controllers/MemoryController.php:50
* @route '/tower/memory/{memory}/pin'
*/
const pinForm = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pin.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::pin
* @see app/MissionTower/Http/Controllers/MemoryController.php:50
* @route '/tower/memory/{memory}/pin'
*/
pinForm.post = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pin.url(args, options),
    method: 'post',
})

pin.form = pinForm

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::forget
* @see app/MissionTower/Http/Controllers/MemoryController.php:65
* @route '/tower/memory/{memory}/forget'
*/
export const forget = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forget.url(args, options),
    method: 'post',
})

forget.definition = {
    methods: ["post"],
    url: '/tower/memory/{memory}/forget',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::forget
* @see app/MissionTower/Http/Controllers/MemoryController.php:65
* @route '/tower/memory/{memory}/forget'
*/
forget.url = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { memory: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { memory: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            memory: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        memory: typeof args.memory === 'object'
        ? args.memory.id
        : args.memory,
    }

    return forget.definition.url
            .replace('{memory}', parsedArgs.memory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::forget
* @see app/MissionTower/Http/Controllers/MemoryController.php:65
* @route '/tower/memory/{memory}/forget'
*/
forget.post = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forget.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::forget
* @see app/MissionTower/Http/Controllers/MemoryController.php:65
* @route '/tower/memory/{memory}/forget'
*/
const forgetForm = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forget.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MemoryController::forget
* @see app/MissionTower/Http/Controllers/MemoryController.php:65
* @route '/tower/memory/{memory}/forget'
*/
forgetForm.post = (args: { memory: number | { id: number } } | [memory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forget.url(args, options),
    method: 'post',
})

forget.form = forgetForm

const MemoryController = { index, pin, forget }

export default MemoryController