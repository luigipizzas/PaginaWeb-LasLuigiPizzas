"use client";

import { useTransition } from "react";
import { moverElemento, type TablaOrdenable } from "./actions";
import styles from "./editor.module.css";

/**
 * Flechas para cambiar el orden en que se muestran los elementos.
 * Reemplaza al campo numérico "orden", que no se entendía.
 */
export default function Reordenar({
  tabla,
  id,
  posicion,
  total,
  onMovido,
}: {
  tabla: TablaOrdenable;
  id: string;
  posicion?: number;
  total?: number;
  onMovido?: () => void;
}) {
  const [pendiente, iniciar] = useTransition();

  if (posicion === undefined || total === undefined || total < 2) return null;

  const mover = (direccion: "arriba" | "abajo") =>
    iniciar(async () => {
      await moverElemento(tabla, id, direccion);
      onMovido?.();
    });

  return (
    <div className={styles.reordenar}>
      <button
        type="button"
        className={styles.flecha}
        onClick={() => mover("arriba")}
        disabled={pendiente || posicion === 0}
        aria-label="Subir"
        title="Subir"
      >
        ↑
      </button>
      <button
        type="button"
        className={styles.flecha}
        onClick={() => mover("abajo")}
        disabled={pendiente || posicion === total - 1}
        aria-label="Bajar"
        title="Bajar"
      >
        ↓
      </button>
    </div>
  );
}
