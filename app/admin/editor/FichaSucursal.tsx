"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { Sucursal } from "@/lib/tipos";
import { guardarSucursal, borrarSucursal, type Resultado } from "./actions";
import { useAutoGuardado, textoEstado } from "./useAutoGuardado";
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

  useEffect(() => {
    if (estado.ok) {
      auto.marcarGuardado();
      onGuardado?.();
    }
    if (estadoBorrar.ok) onGuardado?.();
  }, [estado.ok, estadoBorrar.ok, onGuardado, auto]);

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
      <form ref={auto.formRef} action={guardar} className={styles.formFicha}>
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
            placeholder="Av. San Martín 1234"
          />
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
          <span className={styles.etiqueta}>WhatsApp — botón principal</span>
          <input
            className={styles.input}
            name="whatsapp"
            defaultValue={sucursal.whatsapp ?? ""}
            onInput={auto.alCambiar}
            placeholder="5492611234567"
          />
          <small className={styles.pista}>
            Con código de país y sin espacios ni signos. Si lo cargás, la tarjeta
            muestra el botón <strong>Escribinos</strong> que abre el chat.
          </small>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Teléfono</span>
          <input
            className={styles.input}
            name="telefono"
            defaultValue={sucursal.telefono ?? ""}
            onInput={auto.alCambiar}
            placeholder="+54 9 261 123 4567"
          />
          <small className={styles.pista}>
            Se muestra en la tarjeta. Si no cargaste WhatsApp, el botón pasa a ser
            “Llamar”.
          </small>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Link de Google Maps</span>
          <input
            className={styles.input}
            name="maps_url"
            defaultValue={sucursal.maps_url ?? ""}
            onInput={auto.alCambiar}
            placeholder="https://maps.app.goo.gl/..."
          />
          <small className={styles.pista}>
            Pegá acá el link que te da Google Maps al tocar “Compartir”. Es el que
            abre el botón <strong>Cómo llegar</strong>. Si lo dejás vacío, se arma
            solo con la dirección de abajo.
          </small>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Dirección del mapa que se ve</span>
          <input
            className={styles.input}
            name="mapa_query"
            defaultValue={sucursal.mapa_query ?? ""}
            onInput={auto.alCambiar}
            placeholder="Av. San Martín 1234, Mendoza, Argentina"
          />
          <small className={styles.pista}>
            Dirección completa para el mapa que aparece dentro de la tarjeta.
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
