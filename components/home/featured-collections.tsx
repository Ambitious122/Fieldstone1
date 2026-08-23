import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/shopify";

export function FeaturedCollections({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;

  return (
    <section className="container-fs py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">Shop by collection</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Find your material</h2>
        </div>
        <Link href="/collections/all" className="hidden text-sm underline underline-offset-4 md:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.slice(0, 3).map((collection) => (
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
              <h3 className="font-display text-2xl">{collection.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
