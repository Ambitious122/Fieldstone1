"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatMoney } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCartStore();
  const lines = cart?.lines.nodes ?? [];

  if (!isLoading && lines.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        description="Browse the collection and find something built to last."
        actionHref="/shop"
        actionLabel="Shop all products"
      />
    );
  }

  return (
    <div className="container-fs grid grid-cols-1 gap-12 py-12 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="mb-8 font-display text-3xl">Your bag</h1>
        <ul className="divide-y divide-stone-300">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.li
                key={line.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-5 py-6"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                  {line.merchandise.image && (
                    <Image
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/products/${line.merchandise.product.handle}`} className="text-sm font-medium hover:underline">
                      {line.merchandise.product.title}
                    </Link>
                    <p className="text-xs text-stone-500">{line.merchandise.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
                      <button aria-label="Decrease quantity" onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center text-sm">{line.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => updateItem(line.id, line.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{formatMoney(line.cost.totalAmount)}</span>
                      <button
                        onClick={() => removeItem(line.id)}
                        className="text-xs text-stone-500 underline underline-offset-2 hover:text-clay"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {cart && (
        <div className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span>{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Shipping</span>
              <span className="text-stone-500">Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-5 flex justify-between border-t border-border pt-5 text-base font-medium">
            <span>Total</span>
            <span>{formatMoney(cart.cost.totalAmount)}</span>
          </div>
          <a href={cart.checkoutUrl} className="btn-primary mt-6 w-full">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Proceed to checkout"}
          </a>
        </div>
      )}
    </div>
  );
}
