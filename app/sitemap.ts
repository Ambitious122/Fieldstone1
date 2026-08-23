import type { MetadataRoute } from "next";
import { getProducts, getCollections } from "@/services/product-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/collections/all",
    "/about",
    "/contact",
    "/faq",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  try {
    const [{ nodes: products }, collections] = await Promise.all([getProducts({ first: 250 }), getCollections(250)]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${siteUrl}/products/${p.handle}`,
      lastModified: new Date(),
    }));
    const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
      url: `${siteUrl}/collections/${c.handle}`,
      lastModified: new Date(),
    }));

    return [...staticRoutes, ...productRoutes, ...collectionRoutes];
  } catch (error) {
    console.error("[sitemap] failed to fetch dynamic routes", error);
    return staticRoutes;
  }
}
