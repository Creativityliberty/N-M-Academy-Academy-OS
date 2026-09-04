import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
export const pdf = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/certificates/verify/{verificationCode}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
pdf.url = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{verificationCode}', parsedArgs.verificationCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
pdf.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
pdf.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
const pdfForm = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
pdfForm.get = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\CertificateVerificationController::pdf
* @see app/Http/Controllers/Public/CertificateVerificationController.php:36
* @route '/certificates/verify/{verificationCode}/pdf'
*/
pdfForm.head = (args: { verificationCode: string | number } | [verificationCode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const verify = {
    pdf: Object.assign(pdf, pdf),
}

export default verify