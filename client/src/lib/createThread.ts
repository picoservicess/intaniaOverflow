import { threads } from "./data";

export interface newThread {
  title: string;
  body: string;
  assetUrls: string[];
  tags: string[];
  authorId: string;
}

export default async function createThread(newThread: newThread) {
  const completeThread = {
    id: (threads.length + 1).toString(),
    title: newThread.title,
    body: newThread.body,
    assetUrls: [],
    tags: newThread.tags,
    author: newThread.authorId, // Assuming a default authorId for now
    createdAt: new Date(),
    replies: 0,
    upvotes: 0,
    downvotes: 0,
  };

  threads.push(completeThread);
}
