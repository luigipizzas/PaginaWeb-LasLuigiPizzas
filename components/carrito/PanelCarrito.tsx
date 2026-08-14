"use client";

import { useCarrito, formatearPrecio } from "./CarritoContext";

/**
 * Botón flotante con el resumen del pedido y el panel para revisarlo.
 * Va abajo a la izquierda para no chocar con el botón de WhatsApp.
 */
export default function PanelCarrito() {
  const {
    items,
    unidades,
    total,
    abierto,
    setAbierto,
    quitar,
    agregar,
    sacarTodo,
    vaciar,
    nombreCliente,
    setNombreCliente,
    irASucursales,
    aviso,
  } = useCarrito();

  return (
    <>
      {/* Aviso flotante (lo comparten el carrito y el botón de WhatsApp) */}
      {aviso && (
        <div className="aviso-flotante" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{aviso}</span>
        </div>
      )}

      {/* Botón flotante */}
      {unidades > 0 && (
        <button
          className="carrito-fab"
          onClick={() => setAbierto(!abierto)}
          aria-label={`Ver mi pedido (${unidades} ${unidades === 1 ? "ítem" : "ítems"})`}
        >
          <span className="carrito-fab-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.6" />
              <circle cx="18" cy="20" r="1.6" />
              <path d="M6 6 5 2H2" />
            </svg>
            <span className="carrito-burbuja">{unidades}</span>
          </span>
          <span className="carrito-fab-texto">{formatearPrecio(total)}</span>
        </button>
      )}

      {/* Panel */}
      {abierto && (
        <>
          <div className="carrito-fondo" onClick={() => setAbierto(false)} />
          <aside className="carrito-panel" aria-label="Mi pedido">
            <header className="carrito-cabecera">
              <h3>Mi pedido</h3>
              <button
                className="carrito-cerrar"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </header>

            <div className="carrito-items">
              {items.map((i) => (
                <div className="carrito-item" key={i.id}>
                  <div className="carrito-item-datos">
                    <strong>{i.nombre}</strong>
                    <span>{formatearPrecio(i.precio)} c/u</span>
                  </div>
                  <div className="carrito-cantidad">
                    <button onClick={() => quitar(i.id)} aria-label={`Quitar uno de ${i.nombre}`}>−</button>
                    <span>{i.cantidad}</span>
                    <button
                      onClick={() => agregar({ id: i.id, nombre: i.nombre, precio: String(i.precio) })}
                      aria-label={`Agregar uno de ${i.nombre}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="carrito-subtotal">
                    {formatearPrecio(i.precio * i.cantidad)}
                    <button
                      className="carrito-borrar"
                      onClick={() => sacarTodo(i.id)}
                      aria-label={`Sacar ${i.nombre} del pedido`}
                    >
                      Sacar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <label className="carrito-campo">
              <span>Tu nombre</span>
              <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Para que sepamos de quién es el pedido"
                autoComplete="name"
              />
            </label>

            <div className="carrito-total">
              <span>Total</span>
              <strong>{formatearPrecio(total)}</strong>
            </div>

            <button
              className="btn carrito-pedir"
              onClick={() =>
                irASucursales(
                  "Elegí la sucursal donde querés pedir y tocá “Pedir acá”."
                )
              }
            >
              Elegir sucursal y pedir
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>

            <button className="carrito-vaciar" onClick={vaciar}>
              Vaciar el pedido
            </button>
          </aside>
        </>
      )}
    </>
  );
}
