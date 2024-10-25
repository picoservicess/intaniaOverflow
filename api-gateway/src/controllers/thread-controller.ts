import { Request, Response } from "express";
import { Thread } from "../models/thread-model";
import { getGrpcRequest } from "../utils/grpc";
import threadClient from "../routes/thread-route/client";

const grpcRequest = getGrpcRequest(threadClient);

// Get all threads
export const getAllThreads = async (req: Request, res: Response) => {
    try {
        const threads = await grpcRequest("getAllThreads", {});
        res.status(200).json(threads);
    } catch (error) {
        console.error("Error fetching threads:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Get thread by ID
export const getThreadById = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        const thread = await grpcRequest("getThreadById", { threadId });
        if (thread) {
            res.status(200).json(thread);
        } else {
            res.status(404).send("Thread not found");
        }
    } catch (error) {
        console.error("Error fetching thread:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Create a new thread
export const createThread = async (req: Request, res: Response) => {
    try {
        const newThread: Thread = req.body;
        const thread = await grpcRequest("createThread", newThread);
        console.log("Thread created successfully", thread);
        res.status(201).json(thread);
    } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update existing thread
export const updateThread = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        const updatedThread: Thread = req.body;
        const thread = await grpcRequest("updateThread", {
            threadId,
            updatedThread,
        });
        if (thread) {
            res.status(200).json(thread);
        } else {
            res.status(404).send("Thread not found");
        }
    } catch (error) {
        console.error("Error updating thread:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete thread
export const deleteThread = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.threadId;
        await grpcRequest("deleteThread", { threadId });
        res.status(200).json({});
    } catch (error) {
        console.error("Error deleting thread:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Search threads
export const searchThreads = async (req: Request, res: Response) => {
    try {
        const query = (req.query.query as string) || "";
        const threads = await grpcRequest("searchThreads", { query });
        res.status(200).json(threads);
    } catch (error) {
        console.error("Error searching threads:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Health check
export const healthCheck = async (req: Request, res: Response) => {
    try {
        const health = await grpcRequest("healthCheck", {});
        res.status(200).json(health);
    } catch (error) {
        console.error("Error checking health:", error);
        res.status(500).send("Internal Server Error");
    }
};
