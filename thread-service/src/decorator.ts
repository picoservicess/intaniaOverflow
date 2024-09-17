import { Thread } from "@prisma/client";

export const prepareUpdateThread = (
    thread: Partial<Thread>
): Partial<Thread> => {
    const { id, ...updatedThread } = thread;
    
    updatedThread.updatedAt = new Date();
    
    if (updatedThread.createdAt) {
        delete updatedThread.createdAt;
    }
    if (updatedThread.isDeleted) {
        delete updatedThread.isDeleted;
    }
    return updatedThread;
};
