import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import pages from './pages'
import students from './students'
import sales from './sales'
import analytics from './analytics'
import academyAi from './academy-ai'
import courseCreation from './course-creation'
import courseReview from './course-review'
import tutor from './tutor'
import courses from './courses'
import lessons from './lessons'
import assessments from './assessments'
import assignments from './assignments'
import completion from './completion'
import certificates from './certificates'
import learningAccess from './learning-access'
import stripeConnect from './stripe-connect'
/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/trainer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Trainer\DashboardController::dashboard
* @see app/Http/Controllers/Trainer/DashboardController.php:15
* @route '/trainer/dashboard'
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

const trainer = {
    dashboard: Object.assign(dashboard, dashboard),
    pages: Object.assign(pages, pages),
    students: Object.assign(students, students),
    sales: Object.assign(sales, sales),
    analytics: Object.assign(analytics, analytics),
    academyAi: Object.assign(academyAi, academyAi),
    courseCreation: Object.assign(courseCreation, courseCreation),
    courseReview: Object.assign(courseReview, courseReview),
    tutor: Object.assign(tutor, tutor),
    courses: Object.assign(courses, courses),
    lessons: Object.assign(lessons, lessons),
    assessments: Object.assign(assessments, assessments),
    assignments: Object.assign(assignments, assignments),
    completion: Object.assign(completion, completion),
    certificates: Object.assign(certificates, certificates),
    learningAccess: Object.assign(learningAccess, learningAccess),
    stripeConnect: Object.assign(stripeConnect, stripeConnect),
}

export default trainer