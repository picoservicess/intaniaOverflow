import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { PrismaClient, Thread } from "@prisma/client";
import { Empty, ThreadList, ThreadId } from "./utils";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "../proto/thread.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var threadProto = grpc.loadPackageDefinition(packageDefinition);

const prisma = new PrismaClient();

const server = new grpc.Server();

server.addService(threadProto.ThreadService.service, {
  getAllThreads: async (
    _: ServerUnaryCall<Empty, ThreadList>,
    callback: sendUnaryData<ThreadList>
  ) => {
    const threads = await prisma.thread.findMany();
    callback(null, { threads });
  },

  getThreadById: async (
    call: ServerUnaryCall<ThreadId, Thread>,
    callback: sendUnaryData<Thread>
  ) => {
    const thread = await prisma.thread.findUnique({
      where: call.request,
    });
    if (thread) {
      callback(null, thread);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  createThread: async (
    call: ServerUnaryCall<Thread, Thread>,
    callback: sendUnaryData<Thread>
  ) => {
    const thread = await prisma.thread.create({
      data: call.request,
    });
    callback(null, thread);
  },

  // TODO : updateThread

  // TODO : deleteThread

  // TODO : searchThread
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err?: Error) => {
    if (err) {
      console.error(`Failed to bind server: ${err.message}`);
      return;
    }
    console.log("Thread Service Server running at http://127.0.0.1:30043");
  }
);
