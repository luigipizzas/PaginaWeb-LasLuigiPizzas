"use client";

import { useCarrito } from "./CarritoContext";

/**
 * Botón grande de la franja "Pedí ahora".
 *
 * Se comporta igual que el flotante de WhatsApp —de hecho el flotante se
 * transforma visualmente en éste— así que tampoco abre un chat directo:
 * avisa que hay que elegir la sucursal, que está justo debajo.
 *
 * Conserva el id waTarget porque la animación de GSAP lo usa como destino.
 */
export default function BotonPedidoCTA({ texto }: { texto: string }) {
  const { irASucursales, unidades } = useCarrito();

  return (
    <button
      className="btn reveal"
      id="waTarget"
      type="button"
      onClick={() =>
        irASucursales(
          unidades > 0
            ? "Elegí la sucursal y tocá “Pedir acá” para mandar tu pedido."
            : "Elegí la sucursal con la que querés comunicarte."
        )
      }
    >
      {texto}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
