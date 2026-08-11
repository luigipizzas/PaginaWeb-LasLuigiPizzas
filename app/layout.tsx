import type { Metadata } from "next";
import { Luckiest_Guy, Pacifico, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

// Mismas fuentes que la landing original, servidas por Next (sin CDN).
const luckiest = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-luckiest",
});
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});
const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const TITULO = "Las Luigi Pizzas — Pizzas · Lomos · Hamburguesas · Empanadas";
const DESCRIPCION =
  "Pizzas a la piedra, lomos, hamburguesas y empanadas. Amasado a mano, horno a la piedra y envíos en el barrio.";

const SITIO_POR_DEFECTO = "https://lasluigipizzas.vercel.app";

/**
 * Arma la URL del sitio tolerando cómo suele cargarse la variable.
 *
 * Es a prueba de errores a propósito: si el dominio viene sin protocolo
 * (por ejemplo "misitio.com", que es lo natural al copiarlo del panel de
 * Vercel), `new URL()` lanza una excepción y, al ejecutarse en el layout,
 * tira abajo la compilación entera. No vale la pena romper el build por eso.
 */
function resolverSitio(): string {
  const candidatos = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    SITIO_POR_DEFECTO,
  ];

  for (const bruto of candidatos) {
    const valor = bruto?.trim();
    if (!valor) continue;
    const conProtocolo = /^https?:\/\//i.test(valor) ? valor : `https://${valor}`;
    try {
      return new URL(conProtocolo).origin;
    } catch {
      // Valor inservible: probamos con el siguiente.
    }
  }
  return SITIO_POR_DEFECTO;
}

const SITIO = resolverSitio();

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    type: "website",
    siteName: "Las Luigi Pizzas",
    locale: "es_AR",
    url: SITIO,
    title: TITULO,
    description: DESCRIPCION,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Las Luigi Pizzas — Eyyy! ¿Vos querés?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${luckiest.variable} ${pacifico.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
