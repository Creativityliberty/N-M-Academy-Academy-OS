import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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

const runs = {
    apply: Object.assign(apply, apply),
}

export default runs