import type { Metadata } from "next";
import { CatalogGrid } from "@/components/product/catalog-grid";

export const metadata: Metadata = {
  title: "Shop all products",
  description: "Browse the full Fieldstone catalog — considered goods in stone, wood, and metal.",
};

export default function ShopPage() {
  return (
    <div className="container-fs py-12">
      <div className="mb-8">
        <p className="eyebrow">All products</p>
        <h1 className="mt-2 text-4xl">Shop Fieldstone</h1>
      </div>

      <CatalogGrid />
    </div>
  );
}
