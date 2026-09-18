import { createClient } from "@/lib/supabase/server";
import Landing from "@/components/landing/Landing";
import type { Producto, Reel, Sucursal } from "@/lib/tipos";
import { obtenerUrlSitio } from "@/lib/sitio";

// Revalida cada 60s: los cambios del panel se ven enseguida sin rearmar el sitio.
export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: productos },
    { data: reels },
    { data: sucursales },
    { data: contenido },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("reels")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("sucursales")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true }),
    supabase.from("content").select("key, value"),
  ]);

  const textos: Record<string, Record<string, string>> = {};
  for (const fila of contenido ?? []) {
    textos[fila.key] = (fila.value ?? {}) as Record<string, string>;
  }

  const listaProductos = (productos ?? []) as Producto[];
  const listaSucursales = (sucursales ?? []) as Sucursal[];
  const sitio = obtenerUrlSitio();
  const instagram = textos.contacto?.instagram || "lasluigipizzas";
  const sucursalesConDireccion = listaSucursales.filter(
    (sucursal) =>
      sucursal.direccion && !/^complet[aá]/i.test(sucursal.direccion.trim())
  );
  const datosEstructurados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${sitio}/#organization`,
        name: "Las Luigi Pizzas",
        url: sitio,
        logo: `${sitio}/logo-las-luigi-pizzas.png`,
        image: `${sitio}/og.jpg`,
        description:
          "Pizzas a la piedra, lomos, hamburguesas y empanadas en Rodeo del Medio, Maipú, Mendoza.",
        areaServed: [
          { "@type": "Place", name: "Rodeo del Medio" },
          { "@type": "AdministrativeArea", name: "Maipú, Mendoza" },
          { "@type": "City", name: "Mendoza" },
        ],
        sameAs: [`https://www.instagram.com/${instagram.replace(/^@/, "")}`],
        subOrganization: sucursalesConDireccion.map((sucursal) => ({
          "@id": `${sitio}/#sucursal-${sucursal.id}`,
        })),
      },
      ...sucursalesConDireccion.map((sucursal) => ({
        "@type": "Restaurant",
        "@id": `${sitio}/#sucursal-${sucursal.id}`,
        name: `Las Luigi Pizzas ${sucursal.nombre}`,
        parentOrganization: { "@id": `${sitio}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: sucursal.direccion,
          addressLocality: "Mendoza",
          addressRegion: "Mendoza",
          addressCountry: "AR",
        },
        telephone:
          sucursal.telefono && !/^complet[aá]/i.test(sucursal.telefono)
            ? sucursal.telefono
            : sucursal.whatsapp || undefined,
        url: sucursal.maps_url || `${sitio}/#local`,
        menu: `${sitio}/#menu`,
        image: `${sitio}/og.jpg`,
        priceRange: "$$",
        servesCuisine: ["Pizza", "Lomos", "Hamburguesas", "Empanadas"],
      })),
      {
        "@type": "FAQPage",
        "@id": `${sitio}/#preguntas-frecuentes`,
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Las Luigi Pizzas hace envíos en Rodeo del Medio?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí. Podés elegir la sucursal, armar tu pedido desde el menú y enviarlo por WhatsApp para confirmar la zona de entrega.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué se puede pedir en Las Luigi Pizzas?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "El menú incluye pizzas a la piedra, lomos, hamburguesas y empanadas, con opciones y precios actualizados en esta página.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo hago un pedido?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Agregá productos al pedido, ingresá tu nombre y elegí la sucursal. La página prepara el detalle y el total para enviarlos por WhatsApp.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datosEstructurados).replace(/</g, "\\u003c"),
        }}
      />
      <Landing
        productos={listaProductos}
        reels={(reels ?? []) as Reel[]}
        sucursales={listaSucursales}
        textos={textos}
      />
    </>
  );
}
