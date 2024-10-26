import { Router, Request, Response } from 'express';
import { decodeJWT } from '../../../user-service/src/libs/token';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: Function
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No bearer token provided' });
      return
    }

    const token = authHeader.substring(7);
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      res.status(401).json({ error: 'Invalid token' });
      return
    }

    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
    return
  }
};