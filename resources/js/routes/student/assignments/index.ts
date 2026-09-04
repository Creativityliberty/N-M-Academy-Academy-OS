import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import files from './files'
/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
export const show = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/courses/{course}/assignments/{assignment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
show.url = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
show.get = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
show.head = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
const showForm = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
showForm.get = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\AssignmentController::show
* @see app/Http/Controllers/Student/AssignmentController.php:23
* @route '/student/courses/{course}/assignments/{assignment}'
*/
showForm.head = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\AssignmentController::submit
* @see app/Http/Controllers/Student/AssignmentController.php:50
* @route '/student/courses/{course}/assignments/{assignment}'
*/
export const submit = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/student/courses/{course}/assignments/{assignment}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AssignmentController::submit
* @see app/Http/Controllers/Student/AssignmentController.php:50
* @route '/student/courses/{course}/assignments/{assignment}'
*/
submit.url = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AssignmentController::submit
* @see app/Http/Controllers/Student/AssignmentController.php:50
* @route '/student/courses/{course}/assignments/{assignment}'
*/
submit.post = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\AssignmentController::submit
* @see app/Http/Controllers/Student/AssignmentController.php:50
* @route '/student/courses/{course}/assignments/{assignment}'
*/
const submitForm = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\AssignmentController::submit
* @see app/Http/Controllers/Student/AssignmentController.php:50
* @route '/student/courses/{course}/assignments/{assignment}'
*/
submitForm.post = (args: { course: number | { id: number }, assignment: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

submit.form = submitForm

const assignments = {
    show: Object.assign(show, show),
    submit: Object.assign(submit, submit),
    files: Object.assign(files, files),
}

export default assignments