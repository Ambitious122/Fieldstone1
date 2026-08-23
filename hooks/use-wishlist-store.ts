"use client";

/**
 * Lightweight wishlist, persisted to localStorage. Stores just product
 * handles + a minimal display snapshot — enough to render the wishlist page
 * without needing a signed-in customer. If/when tied to Shopify Customer
 * Accounts, swap the persistence layer for a customer metafield.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  imageUrl: string | null;
  price: { amount: string; currencyCode: string };
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set({
          items: exists ? get().items.filter((i) => i.id !== item.id) : [...get().items, item],
        });
      },
      isWishlisted: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "fieldstone_wishlist" }
  )
);
