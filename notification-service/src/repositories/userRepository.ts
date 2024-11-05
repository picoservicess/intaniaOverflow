import { initiateGrpcProto } from "../utils/grpc";

const grpc = require("@grpc/grpc-js");

const PROTO_PATH = "../proto/user.proto";

const userProto = initiateGrpcProto(PROTO_PATH);

const host = process.env.USER_SERVICE_HOST || "localhost";
const port = process.env.USER_SERVICE_PORT || "5005";

const userClient = new userProto.UserService(
    `${host}:${port}`,
    grpc.credentials.createInsecure()
);

console.log(" User client connected to", `${host}:${port}`);

export default userClient;