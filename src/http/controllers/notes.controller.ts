import { Request, Response, NextFunction } from "express";
import prisma from "../../db/prisma";

function httpError(status: number, code: string, message: string) {
  const err = new Error(message) as Error & { status?: number; code?: string };
  err.status = status;
  err.code = code;
  return err;
}

export const notesController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, tags } = req.body as {
        title: string;
        content: string;
        tags?: string[];
      };

      const note = await prisma.note.create({
        data: {
          title,
          content,
          tags: tags ?? [],
          userId: req.user!.id,
        },
      });

      return res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt((req.query.page as string) || "1");
      const pageSize = parseInt((req.query.pageSize as string) || "10");
      const q = req.query.q as string | undefined;
      const tag = req.query.tag as string | undefined;

      const where: any = { userId: req.user!.id };

      if (q) {
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ];
      }

      if (tag) {
        where.tags = { has: tag };
      }

      const total = await prisma.note.count({ where });

      const notes = await prisma.note.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      });

      return res.json({ data: notes, page, pageSize, total });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const note = await prisma.note.findFirst({
        where: { id, userId: req.user!.id },
      });

      if (!note) return next(httpError(404, "NOT_FOUND", "Nota não encontrada"));

      return res.json(note);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;

      const existing = await prisma.note.findFirst({
        where: { id, userId: req.user!.id },
      });
      if (!existing) return next(httpError(404, "NOT_FOUND", "Nota não encontrada"));

      const note = await prisma.note.update({
        where: { id },
        data: { title, content, tags },
      });

      return res.json(note);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.note.findFirst({
        where: { id, userId: req.user!.id },
      });
      if (!existing) return next(httpError(404, "NOT_FOUND", "Nota não encontrada"));

      await prisma.note.delete({ where: { id } });

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default notesController;
