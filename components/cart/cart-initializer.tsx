"use client";

import { useEffect } from "react";
import { useCartStore } from "@/hooks/use-cart-store";

/** Hydrates the cart on first client render. Renders nothing. */
export function CartInitializer() {
  const initCart = useCartStore((s) => s.initCart);

  useEffect(() => {
    initCart();
  }, [initCart]);

  return null;
}
