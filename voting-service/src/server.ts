import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import { connectDB } from "./db/database";
import { votingService } from "./services/votingService";

const PROTO_PATH = "../proto/voting.proto";
console.log(`PROTO_PATH: ${PROTO_PATH}`);

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
console.log("Proto package definition loaded.");

// Load the package definition into gRPC
const votingProto = grpc.loadPackageDefinition(packageDefinition) as any;

async function main() {
  // Connect to MongoDB
  await connectDB();

  // Create a new gRPC server
  const server = new grpc.Server();

  // Add the service to the server
  server.addService(votingProto.VotingService.service, votingService);

  // Define the port
  const port = process.env.PORT || "5006";

  // Start the server
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`Server running at http://0.0.0.0:${port}`);
      server.start();
    }
  );
}

// Run the main function
main().catch((err) => {
  console.error("Error starting server:", err);
});
