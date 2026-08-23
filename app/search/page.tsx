"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGridSkeleton } from "@/components/ui/product-grid-skeleton";
import { searchProducts } from "@/services/product-service";
import type { ProductCard as ProductCardType } from "@/types/shopify";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductCardType[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const products = await searchProducts(q);
      setResults(products);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`);
    runSearch(query);
  }

  return (
    <div className="container-fs py-12">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl items-center gap-3 border-b-2 border-ink pb-3">
        <SearchIcon size={20} className="text-stone-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent text-lg focus:outline-none"
        />
      </form>

      <div className="mt-12">
        {loading && <ProductGridSkeleton />}

        {!loading && results !== null && results.length === 0 && (
          <EmptyState
            title={`No results for "${initialQuery || query}"`}
            description="Try a different search term, or browse the full catalog."
            actionHref="/shop"
            actionLabel="Shop all products"
          />
        )}

        {!loading && results && results.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
