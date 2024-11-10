import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { PrismaClient, Thread } from "@prisma/client";
import { z } from "zod";

import { getAuthenticatedUserId } from "../../user-service/src/libs/token";
import { applyAnonymity, sanitizeThreadRequest } from "./decorator";
import { RequestPage, RequestPageSize } from "./enums/request-enum";
import {
  Empty,
  GetAllThreadsParams,
  GetAllThreadsResponse,
  Pagination,
  SearchQuery,
  SearchThreadsResponse,
  ThreadId,
  ThreadList,
} from "./models";
import { rabbitMQManager } from "./rabbitMQManager";

const PROTO_PATH = "../proto/thread.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var threadProto = grpc.loadPackageDefinition(packageDefinition) as any;

const prisma = new PrismaClient();

console.log("🥳 Database connected");

const server = new grpc.Server();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 5004;
const address = `${HOST}:${PORT}`;

server.addService(threadProto.ThreadService.service, {
  getAllThreads: async (
    call: ServerUnaryCall<GetAllThreadsParams, GetAllThreadsResponse>,
    callback: sendUnaryData<GetAllThreadsResponse>
  ) => {
    try {
      const page = call.request?.page || RequestPage.DEFAULT;

      let pageSize = call.request?.pageSize || RequestPageSize.DEFAULT;
      pageSize = Math.min(pageSize, RequestPageSize.MAX);

      const rawThreads = await prisma.thread.findMany({
        where: {
          isDeleted: false,
        },
        skip: page * pageSize,
        take: pageSize,
        orderBy: {
          updatedAt: "desc",
        },
      });

      const totalItems = await prisma.thread.count({
        where: {
          isDeleted: false,
        },
      });

      const pagination: Pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
        pageSize: pageSize,
        totalItems: totalItems,
      };

      const threads = rawThreads.map((thread) => applyAnonymity(thread));

      callback(null, { threads: threads, pagination: pagination });
    } catch (error) {
      console.error(`getAllThreads: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error",
      });
    }
  },

  getThreadById: async (
    call: ServerUnaryCall<ThreadId, Thread>,
    callback: sendUnaryData<Thread>
  ) => {
    try {
      const rawThread = await prisma.thread.findUnique({
        where: {
          threadId: call.request.threadId,
          isDeleted: false,
        },
      });
      if (rawThread) {
        const thread = applyAnonymity(rawThread);
        callback(null, thread);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not found",
        });
      }
    } catch (error) {
      console.error(`getThreadById: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error",
      });
    }
  },

  getMyThreads: async (
    call: ServerUnaryCall<Empty, ThreadList>,
    callback: sendUnaryData<ThreadList>
  ) => {
    const userId = await getAuthenticatedUserId(call.metadata);
    if (!userId) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        details: "Authentication required",
      });
    }
    try {
      const threads = await prisma.thread.findMany({
        where: {
          authorId: userId,
          isDeleted: false
        }
      });
      callback(null, { threads });
    } catch (error) {
      console.error(`getMyThreads: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error"
      })
    }
  },

  createThread: async (
    call: ServerUnaryCall<Thread, Thread>,
    callback: sendUnaryData<Thread>
  ) => {
    const userId = await getAuthenticatedUserId(call.metadata);
    if (!userId) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        details: "Authentication required",
      });
    }

    try {
      const threadSchema = z.object({
        threadId: z.string().uuid().optional(),
        title: z.string().min(1),
        body: z.string().min(1),
        assetUrls: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        authorId: z.string().uuid(),
        isAnonymous: z.boolean().optional(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        isDeleted: z.boolean().optional(),
      });

      const sanitizedRequest = {
        ...threadSchema
          .omit({
            threadId: true,
            updatedAt: true,
            createdAt: true,
            isDeleted: true,
            authorId: true,
          })
          .parse(call.request),
        authorId: userId, // Enforce the authenticated user's ID
      };

      const thread = await prisma.thread.create({
        data: sanitizedRequest,
      });
      callback(null, thread);
    } catch (error) {
      console.error(`createThread: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error",
      });
    }
  },

  updateThread: async (call: ServerUnaryCall<Thread, Thread>, callback: sendUnaryData<Thread>) => {
    const userId = await getAuthenticatedUserId(call.metadata);
    if (!userId) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        details: "Authentication required",
      });
    }

    try {
      // First check if thread exists
      const thread = await prisma.thread.findUnique({
        where: {
          threadId: call.request.threadId,
          isDeleted: false, // Only allow updates on non-deleted threads
        },
      });

      if (!thread) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "Thread not found or has been deleted",
        });
      }

      // Then check ownership
      const isOwner = thread.authorId === userId;
      if (!isOwner) {
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          details: "You don't have permission to update this thread",
        });
      }

      const updatedThread = await prisma.thread.update({
        where: {
          threadId: call.request.threadId,
        },
        data: sanitizeThreadRequest(call.request),
      });

      try {
        await rabbitMQManager.publishMessage(updatedThread);
      } catch (mqError) {
        console.error("Failed to publish message to RabbitMQ:", mqError);
      }

      callback(null, updatedThread);
    } catch (error) {
      console.error(`updateThread: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error",
      });
    }
  },

  // TODO : deleteThread
  deleteThread: async (call: ServerUnaryCall<ThreadId, Empty>, callback: sendUnaryData<Empty>) => {
    const userId = await getAuthenticatedUserId(call.metadata);
    if (!userId) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        details: "Authentication required",
      });
    }

    try {
      // First check if thread exists
      const thread = await prisma.thread.findUnique({
        where: {
          threadId: call.request.threadId,
          isDeleted: false, // Only allow deletion of non-deleted threads
        },
      });

      if (!thread) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "Thread not found or has already been deleted",
        });
      }

      // Then check ownership
      const isOwner = thread.authorId === userId;
      if (!isOwner) {
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          details: "You don't have permission to delete this thread",
        });
      }

      await prisma.thread.update({
        where: {
          threadId: call.request.threadId,
        },
        data: {
          isDeleted: true,
        },
      });
      callback(null, {});
    } catch (error) {
      console.error(`deleteThread: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error",
      });
    }
  },

  // TODO : searchThread
  searchThreads: async (
    call: ServerUnaryCall<SearchQuery, SearchThreadsResponse>,
    callback: sendUnaryData<SearchThreadsResponse>
  ) => {
    try {
      const page = call.request?.page || RequestPage.DEFAULT;

      let pageSize = call.request?.pageSize || RequestPageSize.DEFAULT;
      pageSize = Math.min(pageSize, RequestPageSize.MAX);

      const rawThreads = await prisma.thread.findMany({
        where: {
          OR: [
            {
              title: {
                contains: call.request.query,
                mode: "insensitive",
              },
            },
            {
              body: {
                contains: call.request.query,
                mode: "insensitive",
              },
            },
          ],
          isDeleted: false, // Only show non-deleted threads in search
        },
        skip: page * pageSize,
        take: pageSize,
      });

      const totalItems = await prisma.thread.count({
        where: {
          OR: [
            {
              title: {
                contains: call.request.query,
                mode: "insensitive",
              },
            },
            {
              body: {
                contains: call.request.query,
                mode: "insensitive",
              },
            },
          ],
          isDeleted: false,
        },
      });

      const pagination: Pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
        pageSize: pageSize,
        totalItems: totalItems,
      };

      const threads = rawThreads.map((thread) => applyAnonymity(thread));

      callback(null, { threads: threads, pagination: pagination });
    } catch (error) {
      console.error(`searchThreads: ${error}`);
      callback({
        code: grpc.status.INTERNAL,
        details: "Interal Server Error",
      });
    }
  },

  // TODO : healthCheck
  healthCheck: async (_: ServerUnaryCall<Empty, Empty>, callback: sendUnaryData<Empty>) => {
    callback(null, {});
  },
});

try {
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error("🚨 Error binding server:", error);
      return;
    }
    console.log(`💻 Thread service server is running on port ${port}`);
    server.start();
  });
} catch (error) {
  console.error(`Failed to bind server: ${error}`);
}
