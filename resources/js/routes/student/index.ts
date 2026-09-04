import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import courses from './courses'
import certificates from './certificates'
import lessons from './lessons'
import assessments from './assessments'
import assignments from './assignments'
import tutor from './tutor'
import memberships from './memberships'
/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/student/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
* @see app/Http/Controllers/Student/DashboardController.php:16
* @route '/student/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

const student = {
    dashboard: Object.assign(dashboard, dashboard),
    courses: Object.assign(courses, courses),
    certificates: Object.assign(certificates, certificates),
    lessons: Object.assign(lessons, lessons),
    assessments: Object.assign(assessments, assessments),
    assignments: Object.assign(assignments, assignments),
    tutor: Object.assign(tutor, tutor),
    memberships: Object.assign(memberships, memberships),
}

export default student