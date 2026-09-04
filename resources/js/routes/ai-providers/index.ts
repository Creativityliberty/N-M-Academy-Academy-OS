import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/ai-providers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::edit
* @see app/Http/Controllers/Settings/AiProvidersController.php:26
* @route '/settings/ai-providers'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::update
* @see app/Http/Controllers/Settings/AiProvidersController.php:57
* @route '/settings/ai-providers'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/ai-providers',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::update
* @see app/Http/Controllers/Settings/AiProvidersController.php:57
* @route '/settings/ai-providers'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::update
* @see app/Http/Controllers/Settings/AiProvidersController.php:57
* @route '/settings/ai-providers'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::update
* @see app/Http/Controllers/Settings/AiProvidersController.php:57
* @route '/settings/ai-providers'
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
* @see \App\Http\Controllers\Settings\AiProvidersController::update
* @see app/Http/Controllers/Settings/AiProvidersController.php:57
* @route '/settings/ai-providers'
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
* @see \App\Http\Controllers\Settings\AiProvidersController::discoverGemini
* @see app/Http/Controllers/Settings/AiProvidersController.php:91
* @route '/settings/ai-providers/discover-gemini'
*/
export const discoverGemini = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: discoverGemini.url(options),
    method: 'post',
})

discoverGemini.definition = {
    methods: ["post"],
    url: '/settings/ai-providers/discover-gemini',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::discoverGemini
* @see app/Http/Controllers/Settings/AiProvidersController.php:91
* @route '/settings/ai-providers/discover-gemini'
*/
discoverGemini.url = (options?: RouteQueryOptions) => {
    return discoverGemini.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::discoverGemini
* @see app/Http/Controllers/Settings/AiProvidersController.php:91
* @route '/settings/ai-providers/discover-gemini'
*/
discoverGemini.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: discoverGemini.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::discoverGemini
* @see app/Http/Controllers/Settings/AiProvidersController.php:91
* @route '/settings/ai-providers/discover-gemini'
*/
const discoverGeminiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: discoverGemini.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiProvidersController::discoverGemini
* @see app/Http/Controllers/Settings/AiProvidersController.php:91
* @route '/settings/ai-providers/discover-gemini'
*/
discoverGeminiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: discoverGemini.url(options),
    method: 'post',
})

discoverGemini.form = discoverGeminiForm

const aiProviders = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    discoverGemini: Object.assign(discoverGemini, discoverGemini),
}

export default aiProviders