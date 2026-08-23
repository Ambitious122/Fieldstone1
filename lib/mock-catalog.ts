/**
 * Deterministic 200+ item demo catalog used to power the /shop browsing
 * experience without requiring a live Shopify connection. Swap this out for
 * `services/product-service.ts` once real store data should drive the grid.
 */

export interface MockProduct {
  id: string;
  handle: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  createdAt: number; // days ago
}

interface CategoryDef {
  name: string;
  subcategories: string[];
  brands: string[];
  nouns: string[];
  adjectives: string[];
  priceRange: [number, number];
  image: string;
}

// Curated, high-quality Unsplash photography per category. Each product
// derives a slightly different crop/quality variant of these base photos so
// 200 products render with visual variety without needing external network
// calls at build time.
const CATEGORIES: CategoryDef[] = [
  {
    name: "Electronics",
    subcategories: ["Headphones", "Speakers", "Cameras", "Smart Home"],
    brands: ["Sonorent", "Vantek", "Auralite", "Nexbeam", "Pulsewave"],
    nouns: ["Headphones", "Speaker", "Camera", "Hub", "Soundbar", "Earbuds"],
    adjectives: ["Wireless", "Noise-Cancelling", "Portable", "Studio", "Compact", "HD"],
    priceRange: [39, 349],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    name: "Smartphones",
    subcategories: ["Flagship", "Mid-range", "Budget", "Accessories"],
    brands: ["Orbicell", "Nova", "Halcyon", "Driftline"],
    nouns: ["Smartphone", "Phone Case", "Charger", "Screen Protector"],
    adjectives: ["5G", "Pro", "Max", "Lite", "Ultra"],
    priceRange: [19, 1199],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    name: "Laptops",
    subcategories: ["Ultrabooks", "Gaming", "2-in-1", "Accessories"],
    brands: ["Corewave", "Nimbus", "Fortran", "Vertexa"],
    nouns: ["Laptop", "Notebook", "Laptop Sleeve", "Docking Station"],
    adjectives: ["14-inch", "16-inch", "Slim", "Performance", "Creator"],
    priceRange: [499, 2399],
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  },
  {
    name: "Fashion",
    subcategories: ["Outerwear", "Tops", "Denim", "Knitwear"],
    brands: ["Larkspur", "Amaro", "Northfield", "Cassian", "Merrow"],
    nouns: ["Jacket", "Shirt", "Jeans", "Sweater", "Coat", "Blazer"],
    adjectives: ["Relaxed-Fit", "Organic Cotton", "Tailored", "Classic", "Oversized"],
    priceRange: [29, 249],
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  },
  {
    name: "Shoes",
    subcategories: ["Sneakers", "Boots", "Sandals", "Formal"],
    brands: ["Stridewell", "Pacefoot", "Loamline", "Cordova"],
    nouns: ["Sneakers", "Boots", "Sandals", "Loafers", "Running Shoes"],
    adjectives: ["Everyday", "Trail", "Leather", "Lightweight", "Classic"],
    priceRange: [45, 219],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    name: "Beauty & Skincare",
    subcategories: ["Skincare", "Haircare", "Fragrance", "Makeup"],
    brands: ["Lumeglow", "Verdant", "Silkroot", "Bareska"],
    nouns: ["Serum", "Moisturizer", "Cleanser", "Shampoo", "Eau de Parfum"],
    adjectives: ["Hydrating", "Radiance", "Botanical", "Overnight", "Gentle"],
    priceRange: [12, 89],
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
  },
  {
    name: "Home & Living",
    subcategories: ["Decor", "Bedding", "Kitchen", "Lighting"],
    brands: ["Fernhollow", "Claybrook", "Marrow & Co.", "Linden Home"],
    nouns: ["Vase", "Throw Pillow", "Candle", "Table Lamp", "Bedding Set"],
    adjectives: ["Handmade", "Ceramic", "Minimal", "Woven", "Warm-Glow"],
    priceRange: [15, 189],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
  },
  {
    name: "Furniture",
    subcategories: ["Living Room", "Bedroom", "Office", "Outdoor"],
    brands: ["Oakmere", "Birchwell", "Solenne", "Kilnwood"],
    nouns: ["Armchair", "Sofa", "Desk", "Bookshelf", "Dining Table"],
    adjectives: ["Solid Oak", "Mid-Century", "Modular", "Compact", "Upholstered"],
    priceRange: [89, 1599],
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
  },
  {
    name: "Sports",
    subcategories: ["Fitness", "Outdoor", "Team Sports", "Yoga"],
    brands: ["Ridgeform", "Summit Co.", "Pacemark", "Tensile"],
    nouns: ["Yoga Mat", "Dumbbell Set", "Running Jacket", "Water Bottle", "Backpack"],
    adjectives: ["Non-Slip", "Adjustable", "Lightweight", "Insulated", "All-Terrain"],
    priceRange: [14, 249],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  },
  {
    name: "Accessories",
    subcategories: ["Bags", "Jewelry", "Belts", "Sunglasses"],
    brands: ["Fennwick", "Marrow & Co.", "Ostraline", "Halvorsen"],
    nouns: ["Tote Bag", "Wallet", "Necklace", "Belt", "Sunglasses"],
    adjectives: ["Full-Grain Leather", "Minimalist", "Polarized", "Everyday", "Woven"],
    priceRange: [19, 329],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  },
  {
    name: "Gaming",
    subcategories: ["Consoles", "Accessories", "PC Gaming", "Collectibles"],
    brands: ["Hexbyte", "Voltframe", "Circuit9", "Playdrift"],
    nouns: ["Controller", "Gaming Headset", "Mechanical Keyboard", "Gaming Chair", "Mouse"],
    adjectives: ["RGB", "Wireless", "Ergonomic", "Pro", "Tournament-Grade"],
    priceRange: [24, 599],
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
  },
  {
    name: "Watches",
    subcategories: ["Analog", "Smartwatches", "Chronograph", "Straps"],
    brands: ["Meridian", "Corvane", "Waltham & Ives", "Solenne"],
    nouns: ["Watch", "Smartwatch", "Watch Strap", "Chronograph"],
    adjectives: ["Automatic", "Titanium", "Minimalist", "Sport", "Heritage"],
    priceRange: [59, 899],
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
  },
  {
    name: "Books",
    subcategories: ["Fiction", "Non-Fiction", "Design", "Cookbooks"],
    brands: ["Fieldnote Press", "Harlow House", "Cinderpath", "Wren & Co."],
    nouns: ["Novel", "Field Guide", "Cookbook", "Journal", "Anthology"],
    adjectives: ["Illustrated", "Hardcover", "Collector's Edition", "First Print"],
    priceRange: [12, 58],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
  },
  {
    name: "Grocery",
    subcategories: ["Pantry", "Coffee & Tea", "Snacks", "Condiments"],
    brands: ["Harvestry", "Millbrook", "Cinderpath", "Fieldstone Provisions"],
    nouns: ["Coffee Beans", "Olive Oil", "Honey", "Herbal Tea", "Granola"],
    adjectives: ["Single-Origin", "Cold-Pressed", "Small-Batch", "Organic", "Artisan"],
    priceRange: [6, 42],
    image: "https://images.unsplash.com/photo-1506617420156-8e4536971650",
  },
  {
    name: "Health & Wellness",
    subcategories: ["Supplements", "Personal Care", "Recovery", "Sleep"],
    brands: ["Verdant", "Ridgeform", "Bareska", "Lumeglow"],
    nouns: ["Vitamin Complex", "Foam Roller", "Weighted Blanket", "Diffuser", "Protein Powder"],
    adjectives: ["Daily", "Plant-Based", "Recovery", "Calming", "Clinical-Strength"],
    priceRange: [11, 119],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
  },
];

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function unsplashVariant(base: string, seed: number, w = 1200) {
  return `${base}?auto=format&fit=crop&w=${w}&q=80&sat=${(seed % 10) - 3}`;
}

function generateCatalog(): MockProduct[] {
  const rand = seededRandom(42);
  const products: MockProduct[] = [];
  const perCategory = Math.ceil(220 / CATEGORIES.length);

  CATEGORIES.forEach((cat, catIndex) => {
    for (let i = 0; i < perCategory; i++) {
      const seed = catIndex * 1000 + i;
      const adjective = cat.adjectives[Math.floor(rand() * cat.adjectives.length)] ?? "Classic";
      const noun = cat.nouns[Math.floor(rand() * cat.nouns.length)] ?? "Essential";
      const brand = cat.brands[Math.floor(rand() * cat.brands.length)] ?? "Fieldstone";
      const subcategory = cat.subcategories[Math.floor(rand() * cat.subcategories.length)] ?? cat.name;
      const title = `${brand} ${adjective} ${noun}`;
      const handle = `${slugify(title)}-${seed}`;

      const [minP, maxP] = cat.priceRange;
      const basePrice = Math.round((minP + rand() * (maxP - minP)) * 100) / 100;
      const onSale = rand() < 0.38;
      const price = onSale ? Math.round(basePrice * 0.78 * 100) / 100 : basePrice;
      const compareAtPrice = onSale ? basePrice : null;

      const rating = Math.round((3.4 + rand() * 1.6) * 10) / 10;
      const reviewCount = Math.floor(rand() * 480) + 3;
      const inStock = rand() > 0.09;
      const stockCount = inStock ? Math.floor(rand() * 60) + 1 : 0;
      const isNew = rand() < 0.14;
      const isBestSeller = !isNew && rand() < 0.16 && reviewCount > 120;
      const createdAt = isNew ? Math.floor(rand() * 20) : Math.floor(rand() * 400) + 20;

      products.push({
        id: `mock-${seed}`,
        handle,
        title,
        brand,
        category: cat.name,
        subcategory,
        description: `${title} — a ${adjective.toLowerCase()} ${noun.toLowerCase()} from ${brand}, designed for everyday use with considered materials and a refined finish. Part of the ${subcategory} line.`,
        image: unsplashVariant(cat.image, seed),
        images: [unsplashVariant(cat.image, seed), unsplashVariant(cat.image, seed + 1, 1000)],
        price,
        compareAtPrice,
        rating,
        reviewCount,
        inStock,
        stockCount,
        isNew,
        isBestSeller,
        createdAt,
      });
    }
  });

  return products;
}

let _cache: MockProduct[] | null = null;

export function getMockCatalog(): MockProduct[] {
  if (!_cache) _cache = generateCatalog();
  return _cache;
}

export function getAllBrands(): string[] {
  return Array.from(new Set(getMockCatalog().map((p) => p.brand))).sort();
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getMockCatalog().map((p) => p.category))).sort();
}

export function discountPct(product: MockProduct): number {
  if (!product.compareAtPrice) return 0;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}
