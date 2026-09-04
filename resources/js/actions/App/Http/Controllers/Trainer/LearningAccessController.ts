import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
*/
export const index = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/learning-access',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
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
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
*/
index.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
*/
index.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
*/
const indexForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
*/
indexForm.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::index
* @see app/Http/Controllers/Trainer/LearningAccessController.php:21
* @route '/trainer/courses/{course}/learning-access'
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
* @see \App\Http\Controllers\Trainer\LearningAccessController::store
* @see app/Http/Controllers/Trainer/LearningAccessController.php:53
* @route '/trainer/courses/{course}/learning-access'
*/
export const store = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/learning-access',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::store
* @see app/Http/Controllers/Trainer/LearningAccessController.php:53
* @route '/trainer/courses/{course}/learning-access'
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
* @see \App\Http\Controllers\Trainer\LearningAccessController::store
* @see app/Http/Controllers/Trainer/LearningAccessController.php:53
* @route '/trainer/courses/{course}/learning-access'
*/
store.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::store
* @see app/Http/Controllers/Trainer/LearningAccessController.php:53
* @route '/trainer/courses/{course}/learning-access'
*/
const storeForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::store
* @see app/Http/Controllers/Trainer/LearningAccessController.php:53
* @route '/trainer/courses/{course}/learning-access'
*/
storeForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::update
* @see app/Http/Controllers/Trainer/LearningAccessController.php:61
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
export const update = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/trainer/courses/{course}/learning-access/{rule}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::update
* @see app/Http/Controllers/Trainer/LearningAccessController.php:61
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
update.url = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            rule: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        rule: typeof args.rule === 'object'
        ? args.rule.id
        : args.rule,
    }

    return update.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{rule}', parsedArgs.rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::update
* @see app/Http/Controllers/Trainer/LearningAccessController.php:61
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
update.patch = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::update
* @see app/Http/Controllers/Trainer/LearningAccessController.php:61
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
const updateForm = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::update
* @see app/Http/Controllers/Trainer/LearningAccessController.php:61
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
updateForm.patch = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Trainer\LearningAccessController::destroy
* @see app/Http/Controllers/Trainer/LearningAccessController.php:70
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
export const destroy = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trainer/courses/{course}/learning-access/{rule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::destroy
* @see app/Http/Controllers/Trainer/LearningAccessController.php:70
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
destroy.url = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            rule: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        rule: typeof args.rule === 'object'
        ? args.rule.id
        : args.rule,
    }

    return destroy.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{rule}', parsedArgs.rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::destroy
* @see app/Http/Controllers/Trainer/LearningAccessController.php:70
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
destroy.delete = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::destroy
* @see app/Http/Controllers/Trainer/LearningAccessController.php:70
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
const destroyForm = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\LearningAccessController::destroy
* @see app/Http/Controllers/Trainer/LearningAccessController.php:70
* @route '/trainer/courses/{course}/learning-access/{rule}'
*/
destroyForm.delete = (args: { course: number | { id: number }, rule: number | { id: number } } | [course: number | { id: number }, rule: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LearningAccessController = { index, store, update, destroy }

export default LearningAccessController