import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/approvals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::index
* @see app/MissionTower/Http/Controllers/ApprovalController.php:25
* @route '/tower/approvals'
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
* @see \App\MissionTower\Http\Controllers\ApprovalController::decide
* @see app/MissionTower/Http/Controllers/ApprovalController.php:52
* @route '/tower/approvals/{approval}/decision'
*/
export const decide = (args: { approval: number | { id: number } } | [approval: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decide.url(args, options),
    method: 'post',
})

decide.definition = {
    methods: ["post"],
    url: '/tower/approvals/{approval}/decision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::decide
* @see app/MissionTower/Http/Controllers/ApprovalController.php:52
* @route '/tower/approvals/{approval}/decision'
*/
decide.url = (args: { approval: number | { id: number } } | [approval: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { approval: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { approval: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            approval: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        approval: typeof args.approval === 'object'
        ? args.approval.id
        : args.approval,
    }

    return decide.definition.url
            .replace('{approval}', parsedArgs.approval.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::decide
* @see app/MissionTower/Http/Controllers/ApprovalController.php:52
* @route '/tower/approvals/{approval}/decision'
*/
decide.post = (args: { approval: number | { id: number } } | [approval: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decide.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::decide
* @see app/MissionTower/Http/Controllers/ApprovalController.php:52
* @route '/tower/approvals/{approval}/decision'
*/
const decideForm = (args: { approval: number | { id: number } } | [approval: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decide.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\ApprovalController::decide
* @see app/MissionTower/Http/Controllers/ApprovalController.php:52
* @route '/tower/approvals/{approval}/decision'
*/
decideForm.post = (args: { approval: number | { id: number } } | [approval: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decide.url(args, options),
    method: 'post',
})

decide.form = decideForm

const approvals = {
    index: Object.assign(index, index),
    decide: Object.assign(decide, decide),
}

export default approvals