import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionByHandle } from "@/services/product-service";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGridClient } from "@/components/product/product-grid-client";

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle, { first: 1 });
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description || undefined,
  };
}

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  RELEVANCE: { sortKey: "RELEVANCE", reverse: false },
  BEST_SELLING: { sortKey: "BEST_SELLING", reverse: false },
  CREATED_AT_DESC: { sortKey: "CREATED", reverse: true },
  PRICE_ASC: { sortKey: "PRICE", reverse: false },
  PRICE_DESC: { sortKey: "PRICE", reverse: true },
};

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sortParam = typeof searchParams.sort === "string" ? searchParams.sort : "RELEVANCE";
  const { sortKey, reverse } = SORT_MAP[sortParam] ?? { sortKey: "RELEVANCE", reverse: false };

  const collection = await getCollectionByHandle(params.handle, { first: 12, sortKey, reverse });
  if (!collection) notFound();

  return (
    <div>
      <div className="relative flex h-64 items-end overflow-hidden bg-ink text-limestone md:h-80">
        {collection.image && (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        )}
        <div className="container-fs relative z-10 pb-10">
          <h1 className="font-display text-4xl md:text-5xl">{collection.title}</h1>
          {collection.description && <p className="mt-3 max-w-lg text-stone-200">{collection.description}</p>}
        </div>
      </div>

      <div className="container-fs py-12">
        <ProductFilters resultCount={collection.products.nodes.length} />
        <ProductGridClient
          initialProducts={collection.products.nodes}
          initialCursor={collection.products.pageInfo.endCursor}
          initialHasNextPage={collection.products.pageInfo.hasNextPage}
          sortKey={sortKey}
          reverse={reverse}
          collectionHandle={params.handle}
        />
      </div>
    </div>
  );
}
