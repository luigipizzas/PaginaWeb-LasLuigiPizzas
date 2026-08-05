import type { Reel } from "@/lib/tipos";

/**
 * Grilla de reels. Mantiene el markup original: la portada abre el reel en
 * Instagram y, si hay video propio, el script de Animaciones lo reproduce
 * en la tarjeta (usa data-video y .reel-cover).
 */
export default function ReelsGrid({ reels }: { reels: Reel[] }) {
  if (reels.length === 0) {
    return (
      <div className="reels-grid" id="reelsGrid">
        <p style={{ gridColumn: "1 / -1", opacity: 0.8 }}>
          Todavía no cargaste reels. Agregalos desde el panel.
        </p>
      </div>
    );
  }

  return (
    <div className="reels-grid" id="reelsGrid">
      {reels.map((r, i) => (
        <article className="reel-card" key={r.id}>
          <video
            className="reel-vid"
            playsInline
            preload="none"
            poster={r.poster_url ?? undefined}
          />
          <a
            className={`reel-cover c${(i % 4) + 1}`}
            href={r.ig_url ?? "#"}
            data-video={r.video_url ?? ""}
            target="_blank"
            rel="noopener"
          >
            <div className="reel-top">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
              </svg>
              Reel
            </div>
            <div className="reel-mid">
              <div className="reel-play">
                <svg viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7L8 5Z" />
                </svg>
              </div>
              <div className="reel-title">{r.title}</div>
            </div>
            <div className="reel-cap">{r.caption}</div>
          </a>
        </article>
      ))}
    </div>
  );
}
