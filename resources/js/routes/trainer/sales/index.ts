import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import offers from './offers'
import coupons from './coupons'
import affiliates from './affiliates'
import orders from './orders'
/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/trainer/sales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\SalesController::index
* @see app/Http/Controllers/Trainer/SalesController.php:23
* @route '/trainer/sales'
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

const sales = {
    index: Object.assign(index, index),
    offers: Object.assign(offers, offers),
    coupons: Object.assign(coupons, coupons),
    affiliates: Object.assign(affiliates, affiliates),
    orders: Object.assign(orders, orders),
}

export default sales