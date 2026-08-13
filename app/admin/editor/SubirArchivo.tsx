"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./editor.module.css";

const MAX_MB = 50;

/**
 * Sube la foto o el video directamente del navegador a Supabase Storage.
 *
 * No pasa por una Server Action a propósito: esas tienen un límite de 1 MB
 * por pedido, así que cualquier foto sacada con el celular fallaba con un 500
 * antes de llegar al servidor. Subiendo derecho al bucket no hay ese tope,
 * el archivo no viaja por Vercel y además va más rápido.
 *
 * La seguridad no cambia: las policies del bucket sólo permiten escribir a
 * quien esté en la tabla de administradores.
 */
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

    setError(null);

    const esImagen = archivo.type.startsWith("image/");
    const esVideo = archivo.type.startsWith("video/");
    if (!esImagen && !esVideo) {
      setError("El archivo tiene que ser una imagen o un video.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const mb = archivo.size / 1024 / 1024;
    if (mb > MAX_MB) {
      setError(
        `El archivo pesa ${mb.toFixed(1)} MB y el máximo son ${MAX_MB} MB.`
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSubiendo(true);

    try {
      const supabase = createClient();
      const ext = archivo.name.split(".").pop()?.toLowerCase() || "jpg";
      const nombre = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: errorSubida } = await supabase.storage
        .from("media")
        .upload(nombre, archivo, { cacheControl: "3600", upsert: false });

      if (errorSubida) {
        // El caso típico es la sesión vencida tras un rato con el panel abierto.
        setError(
          /jwt|token|unauthor/i.test(errorSubida.message)
            ? "Tu sesión venció. Volvé a entrar y probá de nuevo."
            : `No pudimos subir el archivo: ${errorSubida.message}`
        );
        return;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(nombre);
      onSubido(data.publicUrl);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No pudimos subir el archivo."
      );
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const esVideoActual = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(valorActual);

  return (
    <div className={styles.campo}>
      <span className={styles.etiqueta}>{etiqueta}</span>

      <div className={styles.zonaImagen}>
        {valorActual ? (
          esVideoActual ? (
            <video className={styles.previsualizacion} src={valorActual} muted />
          ) : (
            <img className={styles.previsualizacion} src={valorActual} alt="" />
          )
        ) : (
          <div className={styles.sinImagen}>Sin archivo</div>
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
          {valorActual && !subiendo && (
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
