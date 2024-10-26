import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUserId, createAuthCookie } from './libs/token';
import { verifyTicket } from './libs/auth';

const prisma = new PrismaClient();

console.log("Database connected");

const PROTO_PATH = '../proto/user.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const userService = protoDescriptor.UserService;

const updateUserProfile: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const userId = await getAuthenticatedUserId(call.metadata);
  if (!userId) {
    return callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Authentication required',
    });
  }

  const { displayname, profileImage } = call.request;
  const updateData: any = {};
  if (displayname !== undefined) updateData.displayname = displayname;
  if (profileImage !== undefined) updateData.profileImage = profileImage;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    callback(null, {
      userId: user.id,
      displayname: user.displayname,
      profileImage: user.profileImage,
      firstname: user.firstname,
      lastname: user.lastname,
      firstnameth: user.firstnameth,
      lastnameth: user.lastnameth,
      email: user.email,
    });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to update profile',
    });
  }
};

const getUserProfile: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const userId = await getAuthenticatedUserId(call.metadata);
  if (!userId) {
    return callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Authentication required',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: 'User not found',
    });
  }

  callback(null, {
    userId: user.id,
    displayname: user.displayname,
    profileImage: user.profileImage,
    firstname: user.firstname,
    lastname: user.lastname,
    firstnameth: user.firstnameth,
    lastnameth: user.lastnameth,
    email: user.email,
  });
};

const login: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const { ticket } = call.request;

  console.log('Ticket:', ticket);

  try {
    const verifiedUser = await verifyTicket(ticket);
    if (!verifiedUser) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid ticket',
      });
    }

    const cookieHeader = createAuthCookie(verifiedUser.id);
    const metadata = new grpc.Metadata();
    metadata.set('Set-Cookie', cookieHeader);
    callback(null, { message: 'Login successful', token: cookieHeader, userId: verifiedUser.id }, metadata);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Login failed',
    });
  }
};

const applyPin: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const userId = await getAuthenticatedUserId(call.metadata);
  if (!userId) {
    return callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Authentication required',
    });
  }

  const { threadId } = call.request;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        pinnedThreads: {
          push: threadId,
        },
      },
    });
    callback(null, { message: 'Thread pinned successfully' });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to pin thread',
    });
  }
};

const viewPinned: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const userId = await getAuthenticatedUserId(call.metadata);
  if (!userId) {
    return callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Authentication required',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: 'User not found',
    });
  }

  callback(null, { threadIds: user.pinnedThreads || [] });
};

const getUserDetail: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const authenticatedUserId = await getAuthenticatedUserId(call.metadata);
  if (!authenticatedUserId) {
    return callback({
      code: grpc.status.UNAUTHENTICATED,
      message: 'Authentication required',
    });
  }

  const { userId } = call.request;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        displayname: true,
        profileImage: true,
      }
    });

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }

    callback(null, user);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to fetch user details',
    });
  }
};

const getUsersWhoPinnedThread: grpc.handleUnaryCall<any, any> = async (call, callback) => {
  const { threadId } = call.request;
  if (!threadId) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Thread ID is required',
    });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        pinnedThreads: {
          has: threadId
        }
      },
      select: {
        id: true
      }
    });

    callback(null, { userIds: users.map(user => user.id) });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to fetch users who pinned the thread',
    });
  }
};

function main() {
  const server = new grpc.Server();
  server.addService(userService.service, {
    UpdateUserProfile: updateUserProfile,
    GetUserProfile: getUserProfile,
    Login: login,
    ApplyPin: applyPin,
    ViewPinned: viewPinned,
    GetUserDetail: getUserDetail,
    GetUsersWhoPinnedThread: getUsersWhoPinnedThread,
  });

  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || '5005';

  const address = `${host}:${port}`;

  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Server running at ${address}`);
    server.start();
  });
}

main();