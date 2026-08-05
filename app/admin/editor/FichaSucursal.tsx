"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { Sucursal } from "@/lib/tipos";
import { guardarSucursal, borrarSucursal, type Resultado } from "./actions";
import styles from "./editor.module.css";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.botonGuardar} type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

export default function FichaSucursal({
  sucursal,
  esNuevo = false,
  onGuardado,
  onCancelar,
}: {
  sucursal: Sucursal;
  esNuevo?: boolean;
  onGuardado?: () => void;
  onCancelar?: () => void;
}) {
  const [abierta, setAbierta] = useState(esNuevo);

  const [estado, guardar] = useActionState<Resultado, FormData>(
    guardarSucursal,
    {}
  );
  const [estadoBorrar, borrar] = useActionState<Resultado, FormData>(
    borrarSucursal,
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
        <span className={styles.miniaturaVacia} />
        <span className={styles.filaTexto}>
          <strong>{sucursal.nombre}</strong>
          <span>{sucursal.direccion}</span>
        </span>
        {!sucursal.visible && <span className={styles.oculto}>Oculta</span>}
      </button>
    );
  }

  return (
    <div className={styles.ficha}>
      <form action={guardar} className={styles.formFicha}>
        <input type="hidden" name="id" value={sucursal.id} />

        {estado.error && <div className={styles.error}>{estado.error}</div>}
        {estado.ok && <div className={styles.ok}>{estado.ok}</div>}

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Nombre</span>
            <input
              className={styles.input}
              name="nombre"
              defaultValue={sucursal.nombre}
              required
            />
          </label>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Etiqueta</span>
            <input
              className={styles.input}
              name="tag"
              defaultValue={sucursal.tag ?? ""}
              placeholder="Local 1"
            />
          </label>
        </div>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Dirección</span>
          <input
            className={styles.input}
            name="direccion"
            defaultValue={sucursal.direccion ?? ""}
            placeholder="Av. San Martín 1234"
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Horario</span>
          <input
            className={styles.input}
            name="horario"
            defaultValue={sucursal.horario ?? ""}
            placeholder="Martes a Domingo · 20:00 a 00:30"
          />
        </label>

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Teléfono</span>
            <input
              className={styles.input}
              name="telefono"
              defaultValue={sucursal.telefono ?? ""}
              placeholder="+54 9 261 123 4567"
            />
          </label>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>WhatsApp</span>
            <input
              className={styles.input}
              name="whatsapp"
              defaultValue={sucursal.whatsapp ?? ""}
              placeholder="5492611234567"
            />
          </label>
        </div>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>
            Dirección para el mapa (lo que buscarías en Google Maps)
          </span>
          <input
            className={styles.input}
            name="mapa_query"
            defaultValue={sucursal.mapa_query ?? ""}
            placeholder="Av. San Martín 1234, Mendoza, Argentina"
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Link de “Cómo llegar” (opcional)</span>
          <input
            className={styles.input}
            name="maps_url"
            defaultValue={sucursal.maps_url ?? ""}
            placeholder="Se arma solo con la dirección del mapa"
          />
        </label>

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Orden</span>
            <input
              className={styles.input}
              name="sort_order"
              type="number"
              defaultValue={sucursal.sort_order}
            />
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="visible"
              defaultChecked={sucursal.visible}
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
          <input type="hidden" name="id" value={sucursal.id} />
          {estadoBorrar.error && (
            <div className={styles.error}>{estadoBorrar.error}</div>
          )}
          <button className={styles.botonBorrar} type="submit">
            Borrar sucursal
          </button>
        </form>
      )}
    </div>
  );
}
