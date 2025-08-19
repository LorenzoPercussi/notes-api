import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export async function signAccessToken(userId: string): Promise<string> {
  return jwt.sign({}, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
    subject: userId,
    issuer: "notes-api",
  });
}

export function verifyToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "notes-api",
    }) as JwtPayload;

    if (!decoded.sub || typeof decoded.sub !== "string") {
      throw new Error("Invalid token subject");
    }

    return { userId: decoded.sub };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw { status: 401, code: "TOKEN_EXPIRED", message: "Token expired" };
    }
    if (err instanceof JsonWebTokenError) {
      throw { status: 401, code: "TOKEN_INVALID", message: "Invalid token" };
    }
    throw err;
  }
}
