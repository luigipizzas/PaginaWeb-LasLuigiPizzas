"use client";

import { useCarrito, armarMensaje } from "./CarritoContext";

/**
 * Botón de cada tarjeta de sucursal.
 * Si hay pedido armado, abre WhatsApp con el detalle y el total.
 * Si el carrito está vacío, abre un chat simple para consultar.
 */
export default function BotonPedirSucursal({
  nombreSucursal,
  whatsapp,
}: {
  nombreSucursal: string;
  whatsapp: string;
}) {
  const { items, total, nombreCliente, vaciar, unidades } = useCarrito();

  const numero = (whatsapp ?? "").replace(/\D/g, "");
  const hayPedido = unidades > 0;

  function abrirWhatsApp() {
    if (!numero) return;

    const texto = hayPedido
      ? armarMensaje(items, total, nombreCliente, nombreSucursal)
      : `¡Hola! Quiero hacer un pedido en ${nombreSucursal}.`;

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener"
    );

    // El pedido ya viajó al chat: dejamos el carrito limpio para el próximo.
    if (hayPedido) vaciar();
  }

  if (!numero) return null;

  return (
    <button
      className={`btn${hayPedido ? " pedir-listo" : ""}`}
      onClick={abrirWhatsApp}
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.2.2-3.5-.7-2.9-1.2-4.8-4.2-4.9-4.4-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.2.3 0 .5.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4.1.5-.1l.8-1c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
      </svg>
      {hayPedido ? "Pedir acá" : "Escribinos"}
    </button>
  );
}
