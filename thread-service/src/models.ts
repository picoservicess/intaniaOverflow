export interface Thread {
  threadId: string;
  title: string;
  body: string;
  assetUrls: string[];
  tags: string[];
  authorId: string;
  isAnonymous: boolean;
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

export interface Empty {}

export interface SearchQuery {
  query: string;
  page: number;
  pageSize: number;
}

export interface GetAllThreadsParams {
  page: number;
  pageSize: number;
}