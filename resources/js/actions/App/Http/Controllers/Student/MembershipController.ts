import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/memberships',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MembershipController::index
* @see app/Http/Controllers/Student/MembershipController.php:18
* @route '/student/memberships'
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
* @see \App\Http\Controllers\Student\MembershipController::portal
* @see app/Http/Controllers/Student/MembershipController.php:45
* @route '/student/memberships/{membership}/portal'
*/
export const portal = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: portal.url(args, options),
    method: 'post',
})

portal.definition = {
    methods: ["post"],
    url: '/student/memberships/{membership}/portal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MembershipController::portal
* @see app/Http/Controllers/Student/MembershipController.php:45
* @route '/student/memberships/{membership}/portal'
*/
portal.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { membership: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            membership: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        membership: typeof args.membership === 'object'
        ? args.membership.id
        : args.membership,
    }

    return portal.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MembershipController::portal
* @see app/Http/Controllers/Student/MembershipController.php:45
* @route '/student/memberships/{membership}/portal'
*/
portal.post = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: portal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MembershipController::portal
* @see app/Http/Controllers/Student/MembershipController.php:45
* @route '/student/memberships/{membership}/portal'
*/
const portalForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: portal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MembershipController::portal
* @see app/Http/Controllers/Student/MembershipController.php:45
* @route '/student/memberships/{membership}/portal'
*/
portalForm.post = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: portal.url(args, options),
    method: 'post',
})

portal.form = portalForm

const MembershipController = { index, portal }

export default MembershipController