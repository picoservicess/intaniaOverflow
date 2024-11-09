/* eslint-disable @typescript-eslint/no-unused-vars */

interface UserProfile {
    userId: string;
    displayname: string;
    firstname: string;
    lastname: string;
    firstnameth: string;
    lastnameth: string;
    profileImage: string;
    email: string;
}

interface ThreadRequest {
    title: string;
    body: string;
    assetUrls: string[];
    tags: string[];
    authorId: string;
    isAnonymous: boolean;
}

interface ReplyRequest {
    text: string;
    assetUrls: string[];
}

interface GetAllThreadResponse {
    threads: Thread[];
}

interface Thread {
    assetUrls: string[];
    tags: string[];
    threadId: string;
    title: string;
    body: string;
    authorId: string;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

interface SearchThreadResponse {
    threads: Thread[];
    pagination: Pagination;
}

interface Reply {
    replyId: string;
    threadId: string;
    userId: string;
    text: string;
    assetUrls: string[];
    replyAt: string;
    editAt: string | null;
    edited: boolean;
    isDeleted: boolean;
}

interface User {
    displayname: string;
    profileImage: string;
}

interface ViewPinned {
    threadIds: string[];
}

interface VoteCounts {
    upVotes: number;
    downVotes: number;
    netVotes: number;
}

interface VoteStatus {
    voteStatus: number;
}

interface ApplyUpVote {
    message: string;
    result: {
        success: boolean;
        message: string;
    };
}

interface ApplyDownVote {
    message: string;
    result: {
        success: boolean;
        message: string;
    };
}

interface PostListProps {
    threads: Thread[];
    userDetails: User[];
    voteCounts: VoteCounts[];
    voteStatuses: number[];
    replyCounts: number[];
    pinStatuses: boolean[];
}