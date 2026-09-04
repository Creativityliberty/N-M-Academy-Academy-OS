import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
export const revoke = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/certificates/{certificate}/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
revoke.url = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            certificate: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
        certificate: typeof args.certificate === 'object'
        ? args.certificate.id
        : args.certificate,
    }

    return revoke.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{certificate}', parsedArgs.certificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
revoke.post = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
const revokeForm = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CompletionController::revoke
* @see app/Http/Controllers/Trainer/CompletionController.php:120
* @route '/trainer/courses/{course}/certificates/{certificate}/revoke'
*/
revokeForm.post = (args: { course: number | { id: number }, certificate: number | { id: number } } | [course: number | { id: number }, certificate: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(args, options),
    method: 'post',
})

revoke.form = revokeForm

const certificates = {
    revoke: Object.assign(revoke, revoke),
}

export default certificates