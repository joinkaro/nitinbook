"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { productBySlug } from "@/lib/products";

export type CartLine = { slug:string; size:string; quantity:number };
type ShopContextValue = {
  cart: CartLine[];
  cartCount: number;
  addToCart: (slug:string, size:string, quantity?:number) => void;
  removeFromCart: (slug:string, size:string) => void;
  updateQuantity: (slug:string, size:string, quantity:number) => void;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

declare global {
  interface Document { modelContext?: { registerTool: (tool: unknown, options?: {signal?:AbortSignal}) => void | Promise<void> } }
}

export function ShopProvider({children}:{children:React.ReactNode}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try { setCart(JSON.parse(localStorage.getItem("vantage-cart") || "[]")); } catch { setCart([]); }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("vantage-cart", JSON.stringify(cart)); }, [cart, hydrated]);

  const addToCart = (slug:string, size:string, quantity=1) => setCart(current => {
    const found = current.find(line => line.slug === slug && line.size === size);
    return found ? current.map(line => line === found ? {...line, quantity:line.quantity + quantity} : line) : [...current, {slug, size, quantity}];
  });
  const removeFromCart = (slug:string, size:string) => setCart(current => current.filter(line => !(line.slug === slug && line.size === size)));
  const updateQuantity = (slug:string, size:string, quantity:number) => setCart(current => quantity < 1 ? current.filter(line => !(line.slug === slug && line.size === size)) : current.map(line => line.slug === slug && line.size === size ? {...line, quantity} : line));
  const clearCart = () => setCart([]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool({ name:"add_product_to_cart", title:"Add product to cart", description:"Add a Nitin Sports product to the visible shopping cart using its slug, size and quantity.", inputSchema:{type:"object",properties:{slug:{type:"string"},size:{type:"string"},quantity:{type:"integer",minimum:1}},required:["slug","size","quantity"],additionalProperties:false}, annotations:{readOnlyHint:false,untrustedContentHint:false}, execute(input:unknown){ const value=input as {slug:string;size:string;quantity:number}; const product=productBySlug(value.slug); if(!product) throw new Error("Unknown product"); if(!product.sizes.includes(value.size)) throw new Error("Invalid size"); addToCart(value.slug,value.size,value.quantity); return {status:"added",product:product.name,size:value.size,quantity:value.quantity}; } }, {signal:lifecycle.signal});
      await context.registerTool({ name:"view_cart", title:"View cart", description:"Read the current Nitin Sports cart summary.", inputSchema:{type:"object",properties:{},additionalProperties:false}, annotations:{readOnlyHint:true,untrustedContentHint:false}, execute(){ return {items:cart,quantity:cart.reduce((sum,line)=>sum+line.quantity,0)}; } }, {signal:lifecycle.signal});
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [cart]);

  const value = useMemo(() => ({cart, cartCount:cart.reduce((sum,line)=>sum+line.quantity,0), addToCart, removeFromCart, updateQuantity, clearCart}), [cart]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
