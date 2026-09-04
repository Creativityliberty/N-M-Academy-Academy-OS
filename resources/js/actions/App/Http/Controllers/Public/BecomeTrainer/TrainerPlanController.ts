import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/become-trainer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\BecomeTrainer\TrainerPlanController::index
* @see app/Http/Controllers/Public/BecomeTrainer/TrainerPlanController.php:13
* @route '/become-trainer'
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

const TrainerPlanController = { index }

export default TrainerPlanController