import type { MetadataRoute } from "next";
import { obtenerUrlSitio } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: obtenerUrlSitio(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
