"use client";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.action";
const AddToCart = ({ items }: { items: CartItem }) => {
  const router = useRouter();
  const handleAddCart = async () => {
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
  };
  return (
    <Button className="w-full mt-4" type="button" onClick={handleAddCart}>
      <Plus /> Add to cart
    </Button>
  );
};
export default AddToCart;
