/* El linter de React 19 confunde el objeto estable del hook con un ref. */
/* eslint-disable react-hooks/refs */
"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Sucursal } from "@/lib/tipos";
import { guardarSucursal, borrarSucursal, type Resultado } from "./actions";
import { useAutoGuardado, textoEstado, useResultadoNuevo } from "./useAutoGuardado";
import Reordenar from "./Reordenar";
import styles from "./editor.module.css";

function BotonAgregar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.botonGuardar} type="submit" disabled={pending}>
      {pending ? "Agregando…" : "Agregar sucursal"}
    </button>
  );
}

export default function FichaSucursal({
  sucursal,
  esNuevo = false,
  onGuardado,
  onCancelar,
  posicion,
  total,
}: {
  sucursal: Sucursal;
  esNuevo?: boolean;
  onGuardado?: () => void;
  onCancelar?: () => void;
  posicion?: number;
  total?: number;
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

  // Las fichas ya existentes se guardan solas; las nuevas necesitan el botón.
  const auto = useAutoGuardado({ activo: !esNuevo });

  useResultadoNuevo(estado, (res) => {
    if (res.ok) {
      auto.marcarGuardado();
      onGuardado?.();
    } else if (res.error) auto.marcarError();
  });
  useResultadoNuevo(estadoBorrar, (res) => {
    if (res.ok) onGuardado?.();
  });

  if (!abierta) {
    return (
      <div className={styles.filaConOrden}>
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
        <Reordenar
          tabla="sucursales"
          id={sucursal.id}
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
        <input type="hidden" name="id" value={sucursal.id} />
        <input type="hidden" name="sort_order" value={sucursal.sort_order} />

        {!esNuevo && (
          <div className={styles.cabeceraFicha}>
            <span className={styles.estadoGuardado}>
              {textoEstado(auto.estado)}
            </span>
          </div>
        )}

        {estado.error && <div className={styles.error}>{estado.error}</div>}

        <div className={styles.dosColumnas}>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Nombre</span>
            <input
              className={styles.input}
              name="nombre"
              defaultValue={sucursal.nombre}
              onInput={auto.alCambiar}
              required
            />
          </label>
          <label className={styles.campo}>
            <span className={styles.etiqueta}>Etiqueta</span>
            <input
              className={styles.input}
              name="tag"
              defaultValue={sucursal.tag ?? ""}
              onInput={auto.alCambiar}
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
            onInput={auto.alCambiar}
            placeholder="Av. San Martín 1234, Mendoza"
          />
          <small className={styles.pista}>
            Se muestra en la tarjeta y es <strong>la que dibuja el mini mapa</strong>.
            Poné la dirección completa (con ciudad) para que lo ubique bien.
          </small>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Horario</span>
          <input
            className={styles.input}
            name="horario"
            defaultValue={sucursal.horario ?? ""}
            onInput={auto.alCambiar}
            placeholder="Martes a Domingo · 20:00 a 00:30"
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>WhatsApp — botón “Escribinos”</span>
          <input
            className={styles.input}
            name="whatsapp"
            inputMode="tel"
            defaultValue={sucursal.whatsapp ?? ""}
            onInput={auto.alCambiar}
            placeholder="5492611234567"
          />
          <small className={styles.pista}>
            Con código de país y sin espacios ni signos: para Mendoza empieza con
            <strong> 549261…</strong>. Si lo dejás vacío, se usa el WhatsApp
            general de la pestaña <strong>Textos</strong>.
          </small>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Teléfono</span>
          <input
            className={styles.input}
            name="telefono"
            inputMode="tel"
            defaultValue={sucursal.telefono ?? ""}
            onInput={auto.alCambiar}
            placeholder="+54 9 261 123 4567"
          />
          <small className={styles.pista}>Solo se muestra en la tarjeta.</small>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Link de Google Maps (opcional)</span>
          <input
            className={styles.input}
            name="maps_url"
            defaultValue={sucursal.maps_url ?? ""}
            onInput={auto.alCambiar}
            placeholder="https://maps.app.goo.gl/..."
          />
          <small className={styles.pista}>
            Solo cambia a dónde lleva el botón <strong>Cómo llegar</strong>. El
            mini mapa de la tarjeta siempre sale de la dirección, porque los links
            cortos de Google no se pueden incrustar.
          </small>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={sucursal.visible}
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
