import DashboardController from './DashboardController'
import Courses from './Courses'
import CertificateController from './CertificateController'
import AssessmentController from './AssessmentController'
import AssignmentController from './AssignmentController'
import TutorController from './TutorController'
import MembershipController from './MembershipController'

const Student = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    Courses: Object.assign(Courses, Courses),
    CertificateController: Object.assign(CertificateController, CertificateController),
    AssessmentController: Object.assign(AssessmentController, AssessmentController),
    AssignmentController: Object.assign(AssignmentController, AssignmentController),
    TutorController: Object.assign(TutorController, TutorController),
    MembershipController: Object.assign(MembershipController, MembershipController),
}

export default Student