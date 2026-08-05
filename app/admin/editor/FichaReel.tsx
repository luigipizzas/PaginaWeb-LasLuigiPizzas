"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { Reel } from "@/lib/tipos";
import { guardarReel, borrarReel, type Resultado } from "./actions";
import SubirArchivo from "./SubirArchivo";
import styles from "./editor.module.css";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.botonGuardar} type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

export default function FichaReel({
  reel,
  esNuevo = false,
  onGuardado,
  onCancelar,
}: {
  reel: Reel;
  esNuevo?: boolean;
  onGuardado?: () => void;
  onCancelar?: () => void;
}) {
  const [abierta, setAbierta] = useState(esNuevo);
  const [portada, setPortada] = useState(reel.poster_url ?? "");
  const [video, setVideo] = useState(reel.video_url ?? "");

  const [estado, guardar] = useActionState<Resultado, FormData>(guardarReel, {});
  const [estadoBorrar, borrar] = useActionState<Resultado, FormData>(
    borrarReel,
    {}
  );

  useEffect(() => {
    if (estado.ok || estadoBorrar.ok) onGuardado?.();
  }, [estado.ok, estadoBorrar.ok, onGuardado]);

  if (!abierta) {
    return (
      <button
        className={styles.filaProducto}
        onClick={() => setAbierta(true)}
        type="button"
      >
        {portada ? (
          <img className={styles.miniatura} src={portada} alt="" />
        ) : (
          <span className={styles.miniaturaVacia} />
        )}
        <span className={styles.filaTexto}>
          <strong>{reel.title}</strong>
          <span>{reel.caption}</span>
        </span>
        {!reel.visible && <span className={styles.oculto}>Oculto</span>}
      </button>
    );
  }

  return (
    <div className={styles.ficha}>
      <form action={guardar} className={styles.formFicha}>
        <input type="hidden" name="id" value={reel.id} />
        <input type="hidden" name="poster_url" value={portada} />
        <input type="hidden" name="video_url" value={video} />

        {estado.error && <div className={styles.error}>{estado.error}</div>}
        {estado.ok && <div className={styles.ok}>{estado.ok}</div>}

        <SubirArchivo
          valorActual={portada}
          onSubido={setPortada}
          etiqueta="Portada"
        />

        <div className={styles.campo}>
          <span className={styles.etiqueta}>Video (opcional)</span>
          {video ? (
            <div className={styles.archivoCargado}>
              <span className={styles.archivoNombre}>{video.split("/").pop()}</span>
              <button
                className={styles.botonTexto}
                type="button"
                onClick={() => setVideo("")}
              >
                Quitar
              </button>
            </div>
          ) : (
            <SubirArchivo
              valorActual=""
              onSubido={setVideo}
              etiqueta="Subir video"
            />
          )}
        </div>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Título</span>
          <input
            className={styles.input}
            name="title"
            defaultValue={reel.title ?? ""}
            required
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Frase de abajo</span>
          <input
            className={styles.input}
            name="caption"
            defaultValue={reel.caption ?? ""}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Link del reel en Instagram</span>
          <input
            className={styles.input}
            name="ig_url"
            defaultValue={reel.ig_url ?? ""}
            placeholder="https://www.instagram.com/reel/..."
          />
        </label>

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Orden</span>
            <input
              className={styles.input}
              name="sort_order"
              type="number"
              defaultValue={reel.sort_order}
            />
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" name="visible" defaultChecked={reel.visible} />
            <span>Mostrar en la página</span>
          </label>
        </div>

        <div className={styles.accionesFicha}>
          <BotonGuardar />
          <button
            className={styles.botonSecundario}
            type="button"
            onClick={() => (esNuevo ? onCancelar?.() : setAbierta(false))}
          >
            {esNuevo ? "Cancelar" : "Cerrar"}
          </button>
        </div>
      </form>

      {!esNuevo && (
        <form action={borrar} className={styles.formBorrar}>
          <input type="hidden" name="id" value={reel.id} />
          {estadoBorrar.error && (
            <div className={styles.error}>{estadoBorrar.error}</div>
          )}
          <button className={styles.botonBorrar} type="submit">
            Borrar reel
          </button>
        </form>
      )}
    </div>
  );
}
