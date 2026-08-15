"use client";

import { useEffect, useState } from "react";

/**
 * Pantalla de carga.
 *
 * Espera a que estén las fuentes y las imágenes de arriba de todo, así la
 * página no se ve armarse a pedazos en equipos lentos. Tiene dos frenos para
 * no convertirse en un problema:
 *
 *  · Un mínimo, para que en conexiones rápidas no pegue un flash molesto.
 *  · Un máximo, para que un archivo que no carga nunca no deje a nadie
 *    mirando una pantalla fija. Además el CSS la oculta sola a los 8s por si
 *    el JavaScript directamente no corre.
 */
const MINIMO_MS = 500;
const MAXIMO_MS = 5000;

export default function Cargando() {
  const [saliendo, setSaliendo] = useState(false);
  const [fuera, setFuera] = useState(false);

  useEffect(() => {
    const arranque = Date.now();
    let listo = false;

    const terminar = () => {
      if (listo) return;
      listo = true;
      const pasado = Date.now() - arranque;
      const esperar = Math.max(0, MINIMO_MS - pasado);
      window.setTimeout(() => {
        setSaliendo(true);
        window.setTimeout(() => setFuera(true), 450); // dura el fundido
      }, esperar);
    };

    // Las imágenes del hero son lo que realmente se ve primero.
    const imagenesArriba = () => {
      const imgs = [
        ...document.querySelectorAll<HTMLImageElement>(".hero-img, .side-pizza"),
      ];
      return Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((r) => {
                img.addEventListener("load", () => r(), { once: true });
                img.addEventListener("error", () => r(), { once: true });
              })
        )
      );
    };

    const fuentes = document.fonts?.ready ?? Promise.resolve();

    Promise.all([fuentes, imagenesArriba()]).then(terminar);

    const tope = window.setTimeout(terminar, MAXIMO_MS);
    return () => window.clearTimeout(tope);
  }, []);

  // Bloquea el scroll mientras se ve, para que no se scrollee a ciegas.
  useEffect(() => {
    if (fuera) {
      document.documentElement.classList.remove("cargando-activo");
      return;
    }
    document.documentElement.classList.add("cargando-activo");
    return () => document.documentElement.classList.remove("cargando-activo");
  }, [fuera]);

  if (fuera) return null;

  return (
    <div
      className={`cargando${saliendo ? " cargando-sale" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando la página"
    >
      <div className="cargando-marca">
        <svg viewBox="0 0 48 48" className="cargando-porcion" aria-hidden="true">
          <path
            d="M24 4 8 40l16-6 16 6L24 4Z"
            fill="#7FB63C"
            stroke="#1C140C"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M24 4 15 24l9 3 9-3L24 4Z"
            fill="#F4B400"
            stroke="#1C140C"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M24 4 19 14l5 1 5-1-5-10Z"
            fill="#E23528"
            stroke="#1C140C"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
        <span className="cargando-nombre">LUIGI PIZZAS</span>
      </div>
      <div className="cargando-barra" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
