import { Request, Response } from "express";

import { controllerWrapper, validateAuth } from "../middleware/auth";
import { Thread } from "../models/thread-model";
import threadClient from "../routes/thread-route/client";
import { getGrpcRequest } from "../utils/grpc";

const grpcRequest = getGrpcRequest(threadClient);

// Get all threads
export const getAllThreads = controllerWrapper(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 0;
    const pageSize = Number(req.query.pageSize) || 25;
    const threads = await grpcRequest("getAllThreads", { page, pageSize });
    res.status(200).json(threads);
  }
);

// Get thread by ID
export const getThreadById = controllerWrapper(
  async (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const thread = await grpcRequest("getThreadById", { threadId });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    res.status(200).json(thread);
  }
);

// Create a new thread
export const createThread = controllerWrapper(
  async (req: Request, res: Response) => {
    const token = validateAuth(req);
    const newThread: Thread = req.body;

    const thread = await grpcRequest("createThread", newThread, { token });
    res.status(201).json(thread);
  }
);

// Update existing thread
export const updateThread = controllerWrapper(
  async (req: Request, res: Response) => {
    const token = validateAuth(req);
    const threadId = req.params.threadId;
    const updatedThread = { ...req.body, threadId };

    const thread = await grpcRequest("updateThread", updatedThread, {
      token,
    });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }

    res.status(200).json(thread);
  }
);

// Delete thread
export const deleteThread = controllerWrapper(
  async (req: Request, res: Response) => {
    const token = validateAuth(req);
    const threadId = req.params.threadId;

    await grpcRequest("deleteThread", { threadId }, { token });
    res.status(200).json({ message: "Thread deleted successfully" });
  }
);

// Search threads
export const searchThreads = controllerWrapper(
  async (req: Request, res: Response) => {
    const query = (req.query.query as string) || "";
    const page = Number(req.query.page) || 0;
    const pageSize = Number(req.query.pageSize) || 25;
    const threads = await grpcRequest("searchThreads", { query, page, pageSize });
    res.status(200).json(threads);
  }
);

// Health check
export const healthCheck = controllerWrapper(
  async (req: Request, res: Response) => {
    const health = await grpcRequest("healthCheck", {});
    res.status(200).json(health);
  }
);
