import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/evidence',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\EvidenceController::index
* @see app/MissionTower/Http/Controllers/EvidenceController.php:18
* @route '/tower/evidence'
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

const EvidenceController = { index }

export default EvidenceController