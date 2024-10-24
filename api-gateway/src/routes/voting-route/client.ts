import grpc from "@grpc/grpc-js";
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = "../proto/voting.proto";

// Load protobuf file
var packageDefinition = protoLoader.loadSync( 
  PROTO_PATH, 
  {keepCase: true, 
  longs: String, 
  enums: String, 
  defaults: true, 
  oneofs: true 
  }); 

const votingProto = grpc.loadPackageDefinition(packageDefinition) as any;

const port = process.env.PORT || "5006";
const client = new votingProto.VotingService(
  `localhost:${port}`, // gRPC server address
  grpc.credentials.createInsecure()
);

export default client;
