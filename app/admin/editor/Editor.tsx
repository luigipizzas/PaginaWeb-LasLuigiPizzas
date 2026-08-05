"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { Producto } from "@/lib/tipos";
import FichaProducto from "./FichaProducto";
import PanelTextos from "./PanelTextos";
import styles from "./editor.module.css";

type Pestana = "menu" | "textos";

const PRODUCTO_NUEVO: Producto = {
  id: "",
  name: "",
  tag: "",
  price: "",
  description: "",
  image_url: "",
  sort_order: 99,
  visible: true,
};

export default function Editor({
  productos,
  textos,
  email,
}: {
  productos: Producto[];
  textos: Record<string, Record<string, string>>;
  email: string;
}) {
  const [pestana, setPestana] = useState<Pestana>("menu");
  const [agregando, setAgregando] = useState(false);
  const [vistaMovil, setVistaMovil] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Tras guardar, recargamos la vista previa para ver el cambio aplicado.
  const refrescarVista = useCallback(() => {
    const marco = iframeRef.current;
    if (!marco) return;
    const base = marco.src.split("?")[0];
    marco.src = `${base}?v=${Date.now()}`;
  }, []);

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
          <div className={styles.selectorVista}>
            <button
              type="button"
              className={!vistaMovil ? styles.vistaActiva : styles.vistaBoton}
              onClick={() => setVistaMovil(false)}
            >
              Computadora
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

      <div className={styles.cuerpo}>
        {/* ---------- Panel de edición ---------- */}
        <aside className={styles.panel}>
          <nav className={styles.pestanas}>
            <button
              className={pestana === "menu" ? styles.pestanaActiva : styles.pestana}
              onClick={() => setPestana("menu")}
              type="button"
            >
              Menú ({productos.length})
            </button>
            <button
              className={pestana === "textos" ? styles.pestanaActiva : styles.pestana}
              onClick={() => setPestana("textos")}
              type="button"
            >
              Textos
            </button>
          </nav>

          <div className={styles.contenidoPanel}>
            {pestana === "menu" && (
              <>
                <p className={styles.ayuda}>
                  Tocá un producto para cambiar su foto, precio o descripción.
                  Los cambios se ven al instante en la vista de al lado.
                </p>

                {agregando ? (
                  <FichaProducto
                    producto={PRODUCTO_NUEVO}
                    esNuevo
                    onGuardado={() => {
                      setAgregando(false);
                      refrescarVista();
                    }}
                    onCancelar={() => setAgregando(false)}
                  />
                ) : (
                  <button
                    className={styles.botonAgregar}
                    onClick={() => setAgregando(true)}
                    type="button"
                  >
                    + Agregar producto
                  </button>
                )}

                <div className={styles.lista}>
                  {productos.map((p) => (
                    <FichaProducto
                      key={p.id}
                      producto={p}
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
