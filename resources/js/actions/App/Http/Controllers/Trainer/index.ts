import DashboardController from './DashboardController'
import PageBuilderController from './PageBuilderController'
import StudentsController from './StudentsController'
import SalesController from './SalesController'
import CommerceController from './CommerceController'
import AnalyticsController from './AnalyticsController'
import AcademyAiController from './AcademyAiController'
import CourseCreationController from './CourseCreationController'
import CourseReviewController from './CourseReviewController'
import TutorSettingsController from './TutorSettingsController'
import Courses from './Courses'
import AssessmentController from './AssessmentController'
import AssignmentController from './AssignmentController'
import CompletionController from './CompletionController'
import LearningAccessController from './LearningAccessController'
import StripeConnectController from './StripeConnectController'

const Trainer = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    PageBuilderController: Object.assign(PageBuilderController, PageBuilderController),
    StudentsController: Object.assign(StudentsController, StudentsController),
    SalesController: Object.assign(SalesController, SalesController),
    CommerceController: Object.assign(CommerceController, CommerceController),
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
    AcademyAiController: Object.assign(AcademyAiController, AcademyAiController),
    CourseCreationController: Object.assign(CourseCreationController, CourseCreationController),
    CourseReviewController: Object.assign(CourseReviewController, CourseReviewController),
    TutorSettingsController: Object.assign(TutorSettingsController, TutorSettingsController),
    Courses: Object.assign(Courses, Courses),
    AssessmentController: Object.assign(AssessmentController, AssessmentController),
    AssignmentController: Object.assign(AssignmentController, AssignmentController),
    CompletionController: Object.assign(CompletionController, CompletionController),
    LearningAccessController: Object.assign(LearningAccessController, LearningAccessController),
    StripeConnectController: Object.assign(StripeConnectController, StripeConnectController),
}

export default Trainer