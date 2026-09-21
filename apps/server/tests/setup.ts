import { beforeAll, afterAll } from "vitest";
import { prisma } from "../src/lib/prisma";

beforeAll(async () => {
  // Pre-connect and warm up connection pool
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      break;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}, 30000);

afterAll(async () => {
  await prisma.$disconnect();
});
