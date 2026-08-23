"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, Minus, Plus } from "lucide-react";
import { VariantSelector } from "@/components/product/variant-selector";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatMoney, isOnSale, discountPercent } from "@/lib/format";
import type { ProductDetail } from "@/types/shopify";

export function PurchasePanel({ product }: { product: ProductDetail }) {
  const variants = product.variants.nodes;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const first = variants[0];
    return Object.fromEntries((first?.selectedOptions ?? []).map((o) => [o.name, o.value]));
  });
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const selectedVariant = useMemo(() => {
    return (
      variants.find((v) => v.selectedOptions.every((o) => selectedOptions[o.name] === o.value)) ?? variants[0]
    );
  }, [variants, selectedOptions]);

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const onSale = isOnSale(price, compareAt);

  function handleOptionChange(name: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddToCart() {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id, quantity);
  }

  const inStock = selectedVariant?.availableForSale ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">{product.title}</h1>
        <div className="mt-3 flex items-center gap-3">
          <span className={`text-lg ${onSale ? "text-clay" : "text-ink"}`}>{formatMoney(price)}</span>
          {onSale && (
            <>
              <span className="text-stone-500 line-through">{formatMoney(compareAt)}</span>
              <span className="rounded-full bg-clay/10 px-2 py-0.5 text-xs font-medium text-clay">
                Save {discountPercent(price, compareAt)}%
              </span>
            </>
          )}
        </div>
      </div>

      {product.options.length > 0 && product.options[0]?.name !== "Title" && (
        <VariantSelector
          options={product.options}
          selectedOptions={selectedOptions}
          onChange={handleOptionChange}
          variants={variants}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 rounded-full border border-border px-3 py-2.5">
          <button aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Minus size={16} />
          </button>
          <span className="w-5 text-center text-sm">{quantity}</span>
          <button aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-stone-500">
          {inStock ? "In stock, ready to ship" : "Currently out of stock"}
        </p>
      </div>

      <div className="hidden gap-3 md:flex">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!inStock || isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : inStock ? "Add to cart" : "Sold out"}
        </motion.button>
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWishlisted((w) => !w)}
          className="rounded-full border border-border p-3.5 hover:border-ink"
        >
          <Heart size={20} fill={wishlisted ? "#9C5A34" : "none"} color={wishlisted ? "#9C5A34" : "#1B1A17"} />
        </button>
      </div>

      {/* Sticky purchase bar on mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-paper p-4 md:hidden">
        <div className="flex-1">
          <p className="text-sm font-medium">{formatMoney(price)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : inStock ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
