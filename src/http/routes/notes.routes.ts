import { Router } from "express";
import { z } from "zod";
import validate from "../middlewares/validate";
import authGuard from "../middlewares/auth.guard";
import notesController from "../controllers/notes.controller";

const notesRouter = Router();

const NoteCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  tags: z.array(z.string()).max(10).optional(),
});

const NoteUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
});

const IdParamSchema = z.object({
  id: z.string().uuid(),
});

notesRouter.use(authGuard);

notesRouter.post("/", validate(NoteCreateSchema, "body"), notesController.create);

notesRouter.get("/", notesController.list);

notesRouter.get("/:id", validate(IdParamSchema, "params"), notesController.getById);

notesRouter.put(
  "/:id",
  validate(IdParamSchema, "params"),
  validate(NoteUpdateSchema, "body"),
  notesController.update
);

notesRouter.delete("/:id", validate(IdParamSchema, "params"), notesController.remove);

export default notesRouter;
