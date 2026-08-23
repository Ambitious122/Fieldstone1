import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/services/product-service";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <div className="container-fs py-12">
      <div className="mb-10">
        <p className="eyebrow">Browse</p>
        <h1 className="mt-2 text-4xl">Collections</h1>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface"
          >
            {collection.image && (
              <Image
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-limestone">
              <h2 className="font-display text-2xl">{collection.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
