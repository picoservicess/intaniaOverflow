import jwt from 'jsonwebtoken';
import * as grpc from '@grpc/grpc-js';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { decodeJWT } from './token';

const prisma = new PrismaClient();

const {
  JWT_SECRET = 'your_jwt_secret',
  CU_AUTH_URL = 'https://account.it.chula.ac.th/serviceValidation',
  CU_APP_ID = 'your-app-id',
  CU_APP_SECRET = 'your-app-secret'
} = process.env;


interface VerifiedUser {
  id: string;
  displayname: string;
  profileImage: string;
}

interface CuAuthResponse {
  uid: string;
  username: string;
  gecos: string;
  email: string;
  disable: boolean;
  roles: string[];
  firstname: string;
  lastname: string;
  firstnameth: string;
  lastnameth: string;
  ouid: string;
}

export const getAuthenticatedUserId = async (metadata: grpc.Metadata): Promise<string | null> => {
  const authHeader = metadata.get('authorization');
  if (!authHeader || typeof authHeader[0] !== 'string') {
    return null;
  }

  // Extract the token from the Bearer format
  const bearerToken = authHeader[0];
  if (!bearerToken.startsWith('Bearer ')) {
    return null;
  }

  const token = bearerToken.substring(7); // Remove 'Bearer ' prefix
  if (!token) {
    return null;
  }

  return decodeJWT(token)?.userId ?? null;
};


export const createAuthCookie = (userId: string): string => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export const verifyTicket = async (ticket: string): Promise<VerifiedUser | null> => {
  try {
    // console.log('Verifying ticket:', ticket);
    // console.log('CU_AUTH_URL:', CU_AUTH_URL);
    // console.log('CU_APP_ID:', CU_APP_ID);
    // console.log('CU_APP_SECRET:', CU_APP_SECRET);

    const response = await axios.get(CU_AUTH_URL, {
      headers: {
        'DeeTicket': ticket,
        'DeeAppId': CU_APP_ID,
        'DeeAppSecret': CU_APP_SECRET
      }
    });

    if (!response.data) {
      return null;
    }

    const cuData = response.data as CuAuthResponse;

    // Create or update user in your database
    const user = await prisma.user.upsert({
      where: {
        studentId: cuData.username
      },
      update: {
        email: cuData.email,
        // displayname: `${cuData.firstname} ${cuData.lastname}`,
        firstname: cuData.firstname,
        lastname: cuData.lastname,
        firstnameth: cuData.firstnameth,
        lastnameth: cuData.lastnameth,
        // roles: cuData.roles,
      },
      create: {
        studentId: cuData.username,
        email: cuData.email,
        displayname: `${cuData.firstname} ${cuData.lastname}`,
        firstname: cuData.firstname,
        lastname: cuData.lastname,
        firstnameth: cuData.firstnameth,
        lastnameth: cuData.lastnameth,
        // roles: cuData.roles,
        profileImage: null,
        pinnedThreads: [],
      },
    });

    return {
      id: user.id,
      displayname: user.displayname,
      profileImage: user.profileImage ?? '',
    };
  } catch (error) {
    console.error('Ticket verification failed:', error);
    return null;
  }
};