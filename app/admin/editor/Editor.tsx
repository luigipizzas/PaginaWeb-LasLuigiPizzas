"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Producto, Reel, Sucursal } from "@/lib/tipos";
import FichaProducto from "./FichaProducto";
import FichaReel from "./FichaReel";
import FichaSucursal from "./FichaSucursal";
import PanelTextos from "./PanelTextos";
import styles from "./editor.module.css";

type Pestana = "menu" | "reels" | "sucursales" | "textos";

const PRODUCTO_NUEVO: Producto = {
  id: "", name: "", tag: "", price: "", description: "",
  image_url: "", sort_order: 99, visible: true,
};
const REEL_NUEVO: Reel = {
  id: "", title: "", caption: "", ig_url: "", video_url: "",
  poster_url: "", sort_order: 99, visible: true,
};
const SUCURSAL_NUEVA: Sucursal = {
  id: "", nombre: "", tag: "", direccion: "", horario: "", telefono: "",
  whatsapp: "", maps_url: "", mapa_query: "", sort_order: 99, visible: true,
};

export default function Editor({
  productos,
  reels,
  sucursales,
  textos,
  email,
}: {
  productos: Producto[];
  reels: Reel[];
  sucursales: Sucursal[];
  textos: Record<string, Record<string, string>>;
  email: string;
}) {
  const [pestana, setPestana] = useState<Pestana>("menu");
  const [agregando, setAgregando] = useState(false);
  const [vistaMovil, setVistaMovil] = useState(false);
  // En celular no entran las dos columnas: se alterna entre editar y previsualizar.
  const [mostrandoVista, setMostrandoVista] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const refrescoPanel = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => () => {
    if (refrescoPanel.current) clearTimeout(refrescoPanel.current);
  }, []);

  // Refresca la vista previa y también los datos del panel (hace falta para
  // que la lista refleje el nuevo orden o el nombre recién cambiado).
  const refrescarVista = useCallback(() => {
    const marco = iframeRef.current;
    marco?.contentWindow?.postMessage(
      { tipo: "luigi:actualizar-vista" },
      window.location.origin
    );

    // El panel también recibe los datos actuales (nombres, orden y altas),
    // pero agrupamos respuestas cercanas para no competir con el guardado.
    if (refrescoPanel.current) clearTimeout(refrescoPanel.current);
    refrescoPanel.current = setTimeout(() => router.refresh(), 180);
  }, [router]);

  const cambiarPestana = (p: Pestana) => {
    setPestana(p);
    setAgregando(false);
  };

  const etiquetaAgregar = {
    menu: "+ Agregar producto",
    reels: "+ Agregar reel",
    sucursales: "+ Agregar sucursal",
    textos: "",
  }[pestana];

  return (
    <div className={styles.pantalla}>
      <header className={styles.barra}>
        <div className={styles.izquierda}>
          <Link href="/admin" className={styles.volver}>
            ← Panel
          </Link>
          <span className={styles.titulo}>Editor</span>
        </div>

        <div className={styles.derecha}>
          {/* Alternar editar / vista previa — solo aparece en pantallas chicas */}
          <button
            type="button"
            className={styles.alternarMovil}
            onClick={() => setMostrandoVista((v) => !v)}
          >
            {mostrandoVista ? "Editar" : "Ver la página"}
          </button>

          <div className={styles.selectorVista}>
            <button
              type="button"
              className={!vistaMovil ? styles.vistaActiva : styles.vistaBoton}
              onClick={() => setVistaMovil(false)}
            >
              Compu
            </button>
            <button
              type="button"
              className={vistaMovil ? styles.vistaActiva : styles.vistaBoton}
              onClick={() => setVistaMovil(true)}
            >
              Celular
            </button>
          </div>
          <span className={styles.email}>{email}</span>
        </div>
      </header>

      <div
        className={`${styles.cuerpo} ${
          mostrandoVista ? styles.cuerpoViendo : ""
        }`}
      >
        {/* ---------- Panel de edición ---------- */}
        <aside className={styles.panel}>
          {/* Va como div, no como <nav>: globals.css (CSS de la landing) tiene
              una regla `nav{position:fixed}` para su navbar que se filtraría acá
              y dejaría las pestañas flotando sobre la barra superior. */}
          <div className={styles.pestanas} role="tablist">
            <button
              className={pestana === "menu" ? styles.pestanaActiva : styles.pestana}
              onClick={() => cambiarPestana("menu")}
              type="button"
            >
              Menú <small>{productos.length}</small>
            </button>
            <button
              className={pestana === "reels" ? styles.pestanaActiva : styles.pestana}
              onClick={() => cambiarPestana("reels")}
              type="button"
            >
              Reels <small>{reels.length}</small>
            </button>
            <button
              className={
                pestana === "sucursales" ? styles.pestanaActiva : styles.pestana
              }
              onClick={() => cambiarPestana("sucursales")}
              type="button"
            >
              Locales <small>{sucursales.length}</small>
            </button>
            <button
              className={pestana === "textos" ? styles.pestanaActiva : styles.pestana}
              onClick={() => cambiarPestana("textos")}
              type="button"
            >
              Textos
            </button>
          </div>

          <div className={styles.contenidoPanel}>
            {pestana !== "textos" && (
              <>
                <p className={styles.ayuda}>
                  Tocá un elemento para editarlo. Se guarda solo mientras
                  escribís y la vista de al lado se actualiza sola. Con las
                  flechas ↑ ↓ cambiás el orden en que aparecen.
                </p>

                {agregando ? (
                  <>
                    {pestana === "menu" && (
                      <FichaProducto
                        producto={PRODUCTO_NUEVO}
                        esNuevo
                        onGuardado={() => {
                          setAgregando(false);
                          refrescarVista();
                        }}
                        onCancelar={() => setAgregando(false)}
                      />
                    )}
                    {pestana === "reels" && (
                      <FichaReel
                        reel={REEL_NUEVO}
                        esNuevo
                        onGuardado={() => {
                          setAgregando(false);
                          refrescarVista();
                        }}
                        onCancelar={() => setAgregando(false)}
                      />
                    )}
                    {pestana === "sucursales" && (
                      <FichaSucursal
                        sucursal={SUCURSAL_NUEVA}
                        esNuevo
                        onGuardado={() => {
                          setAgregando(false);
                          refrescarVista();
                        }}
                        onCancelar={() => setAgregando(false)}
                      />
                    )}
                  </>
                ) : (
                  <button
                    className={styles.botonAgregar}
                    onClick={() => setAgregando(true)}
                    type="button"
                  >
                    {etiquetaAgregar}
                  </button>
                )}

                <div className={styles.lista}>
                  {pestana === "menu" &&
                    productos.map((p, i) => (
                      <FichaProducto
                        key={p.id}
                        producto={p}
                        posicion={i}
                        total={productos.length}
                        onGuardado={refrescarVista}
                      />
                    ))}
                  {pestana === "reels" &&
                    reels.map((r, i) => (
                      <FichaReel
                        key={r.id}
                        reel={r}
                        posicion={i}
                        total={reels.length}
                        onGuardado={refrescarVista}
                      />
                    ))}
                  {pestana === "sucursales" &&
                    sucursales.map((s, i) => (
                      <FichaSucursal
                        key={s.id}
                        sucursal={s}
                        posicion={i}
                        total={sucursales.length}
                        onGuardado={refrescarVista}
                      />
                    ))}
                </div>
              </>
            )}

            {pestana === "textos" && (
              <PanelTextos textos={textos} onGuardado={refrescarVista} />
            )}
          </div>
        </aside>

        {/* ---------- Vista previa ---------- */}
        <main className={styles.vista}>
          <div className={vistaMovil ? styles.marcoMovil : styles.marcoAncho}>
            <iframe
              ref={iframeRef}
              src="/"
              className={styles.iframe}
              title="Vista previa del sitio"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
