"use server";

import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

//get latest products
export async function getLatestProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: LATEST_PRODUCTS_LIMIT,
  });
  return convertToPlainObject(products);
}

//get single product by slug

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
