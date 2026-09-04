import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
export const storeOffer = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOffer.url(options),
    method: 'post',
})

storeOffer.definition = {
    methods: ["post"],
    url: '/trainer/sales/offers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
storeOffer.url = (options?: RouteQueryOptions) => {
    return storeOffer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
storeOffer.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOffer.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
const storeOfferForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOffer.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:21
* @route '/trainer/sales/offers'
*/
storeOfferForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOffer.url(options),
    method: 'post',
})

storeOffer.form = storeOfferForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
export const toggleOffer = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleOffer.url(args, options),
    method: 'patch',
})

toggleOffer.definition = {
    methods: ["patch"],
    url: '/trainer/sales/offers/{offer}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
toggleOffer.url = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { offer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.id
        : args.offer,
    }

    return toggleOffer.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
toggleOffer.patch = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleOffer.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
const toggleOfferForm = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleOffer.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleOffer
* @see app/Http/Controllers/Trainer/CommerceController.php:59
* @route '/trainer/sales/offers/{offer}/toggle'
*/
toggleOfferForm.patch = (args: { offer: number | { id: number } } | [offer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleOffer.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleOffer.form = toggleOfferForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
export const storeCoupon = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCoupon.url(options),
    method: 'post',
})

storeCoupon.definition = {
    methods: ["post"],
    url: '/trainer/sales/coupons',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
storeCoupon.url = (options?: RouteQueryOptions) => {
    return storeCoupon.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
storeCoupon.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCoupon.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
const storeCouponForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCoupon.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:67
* @route '/trainer/sales/coupons'
*/
storeCouponForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCoupon.url(options),
    method: 'post',
})

storeCoupon.form = storeCouponForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
export const toggleCoupon = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleCoupon.url(args, options),
    method: 'patch',
})

toggleCoupon.definition = {
    methods: ["patch"],
    url: '/trainer/sales/coupons/{coupon}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
toggleCoupon.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { coupon: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            coupon: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        coupon: typeof args.coupon === 'object'
        ? args.coupon.id
        : args.coupon,
    }

    return toggleCoupon.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
toggleCoupon.patch = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleCoupon.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
const toggleCouponForm = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleCoupon.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleCoupon
* @see app/Http/Controllers/Trainer/CommerceController.php:109
* @route '/trainer/sales/coupons/{coupon}/toggle'
*/
toggleCouponForm.patch = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleCoupon.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleCoupon.form = toggleCouponForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
export const storeAffiliate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAffiliate.url(options),
    method: 'post',
})

storeAffiliate.definition = {
    methods: ["post"],
    url: '/trainer/sales/affiliates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
storeAffiliate.url = (options?: RouteQueryOptions) => {
    return storeAffiliate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
storeAffiliate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAffiliate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
const storeAffiliateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeAffiliate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::storeAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:117
* @route '/trainer/sales/affiliates'
*/
storeAffiliateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeAffiliate.url(options),
    method: 'post',
})

storeAffiliate.form = storeAffiliateForm

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
export const toggleAffiliate = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAffiliate.url(args, options),
    method: 'patch',
})

toggleAffiliate.definition = {
    methods: ["patch"],
    url: '/trainer/sales/affiliates/{affiliate}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
toggleAffiliate.url = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { affiliate: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { affiliate: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            affiliate: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        affiliate: typeof args.affiliate === 'object'
        ? args.affiliate.id
        : args.affiliate,
    }

    return toggleAffiliate.definition.url
            .replace('{affiliate}', parsedArgs.affiliate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
toggleAffiliate.patch = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAffiliate.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
const toggleAffiliateForm = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleAffiliate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\CommerceController::toggleAffiliate
* @see app/Http/Controllers/Trainer/CommerceController.php:146
* @route '/trainer/sales/affiliates/{affiliate}/toggle'
*/
toggleAffiliateForm.patch = (args: { affiliate: number | { id: number } } | [affiliate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleAffiliate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleAffiliate.form = toggleAffiliateForm

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

const CommerceController = { storeOffer, toggleOffer, storeCoupon, toggleCoupon, storeAffiliate, toggleAffiliate, refund }

export default CommerceController