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

const threadRouter = express.Router();

// Get all threads
threadRouter.get("/threads", getAllThreads);

// Get thread by ID
threadRouter.get("/threads/:threadId", getThreadById);

// Create a new thread
threadRouter.post("/threads", authMiddleware, createThread);

// Update existing thread
threadRouter.put("/threads/:threadId", authMiddleware, updateThread);

// Delete thread
threadRouter.delete("/threads/:threadId", authMiddleware, deleteThread);

// Search threads
threadRouter.get("/threads/search", searchThreads);

// Health check
threadRouter.get("/health/threads", healthCheck);

export default threadRouter;
