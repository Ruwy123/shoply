// import { PrismaClient } from "../app/generated/prisma/client";
// import sampleData from "./sample-data";

// const prisma = new PrismaClient();
// async function main(){
//   await prisma.product.deleteMany();
//   await prisma.product.createMany({ data: sampleData.products });
//   console.log("Database has been seeded successfully.");
// }

import sampleData from "@/db/sample-data";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });
  console.log("Database has been seeded successfully.");
}

main();
