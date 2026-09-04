import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/missions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::index
* @see app/MissionTower/Http/Controllers/MissionController.php:28
* @route '/tower/missions'
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
* @see \App\MissionTower\Http\Controllers\MissionController::store
* @see app/MissionTower/Http/Controllers/MissionController.php:53
* @route '/tower/missions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tower/missions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionController::store
* @see app/MissionTower/Http/Controllers/MissionController.php:53
* @route '/tower/missions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionController::store
* @see app/MissionTower/Http/Controllers/MissionController.php:53
* @route '/tower/missions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::store
* @see app/MissionTower/Http/Controllers/MissionController.php:53
* @route '/tower/missions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::store
* @see app/MissionTower/Http/Controllers/MissionController.php:53
* @route '/tower/missions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
export const show = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tower/missions/{mission}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
show.url = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { mission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            mission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mission: typeof args.mission === 'object'
        ? args.mission.id
        : args.mission,
    }

    return show.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
show.get = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
show.head = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
const showForm = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
showForm.get = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::show
* @see app/MissionTower/Http/Controllers/MissionController.php:101
* @route '/tower/missions/{mission}'
*/
showForm.head = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\MissionTower\Http\Controllers\MissionController::run
* @see app/MissionTower/Http/Controllers/MissionController.php:117
* @route '/tower/missions/{mission}/run'
*/
export const run = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(args, options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/tower/missions/{mission}/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionController::run
* @see app/MissionTower/Http/Controllers/MissionController.php:117
* @route '/tower/missions/{mission}/run'
*/
run.url = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { mission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            mission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mission: typeof args.mission === 'object'
        ? args.mission.id
        : args.mission,
    }

    return run.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionController::run
* @see app/MissionTower/Http/Controllers/MissionController.php:117
* @route '/tower/missions/{mission}/run'
*/
run.post = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::run
* @see app/MissionTower/Http/Controllers/MissionController.php:117
* @route '/tower/missions/{mission}/run'
*/
const runForm = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionController::run
* @see app/MissionTower/Http/Controllers/MissionController.php:117
* @route '/tower/missions/{mission}/run'
*/
runForm.post = (args: { mission: number | { id: number } } | [mission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(args, options),
    method: 'post',
})

run.form = runForm

const missions = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    run: Object.assign(run, run),
}

export default missions