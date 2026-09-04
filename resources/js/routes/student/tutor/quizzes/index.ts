import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\TutorController::submit
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
export const submit = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/student/tutor/quizzes/{session}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\TutorController::submit
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
submit.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\TutorController::submit
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
submit.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\TutorController::submit
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
const submitForm = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\TutorController::submit
* @see app/Http/Controllers/Student/TutorController.php:63
* @route '/student/tutor/quizzes/{session}/submit'
*/
submitForm.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(args, options),
    method: 'post',
})

submit.form = submitForm

const quizzes = {
    submit: Object.assign(submit, submit),
}

export default quizzes