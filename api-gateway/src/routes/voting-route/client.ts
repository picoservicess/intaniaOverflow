import { initiateGrpcProto } from "../../utils/grpc";

const grpc = require("@grpc/grpc-js");

const PROTO_PATH = "../proto/voting.proto";

const votingProto = initiateGrpcProto(PROTO_PATH);

const host = process.env.VOTING_SERVICE_HOST || "voting-service";
const port = process.env.VOTING_SERVICE_PORT || "5006";

const votingClient = new votingProto.VotingService(
	`${host}:${port}`, // gRPC server address
	grpc.credentials.createInsecure()
);

console.log("📩 Voting client connected to", `${host}:${port}`);

export default votingClient;
