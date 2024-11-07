const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

export const getGrpcRequest = (client: any) => {
    // Helper function to handle gRPC requests
    const grpcRequest = (method: string, requestData: any) => {
        return new Promise<any>((resolve, reject) => {
            client[method](requestData, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
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
