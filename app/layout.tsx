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

// Para que la miniatura al compartir funcione, la URL de la imagen tiene que
// ser absoluta. Se toma del dominio configurado; en Vercel alcanza con la
// variable que la plataforma inyecta sola.
const SITIO =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://lasluigipizzas.vercel.app");

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
