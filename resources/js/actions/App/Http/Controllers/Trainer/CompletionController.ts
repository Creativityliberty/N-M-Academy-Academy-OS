import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
export const show = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/completion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
show.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
    }

    return show.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
show.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
show.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
const showForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
showForm.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::show
* @see app/Http/Controllers/Trainer/CompletionController.php:21
* @route '/trainer/courses/{course}/completion'
*/
showForm.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Trainer\CompletionController::update
* @see app/Http/Controllers/Trainer/CompletionController.php:71
* @route '/trainer/courses/{course}/completion'
*/
export const update = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/trainer/courses/{course}/completion',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Trainer\CompletionController::update
* @see app/Http/Controllers/Trainer/CompletionController.php:71
* @route '/trainer/courses/{course}/completion'
*/
update.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
    }

    return update.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CompletionController::update
* @see app/Http/Controllers/Trainer/CompletionController.php:71
* @route '/trainer/courses/{course}/completion'
*/
update.put = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::update
* @see app/Http/Controllers/Trainer/CompletionController.php:71
* @route '/trainer/courses/{course}/completion'
*/
const updateForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::update
* @see app/Http/Controllers/Trainer/CompletionController.php:71
* @route '/trainer/courses/{course}/completion'
*/
updateForm.put = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
export const revoke = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/certificates/{certificate}/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
revoke.url = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            certificate: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        certificate: typeof args.certificate === 'object'
        ? args.certificate.id
        : args.certificate,
    }

    return revoke.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{certificate}', parsedArgs.certificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
revoke.post = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
const revokeForm = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
revokeForm.post = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(args, options),
    method: 'post',
})

revoke.form = revokeForm

const CompletionController = { show, update, revoke }

export default CompletionController