"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Reel } from "@/lib/tipos";
import { guardarReel, borrarReel, type Resultado } from "./actions";
import { useAutoGuardado, textoEstado, useResultadoNuevo } from "./useAutoGuardado";
import SubirArchivo from "./SubirArchivo";
import Reordenar from "./Reordenar";
import styles from "./editor.module.css";

function BotonAgregar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.botonGuardar} type="submit" disabled={pending}>
      {pending ? "Agregando…" : "Agregar reel"}
    </button>
  );
}

export default function FichaReel({
  reel,
  esNuevo = false,
  onGuardado,
  onCancelar,
  posicion,
  total,
}: {
  reel: Reel;
  esNuevo?: boolean;
  onGuardado?: () => void;
  onCancelar?: () => void;
  posicion?: number;
  total?: number;
}) {
  const [abierta, setAbierta] = useState(esNuevo);
  const [portada, setPortada] = useState(reel.poster_url ?? "");
  const [video, setVideo] = useState(reel.video_url ?? "");

  const [estado, guardar] = useActionState<Resultado, FormData>(guardarReel, {});
  const [estadoBorrar, borrar] = useActionState<Resultado, FormData>(
    borrarReel,
    {}
  );

  const auto = useAutoGuardado({ activo: !esNuevo });

  useResultadoNuevo(estado, (res) => {
    if (res.ok) {
      auto.marcarGuardado();
      onGuardado?.();
    }
  });
  useResultadoNuevo(estadoBorrar, (res) => {
    if (res.ok) onGuardado?.();
  });

  // Igual que en productos: el guardado se dispara desde un efecto para que
  // React ya haya escrito la URL nueva en el campo oculto.
  const montado = useRef(false);
  useEffect(() => {
    if (!montado.current) { montado.current = true; return; }
    if (!esNuevo) auto.guardarYa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portada, video]);

  if (!abierta) {
    return (
      <div className={styles.filaConOrden}>
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
        <Reordenar
          tabla="reels"
          id={reel.id}
          posicion={posicion}
          total={total}
          onMovido={onGuardado}
        />
      </div>
    );
  }

  return (
    <div className={styles.ficha}>
      <form ref={auto.formRef} action={guardar} className={styles.formFicha}>
        <input type="hidden" name="id" value={reel.id} />
        <input type="hidden" name="poster_url" value={portada} />
        <input type="hidden" name="video_url" value={video} />
        <input type="hidden" name="sort_order" value={reel.sort_order} />

        {!esNuevo && (
          <div className={styles.cabeceraFicha}>
            <span className={styles.estadoGuardado}>
              {textoEstado(auto.estado)}
            </span>
          </div>
        )}

        {estado.error && <div className={styles.error}>{estado.error}</div>}

        <SubirArchivo
          valorActual={portada}
          onSubido={setPortada}
          etiqueta="Portada"
        />

        <div className={styles.campo}>
          <span className={styles.etiqueta}>Video (opcional)</span>
          {video ? (
            <div className={styles.archivoCargado}>
              <span className={styles.archivoNombre}>
                {video.split("/").pop()}
              </span>
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
          <small className={styles.pista}>
            Si cargás un video, se reproduce dentro de la tarjeta. Si no, la
            portada abre el reel en Instagram.
          </small>
        </div>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Título</span>
          <input
            className={styles.input}
            name="title"
            defaultValue={reel.title ?? ""}
            onInput={auto.alCambiar}
            required
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Frase de abajo</span>
          <input
            className={styles.input}
            name="caption"
            defaultValue={reel.caption ?? ""}
            onInput={auto.alCambiar}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Link del reel en Instagram</span>
          <input
            className={styles.input}
            name="ig_url"
            defaultValue={reel.ig_url ?? ""}
            onInput={auto.alCambiar}
            placeholder="https://www.instagram.com/reel/..."
          />
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={reel.visible}
            onChange={auto.guardarYa}
          />
          <span>Mostrar en la página</span>
        </label>

        <div className={styles.accionesFicha}>
          {esNuevo ? (
            <>
              <BotonAgregar />
              <button
                className={styles.botonSecundario}
                type="button"
                onClick={onCancelar}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className={styles.botonSecundario}
              type="button"
              onClick={() => setAbierta(false)}
            >
              Listo
            </button>
          )}
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
