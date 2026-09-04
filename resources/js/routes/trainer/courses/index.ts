import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
export const generateImage = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateImage.url(args, options),
    method: 'post',
})

generateImage.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/generate-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
generateImage.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return generateImage.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
generateImage.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
const generateImageForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
generateImageForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateImage.url(args, options),
    method: 'post',
})

generateImage.form = generateImageForm

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::index
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:36
* @route '/trainer/courses'
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
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::create
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:48
* @route '/trainer/courses/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::store
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:56
* @route '/trainer/courses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trainer/courses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::store
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:56
* @route '/trainer/courses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::store
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:56
* @route '/trainer/courses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::store
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:56
* @route '/trainer/courses'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::store
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:56
* @route '/trainer/courses'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
export const edit = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/trainer/courses/{course}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
edit.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
edit.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
edit.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
const editForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
editForm.get = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::edit
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:69
* @route '/trainer/courses/{course}/edit'
*/
editForm.head = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
export const update = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/trainer/courses/{course}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
update.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
update.put = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
update.patch = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
const updateForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
updateForm.put = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::update
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:81
* @route '/trainer/courses/{course}'
*/
updateForm.patch = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Trainer\Courses\CourseController::destroy
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:91
* @route '/trainer/courses/{course}'
*/
export const destroy = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/trainer/courses/{course}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::destroy
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:91
* @route '/trainer/courses/{course}'
*/
destroy.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::destroy
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:91
* @route '/trainer/courses/{course}'
*/
destroy.delete = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::destroy
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:91
* @route '/trainer/courses/{course}'
*/
const destroyForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::destroy
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:91
* @route '/trainer/courses/{course}'
*/
destroyForm.delete = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Trainer\Courses\CourseController::toggleStatus
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:101
* @route '/trainer/courses/{course}/status'
*/
export const toggleStatus = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/trainer/courses/{course}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::toggleStatus
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:101
* @route '/trainer/courses/{course}/status'
*/
toggleStatus.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::toggleStatus
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:101
* @route '/trainer/courses/{course}/status'
*/
toggleStatus.patch = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::toggleStatus
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:101
* @route '/trainer/courses/{course}/status'
*/
const toggleStatusForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseController::toggleStatus
* @see app/Http/Controllers/Trainer/Courses/CourseController.php:101
* @route '/trainer/courses/{course}/status'
*/
toggleStatusForm.patch = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleStatus.form = toggleStatusForm

const courses = {
    generateImage: Object.assign(generateImage, generateImage),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    toggleStatus: Object.assign(toggleStatus, toggleStatus),
}

export default courses