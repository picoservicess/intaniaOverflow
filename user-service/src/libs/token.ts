import jwt from 'jsonwebtoken';

const {
  JWT_SECRET = 'your_jwt_secret',
} = process.env;

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
}