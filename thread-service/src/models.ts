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

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface GetAllThreadsParams {
  page: number;
  pageSize: number;
}

export interface GetAllThreadsResponse {
  threads: Thread[];
  pagination: Pagination;
}

export interface SearchThreadsResponse {
  threads: Thread[];
  pagination: Pagination;
}