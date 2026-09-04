import Home from './Home'
import AcademyPageController from './AcademyPageController'
import CertificateVerificationController from './CertificateVerificationController'
import Courses from './Courses'
import BecomeTrainer from './BecomeTrainer'
import WebhookController from './WebhookController'

const Public = {
    Home: Object.assign(Home, Home),
    AcademyPageController: Object.assign(AcademyPageController, AcademyPageController),
    CertificateVerificationController: Object.assign(CertificateVerificationController, CertificateVerificationController),
    Courses: Object.assign(Courses, Courses),
    BecomeTrainer: Object.assign(BecomeTrainer, BecomeTrainer),
    WebhookController: Object.assign(WebhookController, WebhookController),
}

export default Public