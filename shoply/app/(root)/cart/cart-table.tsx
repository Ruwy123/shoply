"use client";
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { ArrowLeft, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-4 h2-bold"> Shopping Cart</h1>
      {!cart || cart.items.length == 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug} className="border-gray-300">
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );
                            if (!res.success) {
                              toast.error(res?.message);
                            }
                          })
                        }
                        className="border-gray-300"
                        variant="outline"
                        type="button"
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4 " />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast.error(res?.message);
                            }
                          })
                        }
                        className="border-gray-300"
                        variant="outline"
                        type="button"
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 " />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};
export default CartTable;
