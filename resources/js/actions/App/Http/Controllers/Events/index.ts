import EventController from './EventController'
import EventManagementController from './EventManagementController'
import EventRegistrationController from './EventRegistrationController'

const Events = {
    EventController: Object.assign(EventController, EventController),
    EventManagementController: Object.assign(EventManagementController, EventManagementController),
    EventRegistrationController: Object.assign(EventRegistrationController, EventRegistrationController),
}

export default Events