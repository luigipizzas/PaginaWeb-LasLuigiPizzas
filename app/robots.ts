import type { MetadataRoute } from "next";
import { obtenerUrlSitio } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  const sitio = obtenerUrlSitio();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/", "/api/"],
    },
    sitemap: `${sitio}/sitemap.xml`,
    host: sitio,
  };
}
