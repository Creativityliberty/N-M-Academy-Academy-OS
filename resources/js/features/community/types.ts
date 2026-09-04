export type CommunityReactionType = 'like' | 'celebrate' | 'insightful';

export type ReactionState = {
    count: number;
    reacted: boolean;
};

export type CommunityAuthor = {
    id: number;
    name: string;
    avatar: string | null;
};

export type CommunityComment = {
    id: number;
    body: string;
    createdAt: string | null;
    isHidden: boolean;
    canModerate: boolean;
    author: CommunityAuthor;
    reactions: Record<CommunityReactionType, ReactionState>;
};

export type CommunityAttachment = {
    id: number;
    name: string;
    mimeType: string;
    size: number;
    url: string;
};

export type CommunitySpace = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    position?: number;
    postsCount?: number;
};

export type CommunityPost = {
    id: number;
    title: string;
    body: string;
    createdAt: string | null;
    updatedAt: string | null;
    isPinned: boolean;
    isLocked: boolean;
    isHidden: boolean;
    commentsCount: number;
    space: Pick<CommunitySpace, 'id' | 'name' | 'slug'>;
    author: CommunityAuthor;
    attachments: CommunityAttachment[];
    reactions: Record<CommunityReactionType, ReactionState>;
    comments: CommunityComment[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedCommunityPosts = {
    data: CommunityPost[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
};

export type CommunityFilters = {
    space: string | null;
    q: string;
};

export type CommunityPageProps = {
    spaces: CommunitySpace[];
    posts: PaginatedCommunityPosts;
    filters: CommunityFilters;
    canModerate: boolean;
};
