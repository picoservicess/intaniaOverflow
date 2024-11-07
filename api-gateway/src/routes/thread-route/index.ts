import express from "express";

import {
    createThread,
    deleteThread,
    getAllThreads,
    getThreadById,
    healthCheck,
    searchThreads,
    updateThread,
} from "../../controllers/thread-controller";
import { authMiddleware } from "../../middleware/auth";
import { createLogMiddleware } from "../../middleware/log";

const threadRouter = express.Router();

// Register a middleware to log all requests
threadRouter.use(createLogMiddleware('thread-service'));

// Health check
threadRouter.get("/health", healthCheck);

// Get all threads
threadRouter.get("/", getAllThreads);

// Search threads
threadRouter.get("/search", searchThreads);

// Get thread by ID
threadRouter.get("/:threadId", getThreadById);

// Create a new thread
threadRouter.post("", authMiddleware, createThread);

// Update existing thread
threadRouter.put("/:threadId", authMiddleware, updateThread);

// Delete thread
threadRouter.delete("/:threadId", authMiddleware, deleteThread);

export default threadRouter;
