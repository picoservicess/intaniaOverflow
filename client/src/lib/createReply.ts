import { replies } from "./data";

export interface newReply {
  body: string;
  assetUrls: string[];
  authorId: string;
}

export default async function createReply(newReply: newReply) {
  const completeReply = {
    id: (replies.length + 1).toString(),
    body: newReply.body,
    assetUrls: [],
    author: newReply.authorId, // Assuming a default authorId for now
    createdAt: new Date(),
    upvotes: 0,
    downvotes: 0,
  };

  replies.push(completeReply);
}
