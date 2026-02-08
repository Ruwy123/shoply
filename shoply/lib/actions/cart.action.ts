"use server";
import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, roundTwo } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";

//calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundTwo(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = roundTwo(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundTwo(0.15 * itemsPrice),
    totalPrice = roundTwo(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //get cart
    const cart = await getMyCart();
    //parse and validate item
    const item = cartItemSchema.parse(data);

    //get product from database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      //create new cart
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      //add to db
      await prisma.cart.create({
        data: newCart,
      });

      //revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    } else {
      //check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.productId === item.productId,
      );
      if (existItem) {
        //check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }
        //increase the quantity
        //(cart.items as CartItem[]).find((i)=>i.productId === item.productId)!.qty = existItem.qty + 1

        existItem.qty += 1;
      } else {
        //if item does not exist in cart
        //check stock
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        //add item to the cart.items
        cart.items.push(item);
      }
      //save to database
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");
    //get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    //get user cart
    const userCart = await getMyCart();
    if (!userCart) throw new Error("Cart not found");

    //check if cart has item
    const exist = (userCart.items as CartItem[]).find(
      (i) => i.productId === productId,
    );
    if (!exist) throw new Error("Item not found in cart");

    //check if only one in quantiry
    if (exist.qty === 1) {
      //remove from cart
      userCart.items = (userCart.items as CartItem[]).filter(
        (i) => i.productId !== exist.productId,
      );
    } else {
      //decrease qty
      (userCart.items as CartItem[]).find(
        (i) => i.productId === productId,
      )!.qty = exist.qty - 1;
    }
    //update in database
    await prisma.cart.update({
      where: { id: userCart.id },
      data: {
        items: userCart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(userCart.items as CartItem[]),
      },
    });
    revalidatePath(`/product/${product.slug}`);
    return { success: true, message: `${product.name} removed from cart` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
