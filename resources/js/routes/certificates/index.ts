import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import verify8ef1b2 from './verify'
/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
export const verify = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})

verify.definition = {
    methods: ["get","head"],
    url: '/certificates/verify/{verificationCode}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
verify.url = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { verificationCode: args }
    }

    if (Array.isArray(args)) {
        args = {
            verificationCode: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        verificationCode: args.verificationCode,
    }

    return verify.definition.url
            .replace('{verificationCode}', parsedArgs.verificationCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
verify.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
verify.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verify.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
const verifyForm = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verify.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
verifyForm.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verify.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::verify
* @see app/Http/Controllers/Public/CertificateVerificationController.php:16
* @route '/certificates/verify/{verificationCode}'
*/
verifyForm.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verify.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verify.form = verifyForm

const certificates = {
    verify: Object.assign(verify, verify8ef1b2),
}

export default certificates