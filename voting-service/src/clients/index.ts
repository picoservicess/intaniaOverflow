import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Path to your .proto file
const PROTO_PATH = "../proto/voting.proto";
// Load protobuf file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const votingProto = grpc.loadPackageDefinition(packageDefinition) as any;

const port = process.env.PORT || "5000";
const client = new votingProto.VotingService(
  `localhost:${port}`, // gRPC server address
  grpc.credentials.createInsecure()
);

export default client;
