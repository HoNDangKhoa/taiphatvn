import { PrismaClient } from "@prisma/client";

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.includes("-pooler.") || url.includes("pgbouncer=")) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}pgbouncer=true&connection_limit=1`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
