"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronDown } from "lucide-react";
import { getMockCatalog, getAllBrands, getAllCategories } from "@/lib/mock-catalog";
import { CatalogProductCard } from "@/components/product/catalog-product-card";
import { CatalogFilters, DEFAULT_FILTERS, type CatalogFilterState } from "@/components/product/catalog-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGridSkeleton } from "@/components/ui/product-grid-skeleton";

const PAGE_SIZE = 16;

export function CatalogGrid() {
  const allProducts = useMemo(() => getMockCatalog(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const brands = useMemo(() => getAllBrands(), []);

  const [filters, setFilters] = useState<CatalogFilterState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    let list = allProducts.filter((p) => {
      if (q && !`${p.title} ${p.category} ${p.subcategory} ${p.brand}`.toLowerCase().includes(q)) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.minPrice && p.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > parseFloat(filters.maxPrice)) return false;
      if (filters.minRating && p.rating < filters.minRating) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      return true;
    });

    switch (filters.sort) {
      case "NEWEST":
        list = [...list].sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "BEST_SELLING":
        list = [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviewCount - a.reviewCount);
        break;
      case "PRICE_ASC":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "PRICE_DESC":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "RATING_DESC":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured: best sellers and new items first, stable otherwise
        list = [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || Number(b.isNew) - Number(a.isNew));
    }
    return list;
  }, [allProducts, filters]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function loadMore() {
    setLoadingMore(true);
    // Simulated network delay to showcase the loading state / spinner
    setTimeout(() => {
      setVisibleCount((c) => c + PAGE_SIZE);
      setLoadingMore(false);
    }, 500);
  }

  return (
    <div>
      <CatalogFilters
        categories={categories}
        brands={brands}
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No products match those filters"
          description="Try widening your price range, clearing a category, or resetting your filters."
          actionLabel="Reset filters"
          actionHref="/shop"
        />
      ) : (
        <>
          <motion.div layout className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {visible.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>

          {loadingMore && (
            <div className="mt-8">
              <ProductGridSkeleton count={4} />
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-3">
            {hasMore ? (
              <motion.button
                onClick={loadMore}
                disabled={loadingMore}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary min-w-[220px]"
              >
                {loadingMore ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Load More Products <ChevronDown size={16} />
                  </>
                )}
              </motion.button>
            ) : (
              <p className="text-sm text-stone-500">
                Showing all {filtered.length} product{filtered.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
