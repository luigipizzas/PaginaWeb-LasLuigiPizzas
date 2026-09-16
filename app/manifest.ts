import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Las Luigi Pizzas",
    short_name: "Las Luigi",
    description: "Pizzas, lomos, hamburguesas y empanadas en Mendoza.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7efdd",
    theme_color: "#e23528",
    icons: [{ src: "/logo-las-luigi-pizzas.png", sizes: "any", type: "image/png" }],
  };
}
