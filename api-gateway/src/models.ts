export interface Thread {
  threadId: string;
  title: string;
  body: string;
  assetUrls: string[];
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface ThreadList {
  threads: Thread[];
}

export interface ThreadId {
  threadId: string;
}

export interface Empty { }

export interface SearchQuery {
  query: string;
}

export interface VoteRequest {
  isThread: boolean;
  targetId: string;
  studentId: string;
}

export interface CountVoteRequest {
  isThread: boolean;
  targetId: string;
}

export interface Vote {
  isThread: boolean;
  targetId: string;
  studentId: string;
  voteType: number;  // 1 for upvote, -1 for downvote
}