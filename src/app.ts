import express from "express";
import cors from "cors";

import healthRouter from "./http/routes/health.routes";
import authRouter from "./http/routes/auth.routes";
import notesRouter from "./http/routes/notes.routes";
import errorHandler from "./http/middlewares/error.handler";
export const app = express();

app.use(express.json());
app.use(cors());

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/notes", notesRouter);

app.use((req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Rota não encontrada" });
});
app.use(errorHandler);
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status =
    typeof err?.status === "number"
      ? err.status
      : err?.name === "ZodError"
      ? 400
      : err?.code === "UNAUTHORIZED"
      ? 401
      : 500;

  const payload: Record<string, unknown> = {
    code: err?.code ?? "INTERNAL_ERROR",
    message: err?.message ?? "Erro interno do servidor",
  };

  if (process.env.NODE_ENV === "development" && err) {
    payload.details = err?.issues ?? err;
  }

  res.status(status).json(payload);
});
