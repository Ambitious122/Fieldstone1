"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/all", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalQuantity = useCartStore((s) => s.cart?.totalQuantity ?? 0);
  const openCart = useCartStore((s) => s.openDrawer);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur transition-colors duration-300">
      <div className="container-fs flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Fieldstone
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <motion.div key={link.href} whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
              <Link
                href={link.href}
                className="text-sm tracking-wide text-stone-700 transition-colors hover:text-ink dark:text-stone-400 dark:hover:text-ink"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/search" aria-label="Search" className="rounded-full p-2.5 transition-colors hover:bg-surface-hover">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden rounded-full p-2.5 transition-colors hover:bg-surface-hover sm:inline-flex">
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <motion.button
            aria-label={`Cart, ${totalQuantity} items`}
            onClick={openCart}
            whileTap={{ scale: 0.9 }}
            className="relative rounded-full p-2.5 transition-colors hover:bg-surface-hover"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <AnimatePresence>
              {totalQuantity > 0 && (
                <motion.span
                  key={totalQuantity}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] font-medium text-paper"
                >
                  {totalQuantity}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <ThemeToggle />
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2.5 transition-colors hover:bg-surface-hover md:hidden"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto flex h-full w-[82%] max-w-sm flex-col bg-paper p-8"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-display text-xl">Fieldstone</span>
                <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={link.href} onClick={() => setMobileOpen(false)} className="font-display text-2xl">
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <span className="eyebrow">Theme</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
