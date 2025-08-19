import { PrismaClient } from "@prisma/client";

const isProd = process.env.NODE_ENV === "production";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ["error"] : ["query", "warn", "error"],
  });

if (!isProd) {
  globalForPrisma.prisma = prisma;
}

process.on("beforeExit", async () => {
  try {
    await prisma.$disconnect();
  } catch {}
});

export default prisma;
