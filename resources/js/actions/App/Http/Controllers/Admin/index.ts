import DashboardController from './DashboardController'
import Courses from './Courses'
import Plans from './Plans'
import AcademyFactoryController from './AcademyFactoryController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    Courses: Object.assign(Courses, Courses),
    Plans: Object.assign(Plans, Plans),
    AcademyFactoryController: Object.assign(AcademyFactoryController, AcademyFactoryController),
}

export default Admin