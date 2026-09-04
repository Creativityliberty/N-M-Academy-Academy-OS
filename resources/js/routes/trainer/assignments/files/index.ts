import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
export const download = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/assignments/{assignment}/files/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
download.url = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            course: args[0],
            assignment: args[1],
            file: args[2],
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
        file: typeof args.file === 'object'
        ? args.file.id
        : args.file,
    }

    return download.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace('{assignment}', parsedArgs.assignment.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
download.get = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
download.head = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
const downloadForm = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
downloadForm.get = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\AssignmentController::download
* @see app/Http/Controllers/Trainer/AssignmentController.php:88
* @route '/trainer/courses/{course}/assignments/{assignment}/files/{file}'
*/
downloadForm.head = (args: { course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } } | [course: number | { id: number }, assignment: number | { id: number }, file: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const files = {
    download: Object.assign(download, download),
}

export default files