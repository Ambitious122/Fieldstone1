"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import type { MockProduct } from "@/lib/mock-catalog";
import { discountPct } from "@/lib/mock-catalog";
import { useWishlistStore } from "@/hooks/use-wishlist-store";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function CatalogProductCard({ product }: { product: MockProduct }) {
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const onSale = !!product.compareAtPrice;

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/products/${product.handle}`} className="block" aria-label={product.title}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-moss px-3 py-1 text-xs font-medium text-paper">New</span>
            )}
            {onSale && (
              <span className="rounded-full bg-clay px-3 py-1 text-xs font-medium text-paper">
                -{discountPct(product)}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">Best Seller</span>
            )}
            {!product.inStock && (
              <span className="rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-paper">
                Out of stock
              </span>
            )}
          </div>

          <motion.button
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggle({
                id: product.id,
                handle: product.handle,
                title: product.title,
                imageUrl: product.image,
                price: { amount: String(product.price), currencyCode: "USD" },
              });
            }}
            whileTap={{ scale: 0.8 }}
            className="absolute right-3 top-3 rounded-full bg-paper/90 p-2 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Heart size={16} fill={wishlisted ? "#9C5A34" : "none"} color={wishlisted ? "#9C5A34" : "#1B1A17"} />
          </motion.button>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink/50">{product.brand}</p>
          <h3 className="line-clamp-1 text-sm font-medium text-ink">{product.title}</h3>

          <div className="flex items-center gap-1 text-xs text-ink/60">
            <Star size={13} fill="#9C5A34" color="#9C5A34" />
            <span className="font-medium text-ink">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className={onSale ? "text-clay" : "text-ink"}>${product.price.toFixed(2)}</span>
            {onSale && (
              <span className="text-ink/50 line-through">${product.compareAtPrice!.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
