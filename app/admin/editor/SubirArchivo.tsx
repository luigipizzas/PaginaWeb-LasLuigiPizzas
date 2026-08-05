"use client";

import { useState, useRef } from "react";
import { subirImagen } from "./actions";
import styles from "./editor.module.css";

export default function SubirArchivo({
  valorActual,
  onSubido,
  etiqueta = "Foto",
}: {
  valorActual: string;
  onSubido: (url: string) => void;
  etiqueta?: string;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);
    setError(null);

    const datos = new FormData();
    datos.append("archivo", archivo);
    const r = await subirImagen(datos);

    setSubiendo(false);
    if (r.error) setError(r.error);
    else if (r.url) onSubido(r.url);

    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={styles.campo}>
      <span className={styles.etiqueta}>{etiqueta}</span>

      <div className={styles.zonaImagen}>
        {valorActual ? (
          <img className={styles.previsualizacion} src={valorActual} alt="" />
        ) : (
          <div className={styles.sinImagen}>Sin foto</div>
        )}

        <div className={styles.accionesImagen}>
          <button
            className={styles.botonSecundario}
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
          >
            {subiendo ? "Subiendo…" : valorActual ? "Cambiar" : "Subir"}
          </button>
          {valorActual && (
            <button
              className={styles.botonTexto}
              type="button"
              onClick={() => onSubido("")}
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={alElegir}
        hidden
      />
    </div>
  );
}
