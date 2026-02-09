"use client";
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { useTransition } from "react";

const AddToCart = ({ cart, items }: { cart?: Cart; items: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAddCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(items);
      if (!res || !res.success) {
        toast.error(res?.message || "Failed to add item to cart");
        return;
      }
      //handle success add to cart
      toast(res.message, {
        className: "bg-primary text-white hover:bg-gray-800 z-10",

        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
        actionButtonStyle: {
          backgroundColor: "black",
          color: "#ffffff",
          borderRadius: "3px",
        },
      });
    });
  };
  const handleRemoveItem = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(items.productId);
      if (!res || !res.success) {
        toast.error(res?.message || "Failed to remove item from cart");
      }
      return;
    });
  };

  //check if item is in cart
  const existItem =
    cart && cart.items.find((i) => i.productId === items.productId);
  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveItem}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full mt-4" type="button" onClick={handleAddCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add to cart
    </Button>
  );
};
export default AddToCart;
