import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/insights',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::index
* @see app/MissionTower/Http/Controllers/InsightsController.php:27
* @route '/tower/insights'
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
* @see \App\MissionTower\Http\Controllers\InsightsController::observe
* @see app/MissionTower/Http/Controllers/InsightsController.php:69
* @route '/tower/insights/observe'
*/
export const observe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: observe.url(options),
    method: 'post',
})

observe.definition = {
    methods: ["post"],
    url: '/tower/insights/observe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::observe
* @see app/MissionTower/Http/Controllers/InsightsController.php:69
* @route '/tower/insights/observe'
*/
observe.url = (options?: RouteQueryOptions) => {
    return observe.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::observe
* @see app/MissionTower/Http/Controllers/InsightsController.php:69
* @route '/tower/insights/observe'
*/
observe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: observe.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::observe
* @see app/MissionTower/Http/Controllers/InsightsController.php:69
* @route '/tower/insights/observe'
*/
const observeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: observe.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::observe
* @see app/MissionTower/Http/Controllers/InsightsController.php:69
* @route '/tower/insights/observe'
*/
observeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: observe.url(options),
    method: 'post',
})

observe.form = observeForm

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::mission
* @see app/MissionTower/Http/Controllers/InsightsController.php:81
* @route '/tower/insights/{insight}/mission'
*/
export const mission = (args: { insight: number | { id: number } } | [insight: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mission.url(args, options),
    method: 'post',
})

mission.definition = {
    methods: ["post"],
    url: '/tower/insights/{insight}/mission',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::mission
* @see app/MissionTower/Http/Controllers/InsightsController.php:81
* @route '/tower/insights/{insight}/mission'
*/
mission.url = (args: { insight: number | { id: number } } | [insight: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { insight: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { insight: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            insight: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        insight: typeof args.insight === 'object'
        ? args.insight.id
        : args.insight,
    }

    return mission.definition.url
            .replace('{insight}', parsedArgs.insight.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::mission
* @see app/MissionTower/Http/Controllers/InsightsController.php:81
* @route '/tower/insights/{insight}/mission'
*/
mission.post = (args: { insight: number | { id: number } } | [insight: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mission.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::mission
* @see app/MissionTower/Http/Controllers/InsightsController.php:81
* @route '/tower/insights/{insight}/mission'
*/
const missionForm = (args: { insight: number | { id: number } } | [insight: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: mission.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\InsightsController::mission
* @see app/MissionTower/Http/Controllers/InsightsController.php:81
* @route '/tower/insights/{insight}/mission'
*/
missionForm.post = (args: { insight: number | { id: number } } | [insight: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: mission.url(args, options),
    method: 'post',
})

mission.form = missionForm

const InsightsController = { index, observe, mission }

export default InsightsController