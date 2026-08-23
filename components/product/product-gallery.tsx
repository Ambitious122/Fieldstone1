"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ShopifyImage } from "@/types/shopify";

export function ProductGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return <div className="aspect-square rounded-2xl bg-surface" />;
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-y-auto">
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setActiveIndex(i)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
              i === activeIndex ? "border-ink" : "border-border"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <Image src={img.url} alt={img.altText ?? title} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-surface">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={active.url}
              alt={active.altText ?? title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
