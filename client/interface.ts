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