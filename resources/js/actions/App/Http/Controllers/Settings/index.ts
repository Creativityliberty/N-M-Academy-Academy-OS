import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import AiProvidersController from './AiProvidersController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    SecurityController: Object.assign(SecurityController, SecurityController),
    AiProvidersController: Object.assign(AiProvidersController, AiProvidersController),
}

export default Settings