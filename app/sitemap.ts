import type { MetadataRoute } from "next";

import { artists } from "./(site)/data/artists";
import { PRODUCT_LAUNCHED } from "./(site)/data/proximamente";
import { SITE } from "./(site)/data/site";

/* /sitemap.xml: la lista de páginas para Google. Los artistas se suman
   solos; la página de venta entra recién cuando el producto se lanza. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...artists.map((artist) => ({
      url: `${SITE.url}/artists/${artist.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...(PRODUCT_LAUNCHED
      ? [{ url: `${SITE.url}/tu-semana-como-artista`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }]
      : []),
  ];
}
