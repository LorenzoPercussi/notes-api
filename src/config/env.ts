import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL ausente no .env"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET ausente no .env"),
  PORT: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive())
    .default("3000" as unknown as number),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = EnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT ?? "3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
});

if (!parsed.success) {
  console.error("Erro ao validar variáveis de ambiente:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const { DATABASE_URL, JWT_SECRET, PORT, NODE_ENV } = parsed.data;
