import type { Producto } from "@/lib/tipos";
import BotonAgregar from "@/components/carrito/BotonAgregar";

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
              <BotonAgregar id={p.id} nombre={p.name} precio={p.price} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
