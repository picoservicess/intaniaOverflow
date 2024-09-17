import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { PrismaClient, Thread } from "@prisma/client";
import { Empty, ThreadList, ThreadId, SearchQuery } from "./models";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { prepareUpdateThread } from "./decorator";

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
            const thread = await prisma.thread.findUnique({
                where: {
                    id: call.request.id,
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
            const thread = await prisma.thread.create({
                data: call.request,
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
                    id: call.request.id,
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
                    id: call.request.id,
                },
                data: prepareUpdateThread(call.request),
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
                where: call.request,
            });

            if (!thread) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found",
                });
            }

            await prisma.thread.update({
                where: {
                    id: call.request.id,
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
});

try {
    server.bindAsync(
        "127.0.0.1:30043",
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(
                "Thread Service Server running at http://127.0.0.1:30043"
            );
        }
    );
} catch (error) {
    console.error(`Failed to bind server: ${error}`);
}
