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

export const metadata: Metadata = {
  title: "Las Luigi Pizzas — Pizzas · Lomos · Hamburguesas · Empanadas",
  description:
    "Pizzas a la piedra, lomos, hamburguesas y empanadas. Amasado a mano, horno a la piedra y envíos en el barrio.",
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
