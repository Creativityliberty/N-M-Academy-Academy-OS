import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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

const lessons = {
    generateAudio: Object.assign(generateAudio, generateAudio),
}

export default lessons