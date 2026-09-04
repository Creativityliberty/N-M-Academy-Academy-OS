import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\StudentsController::index
* @see app/Http/Controllers/Trainer/StudentsController.php:15
* @route '/trainer/students'
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

const students = {
    index: Object.assign(index, index),
}

export default students