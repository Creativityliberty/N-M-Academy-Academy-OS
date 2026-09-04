import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
export const generateImage = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateImage.url(args, options),
    method: 'post',
})

generateImage.definition = {
    methods: ["post"],
    url: '/trainer/courses/{course}/generate-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
generateImage.url = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
    }

    return generateImage.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
generateImage.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
const generateImageForm = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateImage
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:21
* @route '/trainer/courses/{course}/generate-image'
*/
generateImageForm.post = (args: { course: number | { id: number } } | [course: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateImage.url(args, options),
    method: 'post',
})

generateImage.form = generateImageForm

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateAudio
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:44
* @route '/trainer/lessons/{lesson}/generate-audio'
*/
export const generateAudio = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAudio.url(args, options),
    method: 'post',
})

generateAudio.definition = {
    methods: ["post"],
    url: '/trainer/lessons/{lesson}/generate-audio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateAudio
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:44
* @route '/trainer/lessons/{lesson}/generate-audio'
*/
generateAudio.url = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lesson: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lesson: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lesson: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lesson: typeof args.lesson === 'object'
        ? args.lesson.id
        : args.lesson,
    }

    return generateAudio.definition.url
            .replace('{lesson}', parsedArgs.lesson.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateAudio
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:44
* @route '/trainer/lessons/{lesson}/generate-audio'
*/
generateAudio.post = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAudio.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateAudio
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:44
* @route '/trainer/lessons/{lesson}/generate-audio'
*/
const generateAudioForm = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateAudio.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Trainer\Courses\CourseMediaController::generateAudio
* @see app/Http/Controllers/Trainer/Courses/CourseMediaController.php:44
* @route '/trainer/lessons/{lesson}/generate-audio'
*/
generateAudioForm.post = (args: { lesson: number | { id: number } } | [lesson: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateAudio.url(args, options),
    method: 'post',
})

generateAudio.form = generateAudioForm

const CourseMediaController = { generateImage, generateAudio }

export default CourseMediaController