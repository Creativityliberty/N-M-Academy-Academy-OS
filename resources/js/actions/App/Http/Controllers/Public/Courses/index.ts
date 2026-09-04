import CourseController from './CourseController'
import CheckoutController from './CheckoutController'

const Courses = {
    CourseController: Object.assign(CourseController, CourseController),
    CheckoutController: Object.assign(CheckoutController, CheckoutController),
}

export default Courses