import { Thread } from "@prisma/client";

export const sanitizeThreadRequest = (
  thread: Partial<Thread>
): Partial<Thread> => {
  const { threadId, ...updatedThread } = thread;

  updatedThread.updatedAt = new Date();

  if (updatedThread.authorId) {
    delete updatedThread.authorId;
  }
  if (updatedThread.createdAt) {
    delete updatedThread.createdAt;
  }
  if (updatedThread.isDeleted) {
    delete updatedThread.isDeleted;
  }
  return updatedThread;
};

export const applyAnonymity = (thread: Thread): Thread => {
  const newThread = { ...thread };
  const isAnonymous = thread?.isAnonymous;
  if (isAnonymous) {
    newThread.authorId = "";
  }
  return newThread;
};
