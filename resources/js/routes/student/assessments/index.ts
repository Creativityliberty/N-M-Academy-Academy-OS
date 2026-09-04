import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
export const show = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/courses/{course}/assessments/{assessment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
show.url = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
show.get = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
show.head = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
const showForm = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
showForm.get = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\AssessmentController::show
* @see app/Http/Controllers/Student/AssessmentController.php:22
* @route '/student/courses/{course}/assessments/{assessment}'
*/
showForm.head = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\AssessmentController::submit
* @see app/Http/Controllers/Student/AssessmentController.php:82
* @route '/student/courses/{course}/assessments/{assessment}'
*/
export const submit = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/student/courses/{course}/assessments/{assessment}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\AssessmentController::submit
* @see app/Http/Controllers/Student/AssessmentController.php:82
* @route '/student/courses/{course}/assessments/{assessment}'
*/
submit.url = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assessment}', parsedArgs.assessment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\AssessmentController::submit
* @see app/Http/Controllers/Student/AssessmentController.php:82
* @route '/student/courses/{course}/assessments/{assessment}'
*/
submit.post = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\AssessmentController::submit
* @see app/Http/Controllers/Student/AssessmentController.php:82
* @route '/student/courses/{course}/assessments/{assessment}'
*/
const submitForm = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\AssessmentController::submit
* @see app/Http/Controllers/Student/AssessmentController.php:82
* @route '/student/courses/{course}/assessments/{assessment}'
*/
submitForm.post = (args: { course: number | { id: number }, assessment: number | { id: number } } | [course: number | { id: number }, assessment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

submit.form = submitForm

const assessments = {
    show: Object.assign(show, show),
    submit: Object.assign(submit, submit),
}

export default assessments