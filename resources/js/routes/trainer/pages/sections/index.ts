import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
export const store = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/pages/{page}/sections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
store.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return store.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
store.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
const storeForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
storeForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
export const update = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/trainer/pages/{page}/sections/{section}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
update.url = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            page: args[0],
            section: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
        section: typeof args.section === 'object'
        ? args.section.id
        : args.section,
    }

    return update.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace('{section}', parsedArgs.section.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
update.patch = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
const updateForm = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
updateForm.patch = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
export const destroy = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trainer/pages/{page}/sections/{section}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
destroy.url = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            page: args[0],
            section: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
        section: typeof args.section === 'object'
        ? args.section.id
        : args.section,
    }

    return destroy.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace('{section}', parsedArgs.section.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
destroy.delete = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
const destroyForm = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
destroyForm.delete = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorder
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
export const reorder = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/trainer/pages/{page}/sections/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorder
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
reorder.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return reorder.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorder
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
reorder.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorder
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
const reorderForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorder
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
reorderForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

const sections = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    reorder: Object.assign(reorder, reorder),
}

export default sections