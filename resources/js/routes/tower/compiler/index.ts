import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tower/compiler',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::index
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:26
* @route '/tower/compiler'
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
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::compile
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:42
* @route '/tower/compiler'
*/
export const compile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compile.url(options),
    method: 'post',
})

compile.definition = {
    methods: ["post"],
    url: '/tower/compiler',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::compile
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:42
* @route '/tower/compiler'
*/
compile.url = (options?: RouteQueryOptions) => {
    return compile.definition.url + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::compile
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:42
* @route '/tower/compiler'
*/
compile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compile.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::compile
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:42
* @route '/tower/compiler'
*/
const compileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: compile.url(options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::compile
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:42
* @route '/tower/compiler'
*/
compileForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: compile.url(options),
    method: 'post',
})

compile.form = compileForm

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
export const show = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tower/compiler/{compilation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
show.url = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compilation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compilation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compilation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compilation: typeof args.compilation === 'object'
        ? args.compilation.id
        : args.compilation,
    }

    return show.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
show.get = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
show.head = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
const showForm = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
showForm.get = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::show
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:57
* @route '/tower/compiler/{compilation}'
*/
showForm.head = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::apply
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:77
* @route '/tower/compiler/{compilation}/apply'
*/
export const apply = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/tower/compiler/{compilation}/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::apply
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:77
* @route '/tower/compiler/{compilation}/apply'
*/
apply.url = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compilation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { compilation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            compilation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compilation: typeof args.compilation === 'object'
        ? args.compilation.id
        : args.compilation,
    }

    return apply.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::apply
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:77
* @route '/tower/compiler/{compilation}/apply'
*/
apply.post = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::apply
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:77
* @route '/tower/compiler/{compilation}/apply'
*/
const applyForm = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\MissionTower\Http\Controllers\MissionCompilerController::apply
* @see app/MissionTower/Http/Controllers/MissionCompilerController.php:77
* @route '/tower/compiler/{compilation}/apply'
*/
applyForm.post = (args: { compilation: number | { id: number } } | [compilation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(args, options),
    method: 'post',
})

apply.form = applyForm

const compiler = {
    index: Object.assign(index, index),
    compile: Object.assign(compile, compile),
    show: Object.assign(show, show),
    apply: Object.assign(apply, apply),
}

export default compiler