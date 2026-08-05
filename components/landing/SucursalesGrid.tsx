import type { Sucursal } from "@/lib/tipos";

const PinSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/** Tarjetas de sucursales, con el mismo markup original pero desde la base. */
export default function SucursalesGrid({ items }: { items: Sucursal[] }) {
  if (items.length === 0) return null;

  return (
    <div className="sucursales">
      {items.map((s) => {
        const tel = (s.telefono ?? "").replace(/[^\d+]/g, "");

        // WhatsApp: solo dígitos, con mensaje listo para enviar.
        const wa = (s.whatsapp ?? "").replace(/\D/g, "");
        const mensaje = encodeURIComponent(
          `¡Hola! Quiero hacer un pedido en ${s.nombre}.`
        );
        const linkWa = wa ? `https://wa.me/${wa}?text=${mensaje}` : null;

        const mapa = s.mapa_query || s.direccion || "Las Luigi Pizzas";
        const comoLlegar =
          s.maps_url ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapa)}`;

        return (
          <div className="suc-slot" key={s.id}>
            <article className="suc-card reveal">
              <img
                className="suc-sticker"
                src="/sucursal-sticker.png"
                alt="Local de Las Luigi Pizzas"
              />
              {s.tag && <span className="suc-tag">{s.tag}</span>}

              <h3 className="suc-name">
                <svg
                  className="pin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7FB63C"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {s.nombre}
              </h3>

              <div className="suc-body">
                <div className="suc-info">
                  <div className="suc-row">
                    <PinSvg />
                    <span>{s.direccion}</span>
                  </div>
                  <div className="suc-row">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <span>{s.horario}</span>
                  </div>
                  <div className="suc-row">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
                    </svg>
                    <span>{s.telefono}</span>
                  </div>

                  <div className="suc-actions">
                    {/* Si hay WhatsApp, ese es el botón principal. Si no, llamar. */}
                    {linkWa ? (
                      <a
                        className="btn"
                        href={linkWa}
                        target="_blank"
                        rel="noopener"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.2.2-3.5-.7-2.9-1.2-4.8-4.2-4.9-4.4-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.2.3 0 .5.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4.1.5-.1l.8-1c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
                        </svg>
                        Escribinos
                      </a>
                    ) : (
                      <a className="btn" href={tel ? `tel:${tel}` : "#"}>
                        Llamar
                      </a>
                    )}
                    <a
                      className="btn ghost"
                      href={comoLlegar}
                      target="_blank"
                      rel="noopener"
                    >
                      Cómo llegar
                    </a>
                  </div>
                </div>

                <div className="suc-map">
                  <iframe
                    title={`Mapa de ${s.nombre}`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      mapa
                    )}&z=16&output=embed`}
                  />
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
