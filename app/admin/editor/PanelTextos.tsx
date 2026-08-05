"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { guardarTextos, type Resultado } from "./actions";
import styles from "./editor.module.css";

/** Qué textos de la landing se pueden editar, agrupados por sección. */
const ESQUEMA = [
  {
    clave: "nosotros",
    titulo: "Nosotros",
    campos: [
      { id: "kicker", etiqueta: "Frase verde de arriba", largo: false },
      { id: "titulo", etiqueta: "Título grande", largo: false },
      { id: "parrafo1", etiqueta: "Primer párrafo", largo: true },
      { id: "parrafo2", etiqueta: "Segundo párrafo", largo: true },
      { id: "parrafo3", etiqueta: "Tercer párrafo", largo: true },
    ],
  },
  {
    clave: "cta",
    titulo: "Franja de pedido",
    campos: [
      { id: "titulo", etiqueta: "Título", largo: false },
      { id: "texto", etiqueta: "Texto", largo: true },
      { id: "boton", etiqueta: "Texto del botón", largo: false },
    ],
  },
  {
    clave: "contacto",
    titulo: "Contacto",
    campos: [
      {
        id: "whatsapp",
        etiqueta: "WhatsApp (solo números, ej: 5492611234567)",
        largo: false,
      },
      { id: "instagram", etiqueta: "Usuario de Instagram", largo: false },
    ],
  },
] as const;

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.botonGuardar} type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar textos"}
    </button>
  );
}

export default function PanelTextos({
  textos,
  onGuardado,
}: {
  textos: Record<string, Record<string, string>>;
  onGuardado?: () => void;
}) {
  const [estado, accion] = useActionState<Resultado, FormData>(
    guardarTextos,
    {}
  );

  useEffect(() => {
    if (estado.ok) onGuardado?.();
  }, [estado.ok, onGuardado]);

  return (
    <form action={accion} className={styles.formTextos}>
      <p className={styles.ayuda}>
        Cambiá los textos de la página. Se actualizan apenas guardás.
      </p>

      {estado.error && <div className={styles.error}>{estado.error}</div>}
      {estado.ok && <div className={styles.ok}>{estado.ok}</div>}

      {ESQUEMA.map((seccion) => (
        <fieldset key={seccion.clave} className={styles.grupoTextos}>
          <legend className={styles.leyenda}>{seccion.titulo}</legend>

          {seccion.campos.map((campo) => {
            const nombre = `${seccion.clave}.${campo.id}`;
            const valor = textos[seccion.clave]?.[campo.id] ?? "";
            return (
              <label key={nombre} className={styles.campo}>
                <span className={styles.etiqueta}>{campo.etiqueta}</span>
                {campo.largo ? (
                  <textarea
                    className={styles.textarea}
                    name={nombre}
                    rows={3}
                    defaultValue={valor}
                  />
                ) : (
                  <input
                    className={styles.input}
                    name={nombre}
                    defaultValue={valor}
                  />
                )}
              </label>
            );
          })}
        </fieldset>
      ))}

      <BotonGuardar />
    </form>
  );
}
