import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/academy-ai/course-creation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::index
* @see app/Http/Controllers/Trainer/CourseCreationController.php:23
* @route '/trainer/academy-ai/course-creation'
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
* @see \App\Http\Controllers\Trainer\CourseCreationController::start
* @see app/Http/Controllers/Trainer/CourseCreationController.php:60
* @route '/trainer/academy-ai/course-creation'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::start
* @see app/Http/Controllers/Trainer/CourseCreationController.php:60
* @route '/trainer/academy-ai/course-creation'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::start
* @see app/Http/Controllers/Trainer/CourseCreationController.php:60
* @route '/trainer/academy-ai/course-creation'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::start
* @see app/Http/Controllers/Trainer/CourseCreationController.php:60
* @route '/trainer/academy-ai/course-creation'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::start
* @see app/Http/Controllers/Trainer/CourseCreationController.php:60
* @route '/trainer/academy-ai/course-creation'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::advance
* @see app/Http/Controllers/Trainer/CourseCreationController.php:85
* @route '/trainer/academy-ai/course-creation/{run}/advance'
*/
export const advance = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: advance.url(args, options),
    method: 'post',
})

advance.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation/{run}/advance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::advance
* @see app/Http/Controllers/Trainer/CourseCreationController.php:85
* @route '/trainer/academy-ai/course-creation/{run}/advance'
*/
advance.url = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return advance.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::advance
* @see app/Http/Controllers/Trainer/CourseCreationController.php:85
* @route '/trainer/academy-ai/course-creation/{run}/advance'
*/
advance.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: advance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::advance
* @see app/Http/Controllers/Trainer/CourseCreationController.php:85
* @route '/trainer/academy-ai/course-creation/{run}/advance'
*/
const advanceForm = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: advance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::advance
* @see app/Http/Controllers/Trainer/CourseCreationController.php:85
* @route '/trainer/academy-ai/course-creation/{run}/advance'
*/
advanceForm.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: advance.url(args, options),
    method: 'post',
})

advance.form = advanceForm

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::retry
* @see app/Http/Controllers/Trainer/CourseCreationController.php:69
* @route '/trainer/academy-ai/course-creation/{run}/retry'
*/
export const retry = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/course-creation/{run}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::retry
* @see app/Http/Controllers/Trainer/CourseCreationController.php:69
* @route '/trainer/academy-ai/course-creation/{run}/retry'
*/
retry.url = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return retry.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::retry
* @see app/Http/Controllers/Trainer/CourseCreationController.php:69
* @route '/trainer/academy-ai/course-creation/{run}/retry'
*/
retry.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::retry
* @see app/Http/Controllers/Trainer/CourseCreationController.php:69
* @route '/trainer/academy-ai/course-creation/{run}/retry'
*/
const retryForm = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CourseCreationController::retry
* @see app/Http/Controllers/Trainer/CourseCreationController.php:69
* @route '/trainer/academy-ai/course-creation/{run}/retry'
*/
retryForm.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

retry.form = retryForm

const CourseCreationController = { index, start, advance, retry }

export default CourseCreationController