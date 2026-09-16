/* El linter de React 19 confunde el objeto estable del hook con un ref. */
/* eslint-disable react-hooks/refs */
"use client";

import { useActionState } from "react";
import { guardarTextos, type Resultado } from "./actions";
import { useAutoGuardado, textoEstado, useResultadoNuevo } from "./useAutoGuardado";
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
  const auto = useAutoGuardado();

  useResultadoNuevo(estado, (res) => {
    if (res.ok) {
      auto.marcarGuardado();
      onGuardado?.();
    } else if (res.error) auto.marcarError();
  });

  return (
    <form ref={auto.conectarFormulario} action={accion} className={styles.formTextos}>
      <div className={styles.cabeceraFicha}>
        <p className={styles.ayuda}>
          Cambiá los textos de la página. Se guardan solos.
        </p>
        <span className={styles.estadoGuardado}>{textoEstado(auto.estado)}</span>
      </div>

      {estado.error && <div className={styles.error}>{estado.error}</div>}

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
                    onInput={auto.alCambiar}
                  />
                ) : (
                  <input
                    className={styles.input}
                    name={nombre}
                    defaultValue={valor}
                    onInput={auto.alCambiar}
                    inputMode={campo.id === "whatsapp" ? "tel" : undefined}
                  />
                )}
              </label>
            );
          })}
        </fieldset>
      ))}
    </form>
  );
}
