export interface VoteRequest {
    isThread: boolean;
    targetId: string;
}

export interface VoteCount {
    upVotes: number;
    downVotes: number;
    netVotes: number;
}
