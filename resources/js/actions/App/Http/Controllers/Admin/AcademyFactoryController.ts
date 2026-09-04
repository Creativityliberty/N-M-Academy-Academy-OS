import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/factory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::index
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:23
* @route '/admin/factory'
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
* @see \App\Http\Controllers\Admin\AcademyFactoryController::store
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:53
* @route '/admin/factory'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/factory',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::store
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:53
* @route '/admin/factory'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::store
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:53
* @route '/admin/factory'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::store
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:53
* @route '/admin/factory'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::store
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:53
* @route '/admin/factory'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::provision
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:128
* @route '/admin/factory/{deployment}/provision'
*/
export const provision = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: provision.url(args, options),
    method: 'post',
})

provision.definition = {
    methods: ["post"],
    url: '/admin/factory/{deployment}/provision',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::provision
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:128
* @route '/admin/factory/{deployment}/provision'
*/
provision.url = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deployment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { deployment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            deployment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        deployment: typeof args.deployment === 'object'
        ? args.deployment.id
        : args.deployment,
    }

    return provision.definition.url
            .replace('{deployment}', parsedArgs.deployment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::provision
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:128
* @route '/admin/factory/{deployment}/provision'
*/
provision.post = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: provision.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::provision
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:128
* @route '/admin/factory/{deployment}/provision'
*/
const provisionForm = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: provision.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::provision
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:128
* @route '/admin/factory/{deployment}/provision'
*/
provisionForm.post = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: provision.url(args, options),
    method: 'post',
})

provision.form = provisionForm

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::verify
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:137
* @route '/admin/factory/{deployment}/verify'
*/
export const verify = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/admin/factory/{deployment}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::verify
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:137
* @route '/admin/factory/{deployment}/verify'
*/
verify.url = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deployment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { deployment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            deployment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        deployment: typeof args.deployment === 'object'
        ? args.deployment.id
        : args.deployment,
    }

    return verify.definition.url
            .replace('{deployment}', parsedArgs.deployment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::verify
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:137
* @route '/admin/factory/{deployment}/verify'
*/
verify.post = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::verify
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:137
* @route '/admin/factory/{deployment}/verify'
*/
const verifyForm = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verify.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademyFactoryController::verify
* @see app/Http/Controllers/Admin/AcademyFactoryController.php:137
* @route '/admin/factory/{deployment}/verify'
*/
verifyForm.post = (args: { deployment: number | { id: number } } | [deployment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verify.url(args, options),
    method: 'post',
})

verify.form = verifyForm

const AcademyFactoryController = { index, store, provision, verify }

export default AcademyFactoryController