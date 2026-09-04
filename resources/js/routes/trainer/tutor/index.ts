import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/ai-tutor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::index
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:21
* @route '/trainer/ai-tutor'
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
* @see \App\Http\Controllers\Trainer\TutorSettingsController::update
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:72
* @route '/trainer/ai-tutor'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/trainer/ai-tutor',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::update
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:72
* @route '/trainer/ai-tutor'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::update
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:72
* @route '/trainer/ai-tutor'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::update
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:72
* @route '/trainer/ai-tutor'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::update
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:72
* @route '/trainer/ai-tutor'
*/
updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::reindex
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:125
* @route '/trainer/ai-tutor/courses/{course}/reindex'
*/
export const reindex = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

reindex.definition = {
    methods: ["post"],
    url: '/trainer/ai-tutor/courses/{course}/reindex',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::reindex
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:125
* @route '/trainer/ai-tutor/courses/{course}/reindex'
*/
reindex.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reindex.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::reindex
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:125
* @route '/trainer/ai-tutor/courses/{course}/reindex'
*/
reindex.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::reindex
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:125
* @route '/trainer/ai-tutor/courses/{course}/reindex'
*/
const reindexForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reindex.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\TutorSettingsController::reindex
* @see app/Http/Controllers/Trainer/TutorSettingsController.php:125
* @route '/trainer/ai-tutor/courses/{course}/reindex'
*/
reindexForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reindex.url(args, options),
    method: 'post',
})

reindex.form = reindexForm

const tutor = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
    reindex: Object.assign(reindex, reindex),
}

export default tutor