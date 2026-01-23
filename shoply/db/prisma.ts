import { PrismaClient } from "@/app/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

import ws from "ws";

// 1. Setup WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// 2. Logic to prevent multiple Prisma instances in development
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined. Please check your .env file.",
    );
  }

  //const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon({ connectionString });
  // const adapter = new PrismaNeon(pool);

  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          compute(product) {
            return product.rating.toString();
          },
        },
      },
    },
  });
};

// 3. Attach to global object to persist across hot-reloads
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
