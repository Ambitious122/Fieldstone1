import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductByHandle, getProducts } from "@/services/product-service";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { ProductGridSkeleton } from "@/components/ui/product-grid-skeleton";

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) return {};
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    openGraph: {
      images: product.images.nodes[0] ? [{ url: product.images.nodes[0].url }] : [],
    },
  };
}

async function RelatedProducts() {
  const { nodes } = await getProducts({ first: 4, sortKey: "BEST_SELLING" });
  return <ProductGridSection eyebrow="You might also like" title="Related products" products={nodes} />;
}

export default async function ProductDetailPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.nodes.map((img) => img.url),
    offers: {
      "@type": "Offer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pb-24 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-fs grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images.nodes} title={product.title} />
        <div>
          <PurchasePanel product={product} />

          <div className="mt-10">
            <ProductAccordion
              items={[
                { title: "Description", content: <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> },
                {
                  title: "Shipping",
                  content: "Free standard shipping on orders over $150. Most orders ship within 2 business days.",
                },
                {
                  title: "Returns",
                  content: "30-day returns on unused items in original packaging. See our return policy for details.",
                },
              ]}
            />
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="container-fs py-20"><ProductGridSkeleton /></div>}>
        <RelatedProducts />
      </Suspense>
    </div>
  );
}
