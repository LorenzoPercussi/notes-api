import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  let status = 500;
  let code = "INTERNAL_ERROR";
  let message = "Erro interno do servidor";
  let details: unknown = undefined;

  if (err instanceof ZodError) {
    status = 400;
    code = "VALIDATION_ERROR";
    message = "Requisição inválida";
    details = err.issues;
  } else if (typeof err.status === "number") {
    status = err.status;
    code = err.code ?? code;
    message = err.message ?? message;
    details = err.details;
  } else if (err?.code === "P2002") {
    status = 409;
    code = "CONFLICT";
    message = "Registro duplicado";
  } else if (err?.code === "TOKEN_EXPIRED" || err?.code === "TOKEN_INVALID") {
    status = 401;
    code = err.code;
    message = err.message;
  }

  const payload: Record<string, unknown> = { code, message };

  if (process.env.NODE_ENV === "development" && details) {
    payload.details = details;
  }

  return res.status(status).json(payload);
}
