import { hasShopifyConfig, shopifyFetch } from "@/lib/shopify";
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE, GET_COLLECTIONS, GET_COLLECTION_BY_HANDLE, SEARCH_PRODUCTS } from "@/lib/queries/products";
import { getMockCatalog, type MockProduct } from "@/lib/mock-catalog";
import type { ProductCard, ProductDetail, Collection, CollectionWithProducts } from "@/types/shopify";

const demoMoney = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: "USD" as const });

function demoImage(product: MockProduct, url: string) {
  return { url, altText: product.title, width: 1200, height: 1500 };
}

function toDemoCard(product: MockProduct): ProductCard {
  const images = product.images.map((url) => demoImage(product, url));
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    availableForSale: product.inStock,
    featuredImage: demoImage(product, product.image),
    images: { nodes: images },
    priceRange: { minVariantPrice: demoMoney(product.price) },
    compareAtPriceRange: { minVariantPrice: demoMoney(product.compareAtPrice ?? product.price) },
  };
}

function toDemoDetail(product: MockProduct): ProductDetail {
  const card = toDemoCard(product);
  const price = demoMoney(product.price);
  return {
    ...card,
    description: product.description,
    descriptionHtml: `<p>${product.description}</p>`,
    options: [{ name: "Title", values: ["Default Title"] }],
    variants: {
      nodes: [
        {
          id: `${product.id}-default`,
          title: "Default Title",
          availableForSale: product.inStock,
          quantityAvailable: product.stockCount,
          selectedOptions: [{ name: "Title", value: "Default Title" }],
          price,
          image: card.featuredImage,
        },
      ],
    },
    seo: { title: product.title, description: product.description },
  };
}

function demoHandle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toDemoCollection(category: string, products: MockProduct[]): CollectionWithProducts {
  const first = products[0];
  return {
    id: `demo-collection-${demoHandle(category)}`,
    handle: demoHandle(category),
    title: category,
    description: `Explore our ${category.toLowerCase()} collection.`,
    image: first ? demoImage(first, first.image) : null,
    products: {
      pageInfo: { hasNextPage: false, endCursor: null },
      nodes: products.map(toDemoCard),
    },
  };
}

function getDemoProducts(options?: { first?: number; sortKey?: string; reverse?: boolean }) {
  let products = [...getMockCatalog()];
  if (options?.sortKey === "BEST_SELLING") products.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
  if (options?.sortKey === "CREATED") products.sort((a, b) => a.createdAt - b.createdAt);
  if (options?.sortKey === "PRICE") products.sort((a, b) => a.price - b.price);
  if (options?.reverse) products.reverse();
  return products.slice(0, options?.first ?? 24).map(toDemoCard);
}

export async function getProducts(options?: { first?: number; after?: string; sortKey?: string; reverse?: boolean }) {
  if (!hasShopifyConfig) {
    const nodes = getDemoProducts(options);
    return { pageInfo: { hasNextPage: false, endCursor: null }, nodes };
  }

  const data = await shopifyFetch<{ products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: ProductCard[] } }>(
    GET_PRODUCTS,
    options
  );
  return data.products;
}

export async function getProductByHandle(handle: string) {
  if (!hasShopifyConfig) {
    const product = getMockCatalog().find((item) => item.handle === handle);
    return product ? toDemoDetail(product) : null;
  }

  const data = await shopifyFetch<{ product: ProductDetail | null }>(GET_PRODUCT_BY_HANDLE, { handle });
  return data.product;
}

export async function getCollections(first = 12) {
  if (!hasShopifyConfig) {
    const categories = Array.from(new Set(getMockCatalog().map((product) => product.category))).slice(0, first);
    return categories.map((category) => toDemoCollection(category, getMockCatalog().filter((product) => product.category === category)));
  }

  const data = await shopifyFetch<{ collections: { nodes: Collection[] } }>(GET_COLLECTIONS, { first });
  return data.collections.nodes;
}

export async function getCollectionByHandle(
  handle: string,
  options?: { first?: number; after?: string; sortKey?: string; reverse?: boolean }
) {
  if (!hasShopifyConfig) {
    if (handle === "all") {
      return toDemoCollection("All products", getDemoProducts(options).map((product) => getMockCatalog().find((item) => item.id === product.id)!).filter(Boolean));
    }
    const products = getMockCatalog().filter((product) => demoHandle(product.category) === handle);
    const firstProduct = products[0];
    return firstProduct ? toDemoCollection(firstProduct.category, products) : null;
  }

  const data = await shopifyFetch<{ collection: CollectionWithProducts | null }>(GET_COLLECTION_BY_HANDLE, {
    handle,
    ...options,
  });
  return data.collection;
}

export async function searchProducts(query: string, first = 24) {
  if (!hasShopifyConfig) {
    const normalizedQuery = query.toLowerCase();
    return getMockCatalog()
      .filter((product) => `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(normalizedQuery))
      .slice(0, first)
      .map(toDemoCard);
  }

  const data = await shopifyFetch<{ products: { nodes: ProductCard[] } }>(SEARCH_PRODUCTS, { query, first });
  return data.products.nodes;
}
