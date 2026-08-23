import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { BrandStory } from "@/components/home/brand-story";
import { ProductGridSkeleton } from "@/components/ui/product-grid-skeleton";
import { getCollections, getProducts } from "@/services/product-service";

async function FeaturedCollectionsSection() {
  const collections = await getCollections(3);
  return <FeaturedCollections collections={collections} />;
}

async function BestSellersSection() {
  const { nodes } = await getProducts({ first: 8, sortKey: "BEST_SELLING" });
  return <ProductGridSection eyebrow="Customer favorites" title="Best sellers" products={nodes} />;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="container-fs py-20"><ProductGridSkeleton count={3} /></div>}>
        <FeaturedCollectionsSection />
      </Suspense>
      <Suspense fallback={<div className="container-fs py-20"><ProductGridSkeleton /></div>}>
        <BestSellersSection />
      </Suspense>
      <BrandStory />
    </>
  );
}
