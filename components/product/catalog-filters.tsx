"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

export interface CatalogFilterState {
  search: string;
  categories: string[];
  brands: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  inStockOnly: boolean;
  sort: string;
}

export const DEFAULT_FILTERS: CatalogFilterState = {
  search: "",
  categories: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  inStockOnly: false,
  sort: "FEATURED",
};

const SORT_OPTIONS = [
  { value: "FEATURED", label: "Featured" },
  { value: "NEWEST", label: "Newest" },
  { value: "BEST_SELLING", label: "Best Selling" },
  { value: "PRICE_ASC", label: "Price: Low to High" },
  { value: "PRICE_DESC", label: "Price: High to Low" },
  { value: "RATING_DESC", label: "Highest Rated" },
];

const RATING_OPTIONS = [4.5, 4, 3.5, 3];

function isEqualFilters(a: CatalogFilterState, b: CatalogFilterState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function CatalogFilters({
  categories,
  brands,
  filters,
  onChange,
  resultCount,
}: {
  categories: string[];
  brands: string[];
  filters: CatalogFilterState;
  onChange: (next: CatalogFilterState) => void;
  resultCount: number;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isFiltered = !isEqualFilters(filters, DEFAULT_FILTERS);

  function set<K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleInArray(key: "categories" | "brands", value: string) {
    const arr = filters[key];
    set(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  }

  const filterBody = (
    <>
      <div>
        <p className="mb-3 text-sm font-medium">Category</p>
        <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleInArray("categories", cat)}
                className="h-4 w-4 rounded border-border accent-clay focus:ring-clay"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Brand</p>
        <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleInArray("brands", brand)}
                className="h-4 w-4 rounded border-border accent-clay focus:ring-clay"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set("minPrice", e.target.value)}
            className="w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Rating</p>
        <div className="space-y-2.5">
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === r}
                onChange={() => set("minRating", r)}
                className="h-4 w-4 border-border accent-clay focus:ring-clay"
              />
              {r}+ stars
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="minRating"
              checked={filters.minRating === 0}
              onChange={() => set("minRating", 0)}
              className="h-4 w-4 border-border accent-clay focus:ring-clay"
            />
            Any rating
          </label>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Availability</p>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => set("inStockOnly", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-clay focus:ring-clay"
          />
          In stock only
        </label>
      </div>

      {isFiltered && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="flex items-center gap-1.5 text-sm font-medium text-clay hover:text-clay-dark"
        >
          <RotateCcw size={14} /> Reset filters
        </button>
      )}
    </>
  );

  return (
    <div className="mb-8">
      <div className="mb-5">
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search products, categories, keywords…"
          className="w-full rounded-full border border-border bg-paper px-5 py-3 text-sm transition-colors focus:border-clay"
          aria-label="Search products"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
            {isFiltered && <span className="h-1.5 w-1.5 rounded-full bg-clay" />}
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-ink/60">
              <span className="font-medium text-ink">{resultCount}</span> product{resultCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-ink/60 lg:hidden">{resultCount} products</p>
          <select
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value)}
            className="rounded-lg border border-border bg-paper px-3 py-2 text-sm"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop filter panel */}
      <div className="hidden lg:mt-6 lg:grid lg:grid-cols-4 lg:gap-8 lg:border-b lg:border-border lg:pb-8">
        {filterBody}
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto flex h-full w-[88%] max-w-xs flex-col overflow-y-auto bg-paper p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-lg">Filters</p>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-8">{filterBody}</div>
              <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-8">
                Show {resultCount} results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
