import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/academy-ai',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::index
* @see app/Http/Controllers/Trainer/AcademyAiController.php:24
* @route '/trainer/academy-ai'
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
* @see \App\Http\Controllers\Trainer\AcademyAiController::run
* @see app/Http/Controllers/Trainer/AcademyAiController.php:68
* @route '/trainer/academy-ai/run'
*/
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::run
* @see app/Http/Controllers/Trainer/AcademyAiController.php:68
* @route '/trainer/academy-ai/run'
*/
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::run
* @see app/Http/Controllers/Trainer/AcademyAiController.php:68
* @route '/trainer/academy-ai/run'
*/
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::run
* @see app/Http/Controllers/Trainer/AcademyAiController.php:68
* @route '/trainer/academy-ai/run'
*/
const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::run
* @see app/Http/Controllers/Trainer/AcademyAiController.php:68
* @route '/trainer/academy-ai/run'
*/
runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(options),
    method: 'post',
})

run.form = runForm

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::apply
* @see app/Http/Controllers/Trainer/AcademyAiController.php:86
* @route '/trainer/academy-ai/runs/{run}/apply'
*/
export const apply = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/trainer/academy-ai/runs/{run}/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::apply
* @see app/Http/Controllers/Trainer/AcademyAiController.php:86
* @route '/trainer/academy-ai/runs/{run}/apply'
*/
apply.url = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return apply.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::apply
* @see app/Http/Controllers/Trainer/AcademyAiController.php:86
* @route '/trainer/academy-ai/runs/{run}/apply'
*/
apply.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::apply
* @see app/Http/Controllers/Trainer/AcademyAiController.php:86
* @route '/trainer/academy-ai/runs/{run}/apply'
*/
const applyForm = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\AcademyAiController::apply
* @see app/Http/Controllers/Trainer/AcademyAiController.php:86
* @route '/trainer/academy-ai/runs/{run}/apply'
*/
applyForm.post = (args: { run: number | { id: number } } | [run: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(args, options),
    method: 'post',
})

apply.form = applyForm

const AcademyAiController = { index, run, apply }

export default AcademyAiController