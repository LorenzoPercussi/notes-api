import { Request, Response, NextFunction } from "express";
import prisma from "../../db/prisma";
import { hashPassword, comparePassword } from "../../utils/hashing";
import { signAccessToken } from "../../utils/jwt";

function httpError(status: number, code: string, message: string) {
  const err = new Error(message) as Error & { status?: number; code?: string };
  err.status = status;
  err.code = code;
  return err;
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
      };

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return next(httpError(409, "EMAIL_IN_USE", "E-mail já está em uso."));
      }

      const password_hash = await hashPassword(password);

      const user = await prisma.user.create({
        data: { name, email, password_hash },
        select: { id: true, name: true, email: true, createdAt: true },
      });

      return res.status(201).json({ user });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return next(httpError(409, "EMAIL_IN_USE", "E-mail já está em uso."));
      }
      return next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(httpError(401, "INVALID_CREDENTIALS", "Credenciais inválidas."));
      }

      const ok = await comparePassword(password, user.password_hash);
      if (!ok) {
        return next(httpError(401, "INVALID_CREDENTIALS", "Credenciais inválidas."));
      }

      const accessToken = signAccessToken(user.id);

      return res.status(200).json({ accessToken });
    } catch (err) {
      return next(err);
    }
  },
};

export default authController;
