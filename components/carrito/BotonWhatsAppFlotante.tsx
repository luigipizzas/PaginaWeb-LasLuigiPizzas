"use client";

import { useCarrito } from "./CarritoContext";

/**
 * Botón fijo de WhatsApp.
 *
 * No abre un chat directo a propósito: como hay más de una sucursal, primero
 * hay que saber a cuál escribirle. Lleva a la sección de locales y deja el
 * aviso para que la persona elija.
 *
 * Mantiene el id waFab porque la animación de GSAP lo busca por ahí para
 * hacerlo viajar hasta el botón grande de la franja de pedido.
 */
export default function BotonWhatsAppFlotante({ texto }: { texto: string }) {
  const { irASucursales, unidades } = useCarrito();

  return (
    <button
      className="wa-fab"
      id="waFab"
      type="button"
      aria-label="Hacé tu pedido por WhatsApp"
      onClick={() =>
        irASucursales(
          unidades > 0
            ? "Elegí la sucursal y tocá “Pedir acá” para mandar tu pedido."
            : "Elegí la sucursal con la que querés comunicarte."
        )
      }
    >
      <span className="wa-fab-ico" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 3A13 13 0 0 0 4.8 22.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm7.6 18.5c-.3 1-1.6 1.8-2.6 2-.7.1-1.5.2-4.6-1-3.8-1.6-6.3-5.5-6.5-5.8-.2-.3-1.6-2.1-1.6-4s.9-2.8 1.3-3.2c.3-.4.8-.5 1-.5h.8c.3 0 .6 0 .8.6l1.2 2.8c.1.2.2.5 0 .8l-.5.7-.4.4c-.1.2-.3.4 0 .7.3.4 1.1 1.8 2.3 2.8 1.5 1.3 2.7 1.7 3.1 1.9.3.1.5.1.7-.1l1-1.2c.2-.3.5-.2.7-.1l2.7 1.3c.3.1.5.2.6.4.1.3.1.9-.2 1.7Z" />
        </svg>
      </span>
      <span className="wa-fab-text">{texto}</span>
    </button>
  );
}
