"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatMoney } from "@/lib/format";

export function CartDrawer() {
  const { cart, isDrawerOpen, isLoading, closeDrawer, updateItem, removeItem } = useCartStore();
  const lines = cart?.lines.nodes ?? [];

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative ml-auto flex h-full w-full max-w-md flex-col bg-paper"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-display text-xl">Your bag ({cart?.totalQuantity ?? 0})</h2>
              <button aria-label="Close cart" onClick={closeDrawer} className="rounded-full p-2 hover:bg-surface-hover">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-stone-700">Your bag is empty.</p>
                  <Link href="/shop" onClick={closeDrawer} className="btn-secondary">
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                          {line.merchandise.image && (
                            <Image
                              src={line.merchandise.image.url}
                              alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-sm font-medium">{line.merchandise.product.title}</p>
                            <p className="text-xs text-stone-500">{line.merchandise.title}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-4 text-center text-sm">{line.quantity}</span>
                              <button aria-label="Increase quantity" onClick={() => updateItem(line.id, line.quantity + 1)}>
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{formatMoney(line.cost.totalAmount)}</span>
                              <button
                                aria-label="Remove item"
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
              )}
            </div>

            {lines.length > 0 && cart && (
              <div className="border-t border-border p-6">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-stone-700">Subtotal</span>
                  <motion.span key={cart.cost.subtotalAmount.amount} className="font-medium">
                    {formatMoney(cart.cost.subtotalAmount)}
                  </motion.span>
                </div>
                <p className="mb-4 text-xs text-stone-500">Shipping and taxes calculated at checkout.</p>
                <a
                  href={cart.checkoutUrl}
                  className="btn-primary w-full"
                  aria-disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Checkout"}
                </a>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
