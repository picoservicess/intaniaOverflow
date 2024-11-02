import { initiateGrpcProto } from "../../utils/grpc";

const grpc = require("@grpc/grpc-js");

const PROTO_PATH = "../proto/thread.proto";

const threadProto = initiateGrpcProto(PROTO_PATH);

const host = process.env.THREAD_SERVICE_HOST || "localhost";
const port = process.env.THREAD_SERVICE_PORT || "5004";

const threadClient = new threadProto.ThreadService(
  `${host}:${port}`,
  grpc.credentials.createInsecure()
);

console.log("🧵 Thread client connected to", `${host}:${port}`);

export default threadClient;
