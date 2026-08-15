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
        // Tiene que durar lo mismo que el zoom del CSS (.55s), si no se corta.
        window.setTimeout(() => setFuera(true), 560);
      }, esperar);
    };

    // Lo que se ve primero: la pizza de esta misma pantalla y el hero.
    // (Las pizzas de los costados usan el mismo archivo, así que van de yapa.)
    const imagenesArriba = () => {
      const imgs = [
        ...document.querySelectorAll<HTMLImageElement>(
          ".cargando-pizza, .hero-img"
        ),
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
      {/* La misma pizza que después recorre el menú al scrollear: gira
          mientras carga y, al terminar, se acerca y se va.
          Van en dos capas a propósito: la caja hace el zoom y la imagen gira.
          Si el mismo elemento hiciera las dos cosas, al cortar el giro para
          hacer el zoom el navegador no puede interpolar y el acercamiento
          sale de un salto. */}
      <div className="cargando-pizza-caja">
        <img
          className="cargando-pizza"
          src="/PIZZA.PNG"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
      </div>
      <span className="cargando-nombre">LUIGI PIZZAS</span>
      <div className="cargando-barra" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
