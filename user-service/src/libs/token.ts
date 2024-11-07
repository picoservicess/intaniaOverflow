import * as grpc from "@grpc/grpc-js";
import jwt from "jsonwebtoken";

const { JWT_SECRET = "your_jwt_secret" } = process.env;

export const decodeJWT = (token: string): { userId: string } | null => {
  console.log("JWT_SECRET", JWT_SECRET);
  console.log("token", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    console.log("decoded", decoded);

    return decoded;
  } catch (error) {
    return null;
  }
};

export const getAuthenticatedUserId = async (
  metadata: grpc.Metadata
): Promise<string | null> => {
  const authHeader = metadata.get("authorization");
  if (!authHeader || typeof authHeader[0] !== "string") {
    return null;
  }

  // Extract the token from the Bearer format
  const bearerToken = authHeader[0];
  if (!bearerToken.startsWith("Bearer ")) {
    return null;
  }

  const token = bearerToken.substring(7); // Remove 'Bearer ' prefix
  if (!token) {
    return null;
  }

  return decodeJWT(token)?.userId ?? null;
};

export const createAuthCookie = (userId: string): string => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};
