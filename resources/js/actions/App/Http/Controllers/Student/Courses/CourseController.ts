import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::index
* @see app/Http/Controllers/Student/Courses/CourseController.php:29
* @route '/student/courses'
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
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
export const show = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/courses/{courseId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
show.url = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { courseId: args }
    }

    if (Array.isArray(args)) {
        args = {
            courseId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        courseId: args.courseId,
    }

    return show.definition.url
            .replace('{courseId}', parsedArgs.courseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
show.get = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
show.head = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
const showForm = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
showForm.get = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\Courses\CourseController::show
* @see app/Http/Controllers/Student/Courses/CourseController.php:83
* @route '/student/courses/{courseId}'
*/
showForm.head = (args: { courseId: string | number } | [courseId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const CourseController = { index, show }

export default CourseController