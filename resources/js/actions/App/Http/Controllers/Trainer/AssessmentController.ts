import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
export const index = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/assessments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
index.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
index.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
index.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
const indexForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
indexForm.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::index
* @see app/Http/Controllers/Trainer/AssessmentController.php:29
* @route '/trainer/courses/{course}/assessments'
*/
indexForm.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::store
* @see app/Http/Controllers/Trainer/AssessmentController.php:60
* @route '/trainer/courses/{course}/assessments'
*/
export const store = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/assessments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::store
* @see app/Http/Controllers/Trainer/AssessmentController.php:60
* @route '/trainer/courses/{course}/assessments'
*/
store.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::store
* @see app/Http/Controllers/Trainer/AssessmentController.php:60
* @route '/trainer/courses/{course}/assessments'
*/
store.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::store
* @see app/Http/Controllers/Trainer/AssessmentController.php:60
* @route '/trainer/courses/{course}/assessments'
*/
const storeForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::store
* @see app/Http/Controllers/Trainer/AssessmentController.php:60
* @route '/trainer/courses/{course}/assessments'
*/
storeForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::update
* @see app/Http/Controllers/Trainer/AssessmentController.php:67
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
export const update = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/trainer/courses/{course}/assessments/{assessment}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::update
* @see app/Http/Controllers/Trainer/AssessmentController.php:67
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
update.url = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assessment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assessment: typeof args.assessment === 'object'
        ? args.assessment.id
        : args.assessment,
    }

    return update.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::update
* @see app/Http/Controllers/Trainer/AssessmentController.php:67
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
update.patch = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::update
* @see app/Http/Controllers/Trainer/AssessmentController.php:67
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
const updateForm = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::update
* @see app/Http/Controllers/Trainer/AssessmentController.php:67
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
updateForm.patch = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::destroy
* @see app/Http/Controllers/Trainer/AssessmentController.php:75
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
export const destroy = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trainer/courses/{course}/assessments/{assessment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::destroy
* @see app/Http/Controllers/Trainer/AssessmentController.php:75
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
destroy.url = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assessment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assessment: typeof args.assessment === 'object'
        ? args.assessment.id
        : args.assessment,
    }

    return destroy.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::destroy
* @see app/Http/Controllers/Trainer/AssessmentController.php:75
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
destroy.delete = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::destroy
* @see app/Http/Controllers/Trainer/AssessmentController.php:75
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
const destroyForm = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::destroy
* @see app/Http/Controllers/Trainer/AssessmentController.php:75
* @route '/trainer/courses/{course}/assessments/{assessment}'
*/
destroyForm.delete = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::toggle
* @see app/Http/Controllers/Trainer/AssessmentController.php:84
* @route '/trainer/courses/{course}/assessments/{assessment}/toggle'
*/
export const toggle = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/trainer/courses/{course}/assessments/{assessment}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::toggle
* @see app/Http/Controllers/Trainer/AssessmentController.php:84
* @route '/trainer/courses/{course}/assessments/{assessment}/toggle'
*/
toggle.url = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assessment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assessment: typeof args.assessment === 'object'
        ? args.assessment.id
        : args.assessment,
    }

    return toggle.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::toggle
* @see app/Http/Controllers/Trainer/AssessmentController.php:84
* @route '/trainer/courses/{course}/assessments/{assessment}/toggle'
*/
toggle.patch = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::toggle
* @see app/Http/Controllers/Trainer/AssessmentController.php:84
* @route '/trainer/courses/{course}/assessments/{assessment}/toggle'
*/
const toggleForm = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssessmentController::toggle
* @see app/Http/Controllers/Trainer/AssessmentController.php:84
* @route '/trainer/courses/{course}/assessments/{assessment}/toggle'
*/
toggleForm.patch = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle.form = toggleForm

const AssessmentController = { index, store, update, destroy, toggle }

export default AssessmentController