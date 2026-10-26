import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function databaseUrl() {
  if (!process.env.VERCEL) return process.env.DATABASE_URL;

  const dest = "/tmp/taiphat.db";
  if (!fs.existsSync(dest)) {
    const candidates = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
    ];
    const src = candidates.find((file) => fs.existsSync(file));
    if (src) fs.copyFileSync(src, dest);
  }
  return "file:/tmp/taiphat.db";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
