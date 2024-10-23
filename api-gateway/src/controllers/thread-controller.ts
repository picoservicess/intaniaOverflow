import { Request, Response } from "express";
import { Thread } from "../models/thread-model";

// Sample data (replace with a real database or other storage)
let threads: Thread[] = [];

// Get all threads
export const getAllThreads = (req: Request, res: Response) => {
    res.json({ threads });
};

// Get thread by ID
export const getThreadById = (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const thread = threads.find((t) => t.threadId === threadId);

    if (thread) {
        res.json(thread);
    } else {
        res.status(404).send("Thread not found");
    }
};

// Create a new thread
export const createThread = (req: Request, res: Response) => {
    const newThread: Thread = req.body;
    newThread.threadId = `thread_${threads.length + 1}`; // Mock ID generation
    threads.push(newThread);
    res.status(201).json(newThread);
};

// Update existing thread
export const updateThread = (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const updatedThread: Thread = req.body;

    const threadIndex = threads.findIndex((t) => t.threadId === threadId);
    if (threadIndex >= 0) {
        threads[threadIndex] = { ...updatedThread, threadId }; // Preserve original ID
        res.json(threads[threadIndex]);
    } else {
        res.status(404).send("Thread not found");
    }
};

// Delete thread
export const deleteThread = (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    threads = threads.filter((t) => t.threadId !== threadId);
    res.status(204).send(); // No Content
};

// Search threads
export const searchThreads = (req: Request, res: Response) => {
    const query = (req.query.query as string) || "";
    const results = threads.filter(
        (thread) => thread.title.includes(query) || thread.body.includes(query)
    );
    res.json({ threads: results });
};

// Health check
export const healthCheck = (req: Request, res: Response) => {
    res.status(200).send("OK");
};
