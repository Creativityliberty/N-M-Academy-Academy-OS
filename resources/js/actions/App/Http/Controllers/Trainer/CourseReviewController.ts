import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
export const show = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/trainer/academy-ai/course-creation/{run}/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
show.url = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        run: typeof args.run === 'object'
        ? args.run.id
        : args.run,
    }

    return show.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
show.get = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
show.head = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
const showForm = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
showForm.get = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::show
* @see app/Http/Controllers/Trainer/CourseReviewController.php:26
* @route '/trainer/academy-ai/course-creation/{run}/review'
*/
showForm.head = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Trainer\CourseReviewController::propose
* @see app/Http/Controllers/Trainer/CourseReviewController.php:139
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals'
*/
export const propose = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: propose.url(args, options),
    method: 'post',
})

propose.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation/{run}/review/proposals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::propose
* @see app/Http/Controllers/Trainer/CourseReviewController.php:139
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals'
*/
propose.url = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        run: typeof args.run === 'object'
        ? args.run.id
        : args.run,
    }

    return propose.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::propose
* @see app/Http/Controllers/Trainer/CourseReviewController.php:139
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals'
*/
propose.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: propose.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::propose
* @see app/Http/Controllers/Trainer/CourseReviewController.php:139
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals'
*/
const proposeForm = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: propose.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::propose
* @see app/Http/Controllers/Trainer/CourseReviewController.php:139
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals'
*/
proposeForm.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: propose.url(args, options),
    method: 'post',
})

propose.form = proposeForm

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::accept
* @see app/Http/Controllers/Trainer/CourseReviewController.php:159
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/accept'
*/
export const accept = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::accept
* @see app/Http/Controllers/Trainer/CourseReviewController.php:159
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/accept'
*/
accept.url = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            run: args[0],
            proposal: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        run: typeof args.run === 'object'
        ? args.run.id
        : args.run,
        proposal: typeof args.proposal === 'object'
        ? args.proposal.id
        : args.proposal,
    }

    return accept.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace('{proposal}', parsedArgs.proposal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::accept
* @see app/Http/Controllers/Trainer/CourseReviewController.php:159
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/accept'
*/
accept.post = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::accept
* @see app/Http/Controllers/Trainer/CourseReviewController.php:159
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/accept'
*/
const acceptForm = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::accept
* @see app/Http/Controllers/Trainer/CourseReviewController.php:159
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/accept'
*/
acceptForm.post = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::reject
* @see app/Http/Controllers/Trainer/CourseReviewController.php:169
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/reject'
*/
export const reject = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::reject
* @see app/Http/Controllers/Trainer/CourseReviewController.php:169
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/reject'
*/
reject.url = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            run: args[0],
            proposal: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        run: typeof args.run === 'object'
        ? args.run.id
        : args.run,
        proposal: typeof args.proposal === 'object'
        ? args.proposal.id
        : args.proposal,
    }

    return reject.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace('{proposal}', parsedArgs.proposal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::reject
* @see app/Http/Controllers/Trainer/CourseReviewController.php:169
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/reject'
*/
reject.post = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::reject
* @see app/Http/Controllers/Trainer/CourseReviewController.php:169
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/reject'
*/
const rejectForm = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::reject
* @see app/Http/Controllers/Trainer/CourseReviewController.php:169
* @route '/trainer/academy-ai/course-creation/{run}/review/proposals/{proposal}/reject'
*/
rejectForm.post = (args: { run: number | { id: number }, proposal: number | { id: number } } | [run: number | { id: number }, proposal: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::publish
* @see app/Http/Controllers/Trainer/CourseReviewController.php:179
* @route '/trainer/academy-ai/course-creation/{run}/review/publish'
*/
export const publish = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation/{run}/review/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::publish
* @see app/Http/Controllers/Trainer/CourseReviewController.php:179
* @route '/trainer/academy-ai/course-creation/{run}/review/publish'
*/
publish.url = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { run: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            run: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        run: typeof args.run === 'object'
        ? args.run.id
        : args.run,
    }

    return publish.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::publish
* @see app/Http/Controllers/Trainer/CourseReviewController.php:179
* @route '/trainer/academy-ai/course-creation/{run}/review/publish'
*/
publish.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::publish
* @see app/Http/Controllers/Trainer/CourseReviewController.php:179
* @route '/trainer/academy-ai/course-creation/{run}/review/publish'
*/
const publishForm = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseReviewController::publish
* @see app/Http/Controllers/Trainer/CourseReviewController.php:179
* @route '/trainer/academy-ai/course-creation/{run}/review/publish'
*/
publishForm.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

publish.form = publishForm

const CourseReviewController = { show, propose, accept, reject, publish }

export default CourseReviewController