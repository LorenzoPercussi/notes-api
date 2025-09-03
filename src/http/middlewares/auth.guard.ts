import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";

export default function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ code: "UNAUTHORIZED", message: "Missing/invalid Bearer token" });
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyToken(token);

    req.user = { id: payload.userId };

    next();
  } catch (err: any) {
    if (err.code === "TOKEN_EXPIRED" || err.code === "TOKEN_INVALID") {
      return res.status(401).json({
        code: err.code,
        message: err.message,
      });
    }

    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Não autorizado",
    });
  }
}
