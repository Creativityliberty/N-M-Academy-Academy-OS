import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import quizzes from './quizzes'
/**
* @see \App\Http\Controllers\Student\TutorController::run
* @see app/Http/Controllers/Student/TutorController.php:22
* @route '/student/courses/{course}/tutor'
*/
export const run = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(args, options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/student/courses/{course}/tutor',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\TutorController::run
* @see app/Http/Controllers/Student/TutorController.php:22
* @route '/student/courses/{course}/tutor'
*/
run.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return run.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\TutorController::run
* @see app/Http/Controllers/Student/TutorController.php:22
* @route '/student/courses/{course}/tutor'
*/
run.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\TutorController::run
* @see app/Http/Controllers/Student/TutorController.php:22
* @route '/student/courses/{course}/tutor'
*/
const runForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\TutorController::run
* @see app/Http/Controllers/Student/TutorController.php:22
* @route '/student/courses/{course}/tutor'
*/
runForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(args, options),
    method: 'post',
})

run.form = runForm

const tutor = {
    run: Object.assign(run, run),
    quizzes: Object.assign(quizzes, quizzes),
}

export default tutor