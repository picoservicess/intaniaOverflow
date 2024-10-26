import { NextFunction, Request, Response } from 'express';

export interface AuthError extends Error {
    statusCode: number;
    message: string;
}

/**
 * Validates and extracts the Bearer token from the authorization header
 * @param req Express request object
 * @returns The extracted token
 * @throws AuthError if token is invalid or missing
 */
export const validateAuth = (req: Request): string => {
    const auth = req.headers.authorization;

    if (!auth) {
        const error = new Error('No authorization header') as AuthError;
        error.statusCode = 401;
        error.message = 'Authorization header is required';
        throw error;
    }

    const [bearer, token] = auth.split(' ');

    if (bearer !== 'Bearer' || !token) {
        const error = new Error('Invalid authorization format') as AuthError;
        error.statusCode = 401;
        error.message = "Invalid authorization format. Use 'Bearer <token>'";
        throw error;
    }

    return token;
};

/**
 * Express middleware to handle authorization
 */
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = validateAuth(req);
        // Attach token to request for later use
        (req as any).token = token;
        next();
    } catch (error) {
        const authError = error as AuthError;
        res.status(authError.statusCode || 401).json({
            error: authError.message || 'Unauthorized',
        });
    }
};

/**
 * Wraps controller functions to handle common errors
 * @param fn Controller function
 * @returns Wrapped controller function
 */
export const controllerWrapper = (
    fn: (req: Request, res: Response) => Promise<void>
) => {
    return async (req: Request, res: Response) => {
        try {
            await fn(req, res);
        } catch (error: any) {
            console.error(`Controller error: ${error.message}`, error);

            // Handle known error types
            if (error.statusCode) {
                res.status(error.statusCode).json({
                    error: error.message,
                });
                return;
            }

            // Handle gRPC specific errors
            if (error.code) {
                const statusCode = grpcToHttpStatus(error.code);
                res.status(statusCode).json({
                    error: error.details || error.message,
                });
                return;
            }

            // Default error response
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    };
};

/**
 * Converts gRPC status codes to HTTP status codes
 */
const grpcToHttpStatus = (grpcCode: number): number => {
    const statusMap: Record<number, number> = {
        0: 200, // OK
        1: 499, // CANCELLED
        2: 500, // UNKNOWN
        3: 400, // INVALID_ARGUMENT
        4: 504, // DEADLINE_EXCEEDED
        5: 404, // NOT_FOUND
        6: 409, // ALREADY_EXISTS
        7: 403, // PERMISSION_DENIED
        16: 401, // UNAUTHENTICATED
        // Add more mappings as needed
    };
    return statusMap[grpcCode] || 500;
};
