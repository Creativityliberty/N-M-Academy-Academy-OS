import CommunityController from './CommunityController'
import CommunityPostController from './CommunityPostController'
import CommunityCommentController from './CommunityCommentController'
import CommunityReactionController from './CommunityReactionController'
import CommunityModerationController from './CommunityModerationController'
import CommunitySpaceController from './CommunitySpaceController'

const Community = {
    CommunityController: Object.assign(CommunityController, CommunityController),
    CommunityPostController: Object.assign(CommunityPostController, CommunityPostController),
    CommunityCommentController: Object.assign(CommunityCommentController, CommunityCommentController),
    CommunityReactionController: Object.assign(CommunityReactionController, CommunityReactionController),
    CommunityModerationController: Object.assign(CommunityModerationController, CommunityModerationController),
    CommunitySpaceController: Object.assign(CommunitySpaceController, CommunitySpaceController),
}

export default Community