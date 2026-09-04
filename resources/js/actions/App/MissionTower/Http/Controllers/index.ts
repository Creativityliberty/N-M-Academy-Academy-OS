import TowerChatController from './TowerChatController'
import MemoryController from './MemoryController'
import MissionCompilerController from './MissionCompilerController'
import MissionController from './MissionController'
import ApprovalController from './ApprovalController'
import RunController from './RunController'
import EvidenceController from './EvidenceController'
import InsightsController from './InsightsController'

const Controllers = {
    TowerChatController: Object.assign(TowerChatController, TowerChatController),
    MemoryController: Object.assign(MemoryController, MemoryController),
    MissionCompilerController: Object.assign(MissionCompilerController, MissionCompilerController),
    MissionController: Object.assign(MissionController, MissionController),
    ApprovalController: Object.assign(ApprovalController, ApprovalController),
    RunController: Object.assign(RunController, RunController),
    EvidenceController: Object.assign(EvidenceController, EvidenceController),
    InsightsController: Object.assign(InsightsController, InsightsController),
}

export default Controllers