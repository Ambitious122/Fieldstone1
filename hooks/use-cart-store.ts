"use client";

/**
 * Cart state, backed by Shopify's Cart API.
 *
 * The Shopify cart ID is the only thing persisted client-side (in
 * localStorage) — the cart contents themselves are always re-fetched from
 * Shopify, which stays the single source of truth for price, availability,
 * and inventory.
 */
import { create } from "zustand";
import { createCart, getCart, addCartLines, updateCartLines, removeCartLines } from "@/services/cart-service";
import type { ShopifyCart } from "@/types/shopify";

const CART_ID_KEY = "fieldstone_cart_id";

interface CartState {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  error: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  initCart: () => Promise<void>;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isDrawerOpen: false,
  error: null,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  initCart: async () => {
    if (typeof window === "undefined") return;
    const existingId = window.localStorage.getItem(CART_ID_KEY);
    set({ isLoading: true, error: null });
    try {
      if (existingId) {
        const cart = await getCart(existingId);
        if (cart) {
          set({ cart, isLoading: false });
          return;
        }
      }
      const cart = await createCart([]);
      window.localStorage.setItem(CART_ID_KEY, cart.id);
      set({ cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to load cart" });
    }
  },

  addItem: async (merchandiseId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      let cartId = get().cart?.id ?? (typeof window !== "undefined" ? window.localStorage.getItem(CART_ID_KEY) : null);
      let cart: ShopifyCart;
      if (!cartId) {
        cart = await createCart([{ merchandiseId, quantity }]);
        if (typeof window !== "undefined") window.localStorage.setItem(CART_ID_KEY, cart.id);
      } else {
        cart = await addCartLines(cartId, [{ merchandiseId, quantity }]);
      }
      set({ cart, isLoading: false, isDrawerOpen: true });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to add item" });
    }
  },

  updateItem: async (lineId, quantity) => {
    const cartId = get().cart?.id;
    if (!cartId) return;
    set({ isLoading: true, error: null });
    try {
      const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
      set({ cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to update item" });
    }
  },

  removeItem: async (lineId) => {
    const cartId = get().cart?.id;
    if (!cartId) return;
    set({ isLoading: true, error: null });
    try {
      const cart = await removeCartLines(cartId, [lineId]);
      set({ cart, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to remove item" });
    }
  },
}));
