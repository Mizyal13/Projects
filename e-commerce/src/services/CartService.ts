import { api } from "./api";
import type { CartItem } from "@/context/CartContext";

export const checkoutCart = async (items: CartItem[]) => {
  const payload = {
    items: items.map((item) => ({
      productId: Number(item.id),
      qty: item.quantity,
    })),
  };
  const res = await api.post("/order", payload);
  return res.data;
};
