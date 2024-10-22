import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { PrismaClient, Thread } from "@prisma/client";
import { Empty, ThreadList, SearchQuery, ThreadId } from "./models";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { sanitizeThreadRequest } from "./decorator";
import { z } from "zod";

const PROTO_PATH = "../proto/thread.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

var threadProto = grpc.loadPackageDefinition(packageDefinition) as any;

const prisma = new PrismaClient();

console.log("Database connected");

const server = new grpc.Server();

const HOST = process.env.THREAD_SERVICE_HOST || "0.0.0.0";
const PORT = Number(process.env.THREAD_SERVICE_PORT) || 30043;
const address = `${HOST}:${PORT}`;

server.addService(threadProto.ThreadService.service, {
    getAllThreads: async (
        _: ServerUnaryCall<Empty, ThreadList>,
        callback: sendUnaryData<ThreadList>
    ) => {
        try {
            const threads = await prisma.thread.findMany({
                where: {
                    isDeleted: false,
                },
            });
            callback(null, { threads });
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
            console.log(call.request);
            const thread = await prisma.thread.findUnique({
                where: {
                    threadId: call.request.threadId,
                    isDeleted: false,
                },
            });
            if (thread) {
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

    createThread: async (
        call: ServerUnaryCall<Thread, Thread>,
        callback: sendUnaryData<Thread>
    ) => {
        try {
            const threadSchema = z.object({
                threadId: z.string().uuid().optional(),
                title: z.string().min(1),
                body: z.string().min(1),
                assetUrls: z.array(z.string()).optional(),
                tags: z.array(z.string()).optional(),
                authorId: z.string().uuid(),
                createdAt: z.date().optional(),
                updatedAt: z.date().optional(),
                isDeleted: z.boolean().optional(),
            });
            const sanitizedRequest = threadSchema
                .omit({
                    threadId: true,
                    updatedAt: true,
                    createdAt: true,
                    isDeleted: true,
                })
                .parse(call.request);

            const validationResult = threadSchema.safeParse(sanitizedRequest);

            console.log(validationResult);

            if (!validationResult.success) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid thread data",
                });
                return;
            }

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

    updateThread: async (
        call: ServerUnaryCall<Thread, Thread>,
        callback: sendUnaryData<Thread>
    ) => {
        try {
            const thread = await prisma.thread.findUnique({
                where: {
                    threadId: call.request.threadId,
                    isDeleted: false,
                },
            });

            if (!thread) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found",
                });
            }
            const updatedThread = await prisma.thread.update({
                where: {
                    threadId: call.request.threadId,
                },
                data: sanitizeThreadRequest(call.request),
            });
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
    deleteThread: async (
        call: ServerUnaryCall<ThreadId, Empty>,
        callback: sendUnaryData<Empty>
    ) => {
        try {
            const thread = await prisma.thread.findUnique({
                where: {
                    threadId: call.request.threadId,
                },
            });

            if (!thread) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found",
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
        call: ServerUnaryCall<SearchQuery, ThreadList>,
        callback: sendUnaryData<ThreadList>
    ) => {
        try {
            const threads = await prisma.thread.findMany({
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
                },
            });
            callback(null, { threads });
        } catch (error) {
            console.error(`searchThreads: ${error}`);
            callback({
                code: grpc.status.INTERNAL,
                details: "Interal Server Error",
            });
        }
    },

    // TODO : healthCheck
    healthCheck: async (
        _: ServerUnaryCall<Empty, Empty>,
        callback: sendUnaryData<Empty>
    ) => {
        callback(null, {});
    },
});

try {
    server.bindAsync(
        address,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) {
                console.error("Error binding server:", error);
                return;
            }
            console.log(`Thread service server is running on port ${port}`);
            server.start();
        }
    );
} catch (error) {
    console.error(`Failed to bind server: ${error}`);
}
