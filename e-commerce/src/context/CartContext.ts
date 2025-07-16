import { createContext } from "react";

export type ProductType = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  stock?: number;
};
export type CartItem = ProductType & { quantity: number };
export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: ProductType) => void;
  removeFromCart: (id: string) => void;
  plusQty: (id: string) => void;
  minQty: (id: string) => void;
  setCart: (cart: CartItem[]) => void;
};
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
