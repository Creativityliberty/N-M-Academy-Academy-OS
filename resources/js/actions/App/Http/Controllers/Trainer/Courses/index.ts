import CourseMediaController from './CourseMediaController'
import CourseController from './CourseController'

const Courses = {
    CourseMediaController: Object.assign(CourseMediaController, CourseMediaController),
    CourseController: Object.assign(CourseController, CourseController),
}

export default Courses