"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getProducts, getCollectionByHandle } from "@/services/product-service";
import type { ProductCard as ProductCardType } from "@/types/shopify";

export function ProductGridClient({
  initialProducts,
  initialCursor,
  initialHasNextPage,
  sortKey,
  reverse,
  collectionHandle,
}: {
  initialProducts: ProductCardType[];
  initialCursor: string | null;
  initialHasNextPage: boolean;
  sortKey?: string;
  reverse?: boolean;
  /** When set, "load more" paginates within this collection instead of the full catalog. */
  collectionHandle?: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!cursor) return;
    setLoading(true);
    try {
      if (collectionHandle) {
        const collection = await getCollectionByHandle(collectionHandle, { first: 12, after: cursor, sortKey, reverse });
        if (collection) {
          setProducts((prev) => [...prev, ...collection.products.nodes]);
          setCursor(collection.products.pageInfo.endCursor);
          setHasNextPage(collection.products.pageInfo.hasNextPage);
        }
      } else {
        const page = await getProducts({ first: 12, after: cursor, sortKey, reverse });
        setProducts((prev) => [...prev, ...page.nodes]);
        setCursor(page.pageInfo.endCursor);
        setHasNextPage(page.pageInfo.hasNextPage);
      }
    } finally {
      setLoading(false);
    }
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products match those filters"
        description="Try widening your price range or clearing a filter."
        actionHref="/shop"
        actionLabel="Clear filters"
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <button onClick={loadMore} disabled={loading} className="btn-secondary">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
