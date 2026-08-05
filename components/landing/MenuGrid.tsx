import type { Producto } from "@/lib/tipos";

/** Grilla del menú. Mismo markup que la landing original, pero con datos de Supabase. */
export default function MenuGrid({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <div className="menu-grid" id="menuGrid">
        <p style={{ gridColumn: "1 / -1", opacity: 0.7 }}>
          Todavía no cargaste productos. Agregalos desde el panel.
        </p>
      </div>
    );
  }

  return (
    <div className="menu-grid" id="menuGrid">
      {productos.map((p) => (
        <article className="card reveal" key={p.id}>
          <div className="card-media">
            {p.tag && <span className="card-tag">{p.tag}</span>}
            {p.image_url && <img alt={p.name} src={p.image_url} />}
          </div>
          <div className="card-body">
            <h3 className="card-name">{p.name}</h3>
            <p className="card-desc">{p.description}</p>
            <div className="card-foot">
              <span className="card-price">{p.price}</span>
              <button
                className="card-add"
                aria-label={`Agregar ${p.name} al pedido`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
