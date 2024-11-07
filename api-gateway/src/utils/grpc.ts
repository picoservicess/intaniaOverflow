const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

interface AuthOptions {
    token?: string;
}

export const getGrpcRequest = (client: any) => {
    // Helper function to handle gRPC requests with authorization
    const grpcRequest = (
        method: string,
        requestData: any,
        authOptions?: AuthOptions
    ) => {
        return new Promise<any>((resolve, reject) => {
            // Create metadata container
            const metadata = new grpc.Metadata();

            if (authOptions) {
                // Add Bearer token if provided
                if (authOptions.token) {
                    metadata.add(
                        "authorization",
                        `Bearer ${authOptions.token}`
                    );
                }
            }
            // Make the gRPC call with metadata
            client[method](
                requestData,
                metadata,
                (error: any, response: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                }
            );
        });
    };
    return grpcRequest;
};

export const initiateGrpcProto = (protoPath: string) => {
    // Load protobuf file
    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDefinition) as any;

    return proto;
};
