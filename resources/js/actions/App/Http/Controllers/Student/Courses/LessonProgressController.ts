import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::store
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:17
* @route '/student/lessons/{lesson}/progress'
*/
export const store = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/student/lessons/{lesson}/progress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::store
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:17
* @route '/student/lessons/{lesson}/progress'
*/
store.url = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lesson: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lesson: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lesson: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lesson: typeof args.lesson === 'object'
        ? args.lesson.id
        : args.lesson,
    }

    return store.definition.url
            .replace('{lesson}', parsedArgs.lesson.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::store
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:17
* @route '/student/lessons/{lesson}/progress'
*/
store.post = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::store
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:17
* @route '/student/lessons/{lesson}/progress'
*/
const storeForm = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::store
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:17
* @route '/student/lessons/{lesson}/progress'
*/
storeForm.post = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::destroy
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:36
* @route '/student/lessons/{lesson}/progress'
*/
export const destroy = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/student/lessons/{lesson}/progress',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::destroy
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:36
* @route '/student/lessons/{lesson}/progress'
*/
destroy.url = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lesson: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lesson: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lesson: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lesson: typeof args.lesson === 'object'
        ? args.lesson.id
        : args.lesson,
    }

    return destroy.definition.url
            .replace('{lesson}', parsedArgs.lesson.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::destroy
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:36
* @route '/student/lessons/{lesson}/progress'
*/
destroy.delete = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::destroy
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:36
* @route '/student/lessons/{lesson}/progress'
*/
const destroyForm = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\Courses\LessonProgressController::destroy
* @see app/Http/Controllers/Student/Courses/LessonProgressController.php:36
* @route '/student/lessons/{lesson}/progress'
*/
destroyForm.delete = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LessonProgressController = { store, destroy }

export default LessonProgressController