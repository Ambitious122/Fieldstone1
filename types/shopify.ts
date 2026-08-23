export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ProductCard {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  image: ShopifyImage | null;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductDetail {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  images: { nodes: ShopifyImage[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  options: ProductOption[];
  variants: { nodes: ProductVariant[] };
  seo: { title: string | null; description: string | null };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

export interface CollectionWithProducts extends Collection {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ProductCard[];
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: ShopifyImage | null;
    price: Money;
    product: { handle: string; title: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: CartLine[] };
}
