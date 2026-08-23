"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { ProductCard as ProductCardType } from "@/types/shopify";
import { formatMoney, isOnSale, discountPercent } from "@/lib/format";
import { useWishlistStore } from "@/hooks/use-wishlist-store";

/**
 * Recurring "strata" swatch: a stacked bar of muted brand tones standing in
 * for each product's material composition. Deterministic per-product so the
 * same item always renders the same strata (a real store would drive the
 * widths from actual material-composition metafields).
 */
function StrataSwatch({ seed }: { seed: string }) {
  const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const tones = ["#9C5A34", "#4B5842", "#A8A093", "#3A362F"];
  const primary = hash % tones.length;
  const secondary = (hash + 1) % tones.length;
  const widthA = 55 + (hash % 20);
  return (
    <div className="strata-bar" aria-hidden="true">
      <span style={{ width: `${widthA}%`, backgroundColor: tones[primary] }} />
      <span style={{ width: `${100 - widthA}%`, backgroundColor: tones[secondary] }} />
    </div>
  );
}

export function ProductCard({ product }: { product: ProductCardType }) {
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.featuredImage;
  const hoverImage = product.images.nodes[1] ?? null;
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const onSale = isOnSale(price, compareAt);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-500 ${hoverImage ? "group-hover:opacity-0" : ""}`}
            />
          )}
          {hoverImage && (
            <Image
              src={hoverImage.url}
              alt={hoverImage.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {onSale && (
            <span className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1 text-xs font-medium text-paper">
              -{discountPercent(price, compareAt)}%
            </span>
          )}
          {!product.availableForSale && (
            <span className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-paper">
              Sold out
            </span>
          )}

          <button
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggle({
                id: product.id,
                handle: product.handle,
                title: product.title,
                imageUrl: primaryImage?.url ?? null,
                price,
              });
            }}
            className="absolute right-3 top-3 rounded-full bg-paper/90 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <Heart size={16} fill={wishlisted ? "#9C5A34" : "none"} color={wishlisted ? "#9C5A34" : "#1B1A17"} />
          </button>
          {/* Quick-add / quick-view affordances can hook in here */}
        </div>

        <div className="mt-4 space-y-2">
          <StrataSwatch seed={product.id} />
          <h3 className="text-sm font-medium text-ink">{product.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={onSale ? "text-clay" : "text-ink"}>{formatMoney(price)}</span>
            {onSale && <span className="text-ink/50 line-through">{formatMoney(compareAt)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
