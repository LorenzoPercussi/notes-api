import { Router } from "express";
import { z } from "zod";
import validate from "../middlewares/validate";
import authController from "../controllers/auth.controller";

const authRouter = Router();

const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.email(),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Rotas
authRouter.post("/register", validate(RegisterSchema, "body"), authController.register);

authRouter.post("/login", validate(LoginSchema, "body"), authController.login);

export default authRouter;
