import { ZodError } from "zod";
import type { ZodObject } from "zod";
import type { RequestHandler } from "express";

type PayloadKey = "body" | "query" | "params";

export default function validate(schema: ZodObject, from: PayloadKey): RequestHandler {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse((req as any)[from]);
      (req as any)[from] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next({
          status: 400,
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          details: err.issues,
        });
      }
      return next({
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid request",
      });
    }
  };
}
