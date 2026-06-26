import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma como singleton para evitar multiples conexiones en desarrollo
 * (hot-reload). En produccion se crea una sola instancia.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
