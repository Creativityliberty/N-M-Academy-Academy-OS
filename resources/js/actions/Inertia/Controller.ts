import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
const Controller535fd093ca1d5254af5dc12ac208e8d5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
})

Controller535fd093ca1d5254af5dc12ac208e8d5.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
Controller535fd093ca1d5254af5dc12ac208e8d5.url = (options?: RouteQueryOptions) => {
    return Controller535fd093ca1d5254af5dc12ac208e8d5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
Controller535fd093ca1d5254af5dc12ac208e8d5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
Controller535fd093ca1d5254af5dc12ac208e8d5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
const Controller535fd093ca1d5254af5dc12ac208e8d5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
Controller535fd093ca1d5254af5dc12ac208e8d5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
Controller535fd093ca1d5254af5dc12ac208e8d5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller535fd093ca1d5254af5dc12ac208e8d5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller535fd093ca1d5254af5dc12ac208e8d5.form = Controller535fd093ca1d5254af5dc12ac208e8d5Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
const Controller0281689d11c3db12eb0f0bc21b3e4ed4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0281689d11c3db12eb0f0bc21b3e4ed4.url(options),
    method: 'get',
})

Controller0281689d11c3db12eb0f0bc21b3e4ed4.definition = {
    methods: ["get","head"],
    url: '/blog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
Controller0281689d11c3db12eb0f0bc21b3e4ed4.url = (options?: RouteQueryOptions) => {
    return Controller0281689d11c3db12eb0f0bc21b3e4ed4.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
Controller0281689d11c3db12eb0f0bc21b3e4ed4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0281689d11c3db12eb0f0bc21b3e4ed4.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
Controller0281689d11c3db12eb0f0bc21b3e4ed4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller0281689d11c3db12eb0f0bc21b3e4ed4.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
const Controller0281689d11c3db12eb0f0bc21b3e4ed4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0281689d11c3db12eb0f0bc21b3e4ed4.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
Controller0281689d11c3db12eb0f0bc21b3e4ed4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0281689d11c3db12eb0f0bc21b3e4ed4.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/blog'
*/
Controller0281689d11c3db12eb0f0bc21b3e4ed4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0281689d11c3db12eb0f0bc21b3e4ed4.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller0281689d11c3db12eb0f0bc21b3e4ed4.form = Controller0281689d11c3db12eb0f0bc21b3e4ed4Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
const Controller36402f3b102b68b92616e946647e00cf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller36402f3b102b68b92616e946647e00cf.url(options),
    method: 'get',
})

Controller36402f3b102b68b92616e946647e00cf.definition = {
    methods: ["get","head"],
    url: '/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
Controller36402f3b102b68b92616e946647e00cf.url = (options?: RouteQueryOptions) => {
    return Controller36402f3b102b68b92616e946647e00cf.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
Controller36402f3b102b68b92616e946647e00cf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller36402f3b102b68b92616e946647e00cf.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
Controller36402f3b102b68b92616e946647e00cf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller36402f3b102b68b92616e946647e00cf.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
const Controller36402f3b102b68b92616e946647e00cfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller36402f3b102b68b92616e946647e00cf.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
Controller36402f3b102b68b92616e946647e00cfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller36402f3b102b68b92616e946647e00cf.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/contact'
*/
Controller36402f3b102b68b92616e946647e00cfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller36402f3b102b68b92616e946647e00cf.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller36402f3b102b68b92616e946647e00cf.form = Controller36402f3b102b68b92616e946647e00cfForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
const Controller80a76efec47372270ced94fb154f59c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller80a76efec47372270ced94fb154f59c9.url(options),
    method: 'get',
})

Controller80a76efec47372270ced94fb154f59c9.definition = {
    methods: ["get","head"],
    url: '/realisations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
Controller80a76efec47372270ced94fb154f59c9.url = (options?: RouteQueryOptions) => {
    return Controller80a76efec47372270ced94fb154f59c9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
Controller80a76efec47372270ced94fb154f59c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller80a76efec47372270ced94fb154f59c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
Controller80a76efec47372270ced94fb154f59c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller80a76efec47372270ced94fb154f59c9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
const Controller80a76efec47372270ced94fb154f59c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller80a76efec47372270ced94fb154f59c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
Controller80a76efec47372270ced94fb154f59c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller80a76efec47372270ced94fb154f59c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/realisations'
*/
Controller80a76efec47372270ced94fb154f59c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller80a76efec47372270ced94fb154f59c9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller80a76efec47372270ced94fb154f59c9.form = Controller80a76efec47372270ced94fb154f59c9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
const Controller33e16ec6d20702965f95223554965b45 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller33e16ec6d20702965f95223554965b45.url(options),
    method: 'get',
})

Controller33e16ec6d20702965f95223554965b45.definition = {
    methods: ["get","head"],
    url: '/comment-ca-marche',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
Controller33e16ec6d20702965f95223554965b45.url = (options?: RouteQueryOptions) => {
    return Controller33e16ec6d20702965f95223554965b45.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
Controller33e16ec6d20702965f95223554965b45.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller33e16ec6d20702965f95223554965b45.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
Controller33e16ec6d20702965f95223554965b45.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller33e16ec6d20702965f95223554965b45.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
const Controller33e16ec6d20702965f95223554965b45Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller33e16ec6d20702965f95223554965b45.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
Controller33e16ec6d20702965f95223554965b45Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller33e16ec6d20702965f95223554965b45.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/comment-ca-marche'
*/
Controller33e16ec6d20702965f95223554965b45Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller33e16ec6d20702965f95223554965b45.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller33e16ec6d20702965f95223554965b45.form = Controller33e16ec6d20702965f95223554965b45Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
const Controller42bea899842c7f2ec0bbc297a4d0d60a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42bea899842c7f2ec0bbc297a4d0d60a.url(options),
    method: 'get',
})

Controller42bea899842c7f2ec0bbc297a4d0d60a.definition = {
    methods: ["get","head"],
    url: '/tarifs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
Controller42bea899842c7f2ec0bbc297a4d0d60a.url = (options?: RouteQueryOptions) => {
    return Controller42bea899842c7f2ec0bbc297a4d0d60a.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
Controller42bea899842c7f2ec0bbc297a4d0d60a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42bea899842c7f2ec0bbc297a4d0d60a.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
Controller42bea899842c7f2ec0bbc297a4d0d60a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller42bea899842c7f2ec0bbc297a4d0d60a.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
const Controller42bea899842c7f2ec0bbc297a4d0d60aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42bea899842c7f2ec0bbc297a4d0d60a.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
Controller42bea899842c7f2ec0bbc297a4d0d60aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42bea899842c7f2ec0bbc297a4d0d60a.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/tarifs'
*/
Controller42bea899842c7f2ec0bbc297a4d0d60aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42bea899842c7f2ec0bbc297a4d0d60a.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller42bea899842c7f2ec0bbc297a4d0d60a.form = Controller42bea899842c7f2ec0bbc297a4d0d60aForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
const Controller338d9c7544e957e263df5922fc3258d2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller338d9c7544e957e263df5922fc3258d2.url(options),
    method: 'get',
})

Controller338d9c7544e957e263df5922fc3258d2.definition = {
    methods: ["get","head"],
    url: '/legal/confidentialite',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
Controller338d9c7544e957e263df5922fc3258d2.url = (options?: RouteQueryOptions) => {
    return Controller338d9c7544e957e263df5922fc3258d2.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
Controller338d9c7544e957e263df5922fc3258d2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller338d9c7544e957e263df5922fc3258d2.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
Controller338d9c7544e957e263df5922fc3258d2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller338d9c7544e957e263df5922fc3258d2.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
const Controller338d9c7544e957e263df5922fc3258d2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller338d9c7544e957e263df5922fc3258d2.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
Controller338d9c7544e957e263df5922fc3258d2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller338d9c7544e957e263df5922fc3258d2.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/confidentialite'
*/
Controller338d9c7544e957e263df5922fc3258d2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller338d9c7544e957e263df5922fc3258d2.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller338d9c7544e957e263df5922fc3258d2.form = Controller338d9c7544e957e263df5922fc3258d2Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
const Controller2eaa15ec3576cd0f0e06b6d5b16e9b68 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url(options),
    method: 'get',
})

Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.definition = {
    methods: ["get","head"],
    url: '/legal/cgu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url = (options?: RouteQueryOptions) => {
    return Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
const Controller2eaa15ec3576cd0f0e06b6d5b16e9b68Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
Controller2eaa15ec3576cd0f0e06b6d5b16e9b68Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cgu'
*/
Controller2eaa15ec3576cd0f0e06b6d5b16e9b68Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller2eaa15ec3576cd0f0e06b6d5b16e9b68.form = Controller2eaa15ec3576cd0f0e06b6d5b16e9b68Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
const Controllerd07b96e456c3152d7ab41fa3f699b382 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerd07b96e456c3152d7ab41fa3f699b382.url(options),
    method: 'get',
})

Controllerd07b96e456c3152d7ab41fa3f699b382.definition = {
    methods: ["get","head"],
    url: '/legal/cookies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
Controllerd07b96e456c3152d7ab41fa3f699b382.url = (options?: RouteQueryOptions) => {
    return Controllerd07b96e456c3152d7ab41fa3f699b382.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
Controllerd07b96e456c3152d7ab41fa3f699b382.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerd07b96e456c3152d7ab41fa3f699b382.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
Controllerd07b96e456c3152d7ab41fa3f699b382.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerd07b96e456c3152d7ab41fa3f699b382.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
const Controllerd07b96e456c3152d7ab41fa3f699b382Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd07b96e456c3152d7ab41fa3f699b382.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
Controllerd07b96e456c3152d7ab41fa3f699b382Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd07b96e456c3152d7ab41fa3f699b382.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/cookies'
*/
Controllerd07b96e456c3152d7ab41fa3f699b382Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd07b96e456c3152d7ab41fa3f699b382.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllerd07b96e456c3152d7ab41fa3f699b382.form = Controllerd07b96e456c3152d7ab41fa3f699b382Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
const Controller8f01290d5ad1af1ecc228b69fc5a052d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8f01290d5ad1af1ecc228b69fc5a052d.url(options),
    method: 'get',
})

Controller8f01290d5ad1af1ecc228b69fc5a052d.definition = {
    methods: ["get","head"],
    url: '/legal/mentions-legales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
Controller8f01290d5ad1af1ecc228b69fc5a052d.url = (options?: RouteQueryOptions) => {
    return Controller8f01290d5ad1af1ecc228b69fc5a052d.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
Controller8f01290d5ad1af1ecc228b69fc5a052d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8f01290d5ad1af1ecc228b69fc5a052d.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
Controller8f01290d5ad1af1ecc228b69fc5a052d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller8f01290d5ad1af1ecc228b69fc5a052d.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
const Controller8f01290d5ad1af1ecc228b69fc5a052dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8f01290d5ad1af1ecc228b69fc5a052d.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
Controller8f01290d5ad1af1ecc228b69fc5a052dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8f01290d5ad1af1ecc228b69fc5a052d.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/legal/mentions-legales'
*/
Controller8f01290d5ad1af1ecc228b69fc5a052dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8f01290d5ad1af1ecc228b69fc5a052d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller8f01290d5ad1af1ecc228b69fc5a052d.form = Controller8f01290d5ad1af1ecc228b69fc5a052dForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
const Controller2913525142f6c71848c2fee3a0fcad0e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2913525142f6c71848c2fee3a0fcad0e.url(options),
    method: 'get',
})

Controller2913525142f6c71848c2fee3a0fcad0e.definition = {
    methods: ["get","head"],
    url: '/courses/purchase/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
Controller2913525142f6c71848c2fee3a0fcad0e.url = (options?: RouteQueryOptions) => {
    return Controller2913525142f6c71848c2fee3a0fcad0e.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
Controller2913525142f6c71848c2fee3a0fcad0e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2913525142f6c71848c2fee3a0fcad0e.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
Controller2913525142f6c71848c2fee3a0fcad0e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller2913525142f6c71848c2fee3a0fcad0e.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
const Controller2913525142f6c71848c2fee3a0fcad0eForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller2913525142f6c71848c2fee3a0fcad0e.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
Controller2913525142f6c71848c2fee3a0fcad0eForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller2913525142f6c71848c2fee3a0fcad0e.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/courses/purchase/success'
*/
Controller2913525142f6c71848c2fee3a0fcad0eForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller2913525142f6c71848c2fee3a0fcad0e.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller2913525142f6c71848c2fee3a0fcad0e.form = Controller2913525142f6c71848c2fee3a0fcad0eForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
const Controllerc476038bd2dac6c71ea48b9e3839544c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc476038bd2dac6c71ea48b9e3839544c.url(options),
    method: 'get',
})

Controllerc476038bd2dac6c71ea48b9e3839544c.definition = {
    methods: ["get","head"],
    url: '/become-trainer/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
Controllerc476038bd2dac6c71ea48b9e3839544c.url = (options?: RouteQueryOptions) => {
    return Controllerc476038bd2dac6c71ea48b9e3839544c.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
Controllerc476038bd2dac6c71ea48b9e3839544c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc476038bd2dac6c71ea48b9e3839544c.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
Controllerc476038bd2dac6c71ea48b9e3839544c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerc476038bd2dac6c71ea48b9e3839544c.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
const Controllerc476038bd2dac6c71ea48b9e3839544cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc476038bd2dac6c71ea48b9e3839544c.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
Controllerc476038bd2dac6c71ea48b9e3839544cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc476038bd2dac6c71ea48b9e3839544c.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/become-trainer/success'
*/
Controllerc476038bd2dac6c71ea48b9e3839544cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc476038bd2dac6c71ea48b9e3839544c.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllerc476038bd2dac6c71ea48b9e3839544c.form = Controllerc476038bd2dac6c71ea48b9e3839544cForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form

/**
* Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `Controller['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const Controller = {
    '/about': Controller535fd093ca1d5254af5dc12ac208e8d5,
    '/blog': Controller0281689d11c3db12eb0f0bc21b3e4ed4,
    '/contact': Controller36402f3b102b68b92616e946647e00cf,
    '/realisations': Controller80a76efec47372270ced94fb154f59c9,
    '/comment-ca-marche': Controller33e16ec6d20702965f95223554965b45,
    '/tarifs': Controller42bea899842c7f2ec0bbc297a4d0d60a,
    '/legal/confidentialite': Controller338d9c7544e957e263df5922fc3258d2,
    '/legal/cgu': Controller2eaa15ec3576cd0f0e06b6d5b16e9b68,
    '/legal/cookies': Controllerd07b96e456c3152d7ab41fa3f699b382,
    '/legal/mentions-legales': Controller8f01290d5ad1af1ecc228b69fc5a052d,
    '/courses/purchase/success': Controller2913525142f6c71848c2fee3a0fcad0e,
    '/become-trainer/success': Controllerc476038bd2dac6c71ea48b9e3839544c,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller