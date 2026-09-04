import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Student\TutorController::submitQuiz
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
export const submitQuiz = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitQuiz.url(args, options),
    method: 'post',
})

submitQuiz.definition = {
    methods: ["post"],
    url: '/student/tutor/quizzes/{session}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\TutorController::submitQuiz
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
submitQuiz.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { session: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            session: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        session: typeof args.session === 'object'
        ? args.session.id
        : args.session,
    }

    return submitQuiz.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\TutorController::submitQuiz
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
submitQuiz.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitQuiz.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\TutorController::submitQuiz
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
const submitQuizForm = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitQuiz.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\TutorController::submitQuiz
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
submitQuizForm.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitQuiz.url(args, options),
    method: 'post',
})

submitQuiz.form = submitQuizForm

const TutorController = { run, submitQuiz }

export default TutorController