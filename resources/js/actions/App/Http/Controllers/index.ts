import Public from './Public'
import Community from './Community'
import Events from './Events'
import Mcp from './Mcp'
import MissionTower from './MissionTower'
import Admin from './Admin'
import Trainer from './Trainer'
import Student from './Student'
import Settings from './Settings'

const Controllers = {
    Public: Object.assign(Public, Public),
    Community: Object.assign(Community, Community),
    Events: Object.assign(Events, Events),
    Mcp: Object.assign(Mcp, Mcp),
    MissionTower: Object.assign(MissionTower, MissionTower),
    Admin: Object.assign(Admin, Admin),
    Trainer: Object.assign(Trainer, Trainer),
    Student: Object.assign(Student, Student),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers