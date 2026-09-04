import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CommerceController::refund
* @see app/Http/Controllers/Trainer/CommerceController.php:154
* @route '/trainer/sales/orders/{order}/refund'
*/
export const refund = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

refund.definition = {
    methods: ["post"],
    url: '/trainer/sales/orders/{order}/refund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::refund
* @see app/Http/Controllers/Trainer/CommerceController.php:154
* @route '/trainer/sales/orders/{order}/refund'
*/
refund.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return refund.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::refund
* @see app/Http/Controllers/Trainer/CommerceController.php:154
* @route '/trainer/sales/orders/{order}/refund'
*/
refund.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::refund
* @see app/Http/Controllers/Trainer/CommerceController.php:154
* @route '/trainer/sales/orders/{order}/refund'
*/
const refundForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::refund
* @see app/Http/Controllers/Trainer/CommerceController.php:154
* @route '/trainer/sales/orders/{order}/refund'
*/
refundForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refund.url(args, options),
    method: 'post',
})

refund.form = refundForm

const orders = {
    refund: Object.assign(refund, refund),
}

export default orders