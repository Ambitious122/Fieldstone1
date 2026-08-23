"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/format";

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here for later."
        actionHref="/shop"
        actionLabel="Shop all products"
      />
    );
  }

  return (
    <div className="container-fs py-12">
      <h1 className="mb-8 font-display text-3xl">Your wishlist</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <Link href={`/products/${item.handle}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} fill sizes="25vw" className="object-cover" />
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-sm text-stone-700">{formatMoney(item.price)}</p>
              </div>
            </Link>
            <button
              aria-label="Remove from wishlist"
              onClick={() => toggle(item)}
              className="absolute right-3 top-3 rounded-full bg-paper/90 p-2"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
