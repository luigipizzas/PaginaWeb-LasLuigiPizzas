"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { Producto } from "@/lib/tipos";
import { guardarProducto, borrarProducto, type Resultado } from "./actions";
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

export default function FichaProducto({
  producto,
  esNuevo = false,
  onGuardado,
  onCancelar,
}: {
  producto: Producto;
  esNuevo?: boolean;
  onGuardado?: () => void;
  onCancelar?: () => void;
}) {
  const [abierta, setAbierta] = useState(esNuevo);
  const [imagen, setImagen] = useState(producto.image_url ?? "");

  const [estado, guardar] = useActionState<Resultado, FormData>(
    guardarProducto,
    {}
  );
  const [estadoBorrar, borrar] = useActionState<Resultado, FormData>(
    borrarProducto,
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
        {producto.image_url ? (
          <img
            className={styles.miniatura}
            src={producto.image_url}
            alt=""
          />
        ) : (
          <span className={styles.miniaturaVacia} />
        )}
        <span className={styles.filaTexto}>
          <strong>{producto.name}</strong>
          <span>{producto.price}</span>
        </span>
        {!producto.visible && <span className={styles.oculto}>Oculto</span>}
      </button>
    );
  }

  return (
    <div className={styles.ficha}>
      <form action={guardar} className={styles.formFicha}>
        <input type="hidden" name="id" value={producto.id} />
        <input type="hidden" name="image_url" value={imagen} />

        {estado.error && <div className={styles.error}>{estado.error}</div>}
        {estado.ok && <div className={styles.ok}>{estado.ok}</div>}

        <SubirArchivo valorActual={imagen} onSubido={setImagen} />

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Nombre</span>
          <input
            className={styles.input}
            name="name"
            defaultValue={producto.name}
            required
          />
        </label>

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Precio</span>
            <input
              className={styles.input}
              name="price"
              defaultValue={producto.price ?? ""}
              placeholder="$10.500"
            />
          </label>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Etiqueta</span>
            <input
              className={styles.input}
              name="tag"
              defaultValue={producto.tag ?? ""}
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
          />
        </label>

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Orden</span>
            <input
              className={styles.input}
              name="sort_order"
              type="number"
              defaultValue={producto.sort_order}
            />
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="visible"
              defaultChecked={producto.visible}
            />
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
