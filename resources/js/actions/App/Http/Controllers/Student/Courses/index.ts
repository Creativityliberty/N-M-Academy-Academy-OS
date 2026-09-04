import CourseController from './CourseController'
import LessonProgressController from './LessonProgressController'
import LessonNoteController from './LessonNoteController'

const Courses = {
    CourseController: Object.assign(CourseController, CourseController),
    LessonProgressController: Object.assign(LessonProgressController, LessonProgressController),
    LessonNoteController: Object.assign(LessonNoteController, LessonNoteController),
}

export default Courses