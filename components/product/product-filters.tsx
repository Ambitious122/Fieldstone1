"use client";

/**
 * Sort + filter controls for the product listing page. Filter state lives in
 * the URL (searchParams) so results are shareable/bookmarkable and the page
 * stays server-renderable on first load.
 *
 * Color/size/brand facets are commonly served by Shopify's collection-level
 * `productFilters` (available facet values + counts computed by Shopify).
 * This component keeps price/availability/sort generic across "all products"
 * and any collection; wire in `productFilters` here once you're filtering
 * within a specific collection that returns them.
 */
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "RELEVANCE", label: "Featured" },
  { value: "BEST_SELLING", label: "Best selling" },
  { value: "CREATED_AT_DESC", label: "Newest" },
  { value: "PRICE_ASC", label: "Price: Low to high" },
  { value: "PRICE_DESC", label: "Price: High to low" },
];

export function ProductFilters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentSort = searchParams.get("sort") ?? "RELEVANCE";
  const inStockOnly = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const filterBody = (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-medium">Availability</p>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="h-4 w-4 rounded border-border accent-clay focus:ring-clay"
          />
          In stock only
        </label>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateParam("minPrice", e.target.value || null)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value || null)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-sm font-medium lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="hidden lg:block">{filterBody}</div>
        <p className="text-sm text-ink/60">{resultCount} products</p>
      </div>

      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-lg border border-border bg-paper px-3 py-2 text-sm"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto flex h-full w-[85%] max-w-xs flex-col bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg">Filters</p>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            {filterBody}
            <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-8">
              Show {resultCount} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
