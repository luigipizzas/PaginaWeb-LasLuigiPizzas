import type { Metadata, Viewport } from "next";
import { Luckiest_Guy, Pacifico, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { obtenerUrlSitio } from "@/lib/sitio";

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

const TITULO = "Pizzería en Rodeo del Medio | Las Luigi Pizzas";
const DESCRIPCION =
  "Pedí pizzas a la piedra, lomos, hamburguesas y empanadas en Rodeo del Medio, Maipú. Envíos a domicilio y retiro en Las Luigi Pizzas.";

const SITIO = obtenerUrlSitio();

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: TITULO,
    template: "%s | Las Luigi Pizzas",
  },
  description: DESCRIPCION,
  applicationName: "Las Luigi Pizzas",
  verification: {
    google: [
      "m4hSzPC2qWMhoeJwPb2EZ9gVM09A8KVegkGSMTJyFag",
      "kW9MCNWC-LuRqqkd88HhVphgP4AKtIK9LBKakuDntxA",
    ],
  },
  alternates: { canonical: "/" },
  keywords: [
    "pizzería en Mendoza",
    "pizzería en Rodeo del Medio",
    "pizza Rodeo del Medio",
    "delivery Rodeo del Medio",
    "pizzería Maipú Mendoza",
    "pizza a la piedra Mendoza",
    "lomos Mendoza",
    "hamburguesas Mendoza",
    "empanadas Mendoza",
    "delivery de pizza Mendoza",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Las Luigi Pizzas",
    locale: "es_AR",
    url: "/",
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

// Permite que iOS exponga el área segura de la isla dinámica al CSS.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Safari usa este color en la franja de la isla dinámica. Animaciones lo
  // sincroniza con el navbar cuando la página deja atrás el hero.
  themeColor: "#E23528",
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
