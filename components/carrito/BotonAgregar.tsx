"use client";

import { useState } from "react";
import { useCarrito } from "./CarritoContext";

/** El "+" de cada tarjeta del menú. */
export default function BotonAgregar({
  id,
  nombre,
  precio,
}: {
  id: string;
  nombre: string;
  precio: string | null;
}) {
  const { agregar } = useCarrito();
  const [saltando, setSaltando] = useState(false);

  return (
    <button
      className={`card-add${saltando ? " agregado" : ""}`}
      aria-label={`Agregar ${nombre} al pedido`}
      onClick={() => {
        agregar({ id, nombre, precio });
        setSaltando(true);
        setTimeout(() => setSaltando(false), 350);
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
