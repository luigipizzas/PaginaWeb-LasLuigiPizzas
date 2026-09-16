/* El linter de React 19 confunde el objeto estable del hook con un ref. */
/* eslint-disable react-hooks/refs */
"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Producto } from "@/lib/tipos";
import { guardarProducto, borrarProducto, type Resultado } from "./actions";
import { useAutoGuardado, textoEstado, useResultadoNuevo } from "./useAutoGuardado";
import SubirArchivo from "./SubirArchivo";
import Reordenar from "./Reordenar";
import styles from "./editor.module.css";
import { formatearNumeroConMiles, normalizarPrecio } from "@/lib/precios";

function BotonAgregar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.botonGuardar} type="submit" disabled={pending}>
      {pending ? "Agregando…" : "Agregar producto"}
    </button>
  );
}

export default function FichaProducto({
  producto,
  esNuevo = false,
  onGuardado,
  onCancelar,
  posicion,
  total,
}: {
  producto: Producto;
  esNuevo?: boolean;
  onGuardado?: () => void;
  onCancelar?: () => void;
  posicion?: number;
  total?: number;
}) {
  const [abierta, setAbierta] = useState(esNuevo);
  const [imagen, setImagen] = useState(producto.image_url ?? "");
  const [precio, setPrecio] = useState(
    formatearNumeroConMiles(producto.price)
  );

  const [estado, guardar] = useActionState<Resultado, FormData>(
    guardarProducto,
    {}
  );
  const [estadoBorrar, borrar] = useActionState<Resultado, FormData>(
    borrarProducto,
    {}
  );

  const auto = useAutoGuardado({ activo: !esNuevo });

  // Reaccionamos SOLO cuando llega un resultado nuevo del servidor. Antes esto
  // dependía del objeto del hook, que cambiaba en cada render: guardar
  // refrescaba, el refresco re-renderizaba y volvía a disparar el guardado.
  useResultadoNuevo(estado, (r) => {
    if (r.ok) {
      auto.marcarGuardado();
      onGuardado?.();
    } else if (r.error) auto.marcarError();
  });
  useResultadoNuevo(estadoBorrar, (r) => {
    if (r.ok) onGuardado?.();
  });

  // Cambiar la foto guarda enseguida. Se dispara desde un efecto y no justo
  // después de setImagen: hay que esperar a que React escriba la URL nueva en
  // el campo oculto, si no se envía la anterior.
  const montado = useRef(false);
  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    if (!esNuevo) auto.guardarYa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagen]);

  if (!abierta) {
    return (
      <div className={styles.filaConOrden}>
        <button
          className={styles.filaProducto}
          onClick={() => setAbierta(true)}
          type="button"
        >
          {producto.image_url ? (
            <img className={styles.miniatura} src={producto.image_url} alt="" />
          ) : (
            <span className={styles.miniaturaVacia} />
          )}
          <span className={styles.filaTexto}>
            <strong>{producto.name}</strong>
            <span>{normalizarPrecio(producto.price) ?? "Sin precio"}</span>
          </span>
          {!producto.visible && <span className={styles.oculto}>Oculto</span>}
        </button>
        <Reordenar
          tabla="products"
          id={producto.id}
          posicion={posicion}
          total={total}
          onMovido={onGuardado}
        />
      </div>
    );
  }

  return (
    <div className={styles.ficha}>
      <form ref={auto.conectarFormulario} action={guardar} className={styles.formFicha}>
        <input type="hidden" name="id" value={producto.id} />
        <input type="hidden" name="image_url" value={imagen} />
        <input type="hidden" name="sort_order" value={producto.sort_order} />

        {!esNuevo && (
          <div className={styles.cabeceraFicha}>
            <span className={styles.estadoGuardado}>
              {textoEstado(auto.estado)}
            </span>
          </div>
        )}

        {estado.error && <div className={styles.error}>{estado.error}</div>}

        <SubirArchivo valorActual={imagen} onSubido={setImagen} />

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Nombre</span>
          <input
            className={styles.input}
            name="name"
            defaultValue={producto.name}
            onInput={auto.alCambiar}
            required
          />
        </label>

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Precio</span>
            <input
              className={styles.input}
              name="price"
              value={precio}
              onChange={(evento) => {
                setPrecio(formatearNumeroConMiles(evento.target.value));
                auto.alCambiar();
              }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="10.500"
              aria-describedby={`precio-ayuda-${producto.id || "nuevo"}`}
            />
            <small
              className={styles.pista}
              id={`precio-ayuda-${producto.id || "nuevo"}`}
            >
              Escribí solo el número. Se guarda como pesos y los miles se
              separan automáticamente.
            </small>
          </label>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Etiqueta</span>
            <input
              className={styles.input}
              name="tag"
              defaultValue={producto.tag ?? ""}
              onInput={auto.alCambiar}
              placeholder="La clásica"
            />
          </label>
        </div>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Descripción</span>
          <textarea
            className={styles.textarea}
            name="description"
            rows={3}
            defaultValue={producto.description ?? ""}
            onInput={auto.alCambiar}
          />
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={producto.visible}
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
          <input type="hidden" name="id" value={producto.id} />
          {estadoBorrar.error && (
            <div className={styles.error}>{estadoBorrar.error}</div>
          )}
          <button className={styles.botonBorrar} type="submit">
            Borrar producto
          </button>
        </form>
      )}
    </div>
  );
}
