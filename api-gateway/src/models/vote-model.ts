export interface VoteRequest {
  isThread: boolean;
  targetId: string;
}

export interface VoteCount {
  upVotes: number;
  downVotes: number;
  netVotes: number;
}

export interface VoteStatus {
  voteStatus: {
    hasVoted: boolean;
    voteType?: 'up' | 'down';
  };
}