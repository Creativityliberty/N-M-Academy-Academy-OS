import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
*/
export const index = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
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
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
*/
index.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
*/
index.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
*/
const indexForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
*/
indexForm.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::index
* @see app/Http/Controllers/Trainer/AssignmentController.php:27
* @route '/trainer/courses/{course}/assignments'
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
* @see \App\Http\Controllers\Trainer\AssignmentController::store
* @see app/Http/Controllers/Trainer/AssignmentController.php:43
* @route '/trainer/courses/{course}/assignments'
*/
export const store = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::store
* @see app/Http/Controllers/Trainer/AssignmentController.php:43
* @route '/trainer/courses/{course}/assignments'
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
* @see \App\Http\Controllers\Trainer\AssignmentController::store
* @see app/Http/Controllers/Trainer/AssignmentController.php:43
* @route '/trainer/courses/{course}/assignments'
*/
store.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::store
* @see app/Http/Controllers/Trainer/AssignmentController.php:43
* @route '/trainer/courses/{course}/assignments'
*/
const storeForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::store
* @see app/Http/Controllers/Trainer/AssignmentController.php:43
* @route '/trainer/courses/{course}/assignments'
*/
storeForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::update
* @see app/Http/Controllers/Trainer/AssignmentController.php:50
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
export const update = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/trainer/courses/{course}/assignments/{assignment}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::update
* @see app/Http/Controllers/Trainer/AssignmentController.php:50
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
update.url = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assignment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
    }

    return update.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::update
* @see app/Http/Controllers/Trainer/AssignmentController.php:50
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
update.patch = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::update
* @see app/Http/Controllers/Trainer/AssignmentController.php:50
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
const updateForm = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::update
* @see app/Http/Controllers/Trainer/AssignmentController.php:50
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
updateForm.patch = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Trainer\AssignmentController::destroy
* @see app/Http/Controllers/Trainer/AssignmentController.php:58
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
export const destroy = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trainer/courses/{course}/assignments/{assignment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::destroy
* @see app/Http/Controllers/Trainer/AssignmentController.php:58
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
destroy.url = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assignment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
    }

    return destroy.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::destroy
* @see app/Http/Controllers/Trainer/AssignmentController.php:58
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
destroy.delete = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::destroy
* @see app/Http/Controllers/Trainer/AssignmentController.php:58
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
const destroyForm = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::destroy
* @see app/Http/Controllers/Trainer/AssignmentController.php:58
* @route '/trainer/courses/{course}/assignments/{assignment}'
*/
destroyForm.delete = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Trainer\AssignmentController::toggle
* @see app/Http/Controllers/Trainer/AssignmentController.php:66
* @route '/trainer/courses/{course}/assignments/{assignment}/toggle'
*/
export const toggle = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/trainer/courses/{course}/assignments/{assignment}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::toggle
* @see app/Http/Controllers/Trainer/AssignmentController.php:66
* @route '/trainer/courses/{course}/assignments/{assignment}/toggle'
*/
toggle.url = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assignment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
    }

    return toggle.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::toggle
* @see app/Http/Controllers/Trainer/AssignmentController.php:66
* @route '/trainer/courses/{course}/assignments/{assignment}/toggle'
*/
toggle.patch = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::toggle
* @see app/Http/Controllers/Trainer/AssignmentController.php:66
* @route '/trainer/courses/{course}/assignments/{assignment}/toggle'
*/
const toggleForm = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::toggle
* @see app/Http/Controllers/Trainer/AssignmentController.php:66
* @route '/trainer/courses/{course}/assignments/{assignment}/toggle'
*/
toggleForm.patch = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle.form = toggleForm

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::review
* @see app/Http/Controllers/Trainer/AssignmentController.php:74
* @route '/trainer/courses/{course}/assignments/{assignment}/submissions/{submission}/review'
*/
export const review = (args: { course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/assignments/{assignment}/submissions/{submission}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::review
* @see app/Http/Controllers/Trainer/AssignmentController.php:74
* @route '/trainer/courses/{course}/assignments/{assignment}/submissions/{submission}/review'
*/
review.url = (args: { course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assignment: args[1],
            submission: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
        submission: typeof args.submission === 'object'
        ? args.submission.id
        : args.submission,
    }

    return review.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace('{submission}', parsedArgs.submission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::review
* @see app/Http/Controllers/Trainer/AssignmentController.php:74
* @route '/trainer/courses/{course}/assignments/{assignment}/submissions/{submission}/review'
*/
review.post = (args: { course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::review
* @see app/Http/Controllers/Trainer/AssignmentController.php:74
* @route '/trainer/courses/{course}/assignments/{assignment}/submissions/{submission}/review'
*/
const reviewForm = (args: { course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::review
* @see app/Http/Controllers/Trainer/AssignmentController.php:74
* @route '/trainer/courses/{course}/assignments/{assignment}/submissions/{submission}/review'
*/
reviewForm.post = (args: { course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, submission: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: review.url(args, options),
    method: 'post',
})

review.form = reviewForm

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
export const download = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/assignments/{assignment}/files/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
download.url = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assignment: args[1],
            file: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        assignment: typeof args.assignment === 'object'
        ? args.assignment.id
        : args.assignment,
        file: typeof args.file === 'object'
        ? args.file.id
        : args.file,
    }

    return download.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
download.get = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
download.head = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
const downloadForm = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
downloadForm.get = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
downloadForm.head = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const AssignmentController = { index, store, update, destroy, toggle, review, download }

export default AssignmentController