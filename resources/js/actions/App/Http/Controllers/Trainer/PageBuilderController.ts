import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/pages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::index
* @see app/Http/Controllers/Trainer/PageBuilderController.php:23
* @route '/trainer/pages'
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
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:40
* @route '/trainer/pages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/pages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:40
* @route '/trainer/pages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:40
* @route '/trainer/pages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:40
* @route '/trainer/pages'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::store
* @see app/Http/Controllers/Trainer/PageBuilderController.php:40
* @route '/trainer/pages'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
export const edit = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/trainer/pages/{page}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
edit.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
edit.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
edit.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
const editForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
editForm.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::edit
* @see app/Http/Controllers/Trainer/PageBuilderController.php:86
* @route '/trainer/pages/{page}/edit'
*/
editForm.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:119
* @route '/trainer/pages/{page}'
*/
export const update = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/trainer/pages/{page}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:119
* @route '/trainer/pages/{page}'
*/
update.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:119
* @route '/trainer/pages/{page}'
*/
update.patch = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::update
* @see app/Http/Controllers/Trainer/PageBuilderController.php:119
* @route '/trainer/pages/{page}'
*/
const updateForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Trainer/PageBuilderController.php:119
* @route '/trainer/pages/{page}'
*/
updateForm.patch = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Trainer/PageBuilderController.php:150
* @route '/trainer/pages/{page}'
*/
export const destroy = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trainer/pages/{page}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:150
* @route '/trainer/pages/{page}'
*/
destroy.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:150
* @route '/trainer/pages/{page}'
*/
destroy.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroy
* @see app/Http/Controllers/Trainer/PageBuilderController.php:150
* @route '/trainer/pages/{page}'
*/
const destroyForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Trainer/PageBuilderController.php:150
* @route '/trainer/pages/{page}'
*/
destroyForm.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Trainer\PageBuilderController::publish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:133
* @route '/trainer/pages/{page}/publish'
*/
export const publish = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/trainer/pages/{page}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::publish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:133
* @route '/trainer/pages/{page}/publish'
*/
publish.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::publish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:133
* @route '/trainer/pages/{page}/publish'
*/
publish.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::publish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:133
* @route '/trainer/pages/{page}/publish'
*/
const publishForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::publish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:133
* @route '/trainer/pages/{page}/publish'
*/
publishForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

publish.form = publishForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::unpublish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:143
* @route '/trainer/pages/{page}/unpublish'
*/
export const unpublish = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

unpublish.definition = {
    methods: ["post"],
    url: '/trainer/pages/{page}/unpublish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::unpublish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:143
* @route '/trainer/pages/{page}/unpublish'
*/
unpublish.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return unpublish.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::unpublish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:143
* @route '/trainer/pages/{page}/unpublish'
*/
unpublish.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::unpublish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:143
* @route '/trainer/pages/{page}/unpublish'
*/
const unpublishForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::unpublish
* @see app/Http/Controllers/Trainer/PageBuilderController.php:143
* @route '/trainer/pages/{page}/unpublish'
*/
unpublishForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

unpublish.form = unpublishForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
export const preview = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/trainer/pages/{page}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
preview.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return preview.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
preview.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
preview.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
const previewForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
previewForm.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::preview
* @see app/Http/Controllers/Trainer/PageBuilderController.php:208
* @route '/trainer/pages/{page}/preview'
*/
previewForm.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

preview.form = previewForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::storeSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
export const storeSection = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSection.url(args, options),
    method: 'post',
})

storeSection.definition = {
    methods: ["post"],
    url: '/trainer/pages/{page}/sections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::storeSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
storeSection.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeSection.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::storeSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
storeSection.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::storeSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
const storeSectionForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::storeSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:157
* @route '/trainer/pages/{page}/sections'
*/
storeSectionForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSection.url(args, options),
    method: 'post',
})

storeSection.form = storeSectionForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::updateSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
export const updateSection = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateSection.url(args, options),
    method: 'patch',
})

updateSection.definition = {
    methods: ["patch"],
    url: '/trainer/pages/{page}/sections/{section}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::updateSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
updateSection.url = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return updateSection.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace('{section}', parsedArgs.section.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::updateSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
updateSection.patch = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateSection.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::updateSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
const updateSectionForm = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSection.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::updateSection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:172
* @route '/trainer/pages/{page}/sections/{section}'
*/
updateSectionForm.patch = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSection.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateSection.form = updateSectionForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroySection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
export const destroySection = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySection.url(args, options),
    method: 'delete',
})

destroySection.definition = {
    methods: ["delete"],
    url: '/trainer/pages/{page}/sections/{section}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroySection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
destroySection.url = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroySection.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace('{section}', parsedArgs.section.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroySection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
destroySection.delete = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySection.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroySection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
const destroySectionForm = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroySection.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::destroySection
* @see app/Http/Controllers/Trainer/PageBuilderController.php:185
* @route '/trainer/pages/{page}/sections/{section}'
*/
destroySectionForm.delete = (args: { page: number | { id: number }, section: number | { id: number } } | [page: number | { id: number }, section: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroySection.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroySection.form = destroySectionForm

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorderSections
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
export const reorderSections = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorderSections.url(args, options),
    method: 'post',
})

reorderSections.definition = {
    methods: ["post"],
    url: '/trainer/pages/{page}/sections/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorderSections
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
reorderSections.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reorderSections.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorderSections
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
reorderSections.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorderSections.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorderSections
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
const reorderSectionsForm = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorderSections.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\PageBuilderController::reorderSections
* @see app/Http/Controllers/Trainer/PageBuilderController.php:192
* @route '/trainer/pages/{page}/sections/reorder'
*/
reorderSectionsForm.post = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorderSections.url(args, options),
    method: 'post',
})

reorderSections.form = reorderSectionsForm

const PageBuilderController = { index, store, edit, update, destroy, publish, unpublish, preview, storeSection, updateSection, destroySection, reorderSections }

export default PageBuilderController