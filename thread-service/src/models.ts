export interface Thread {
  id: string;
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
  id: string;
}

export interface Empty {}

export interface SearchQuery {
  query: string;
}