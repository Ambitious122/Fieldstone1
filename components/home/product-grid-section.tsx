import type { ProductCard as ProductCardType } from "@/types/shopify";
import { ProductCard } from "@/components/product/product-card";

export function ProductGridSection({
  title,
  eyebrow,
  products,
}: {
  title: string;
  eyebrow: string;
  products: ProductCardType[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="container-fs py-20">
      <div className="mb-10">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-3xl md:text-4xl">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
