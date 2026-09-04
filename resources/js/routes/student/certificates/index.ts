import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/certificates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::index
* @see app/Http/Controllers/Student/CertificateController.php:17
* @route '/student/certificates'
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
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
export const pdf = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/student/certificates/{certificate}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
pdf.url = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { certificate: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { certificate: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            certificate: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        certificate: typeof args.certificate === 'object'
        ? args.certificate.id
        : args.certificate,
    }

    return pdf.definition.url
            .replace('{certificate}', parsedArgs.certificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
pdf.get = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
pdf.head = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
const pdfForm = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
pdfForm.get = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\CertificateController::pdf
* @see app/Http/Controllers/Student/CertificateController.php:46
* @route '/student/certificates/{certificate}/pdf'
*/
pdfForm.head = (args: { certificate: number | { id: number } } | [certificate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const certificates = {
    index: Object.assign(index, index),
    pdf: Object.assign(pdf, pdf),
}

export default certificates