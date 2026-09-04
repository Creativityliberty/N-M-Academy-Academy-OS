import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import chat from './chat'
import memory from './memory'
import compiler from './compiler'
import missions from './missions'
import approvals from './approvals'
import runs from './runs'
import evidence from './evidence'
import insights from './insights'
/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
export const overview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/tower',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
overview.url = (options?: RouteQueryOptions) => {
    return overview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
overview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
overview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
const overviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
overviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MissionTower\OverviewController::overview
* @see app/Http/Controllers/MissionTower/OverviewController.php:25
* @route '/tower'
*/
overviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overview.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

overview.form = overviewForm

const tower = {
    overview: Object.assign(overview, overview),
    chat: Object.assign(chat, chat),
    memory: Object.assign(memory, memory),
    compiler: Object.assign(compiler, compiler),
    missions: Object.assign(missions, missions),
    approvals: Object.assign(approvals, approvals),
    runs: Object.assign(runs, runs),
    evidence: Object.assign(evidence, evidence),
    insights: Object.assign(insights, insights),
}

export default tower