{/* ===== SVG SPRITES (brand mark reused) ===== */}
<svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
  <symbol id="ic-slice" viewBox="0 0 48 48">
    <path d="M24 4 8 40l16-6 16 6L24 4Z" fill="#7FB63C" stroke="#1C140C" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M24 4 15 24l9 3 9-3L24 4Z" fill="#F4B400" stroke="#1C140C" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M24 4 19 14l5 1 5-1-5-10Z" fill="#E23528" stroke="#1C140C" strokeWidth="2.4" strokeLinejoin="round" />
  </symbol>
</svg>

{/* NAV */}
<nav>
  <div className="wrap">
    <a href="#" className="logo"><svg className="mark"><use href="#ic-slice" /></svg>LUIGI&nbsp;PIZZAS</a>
    <div className="navlinks">
      <a href="#menu">Menú</a>
      <a href="#nosotros">Nosotros</a>
      <a href="#reels">Reels</a>
      <a href="#local">Local</a>
    </div>
    <a className="btn nav-cta" href="#local">Pedí ahora
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
    <button className="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded="false">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1C140C" strokeWidth="2.4"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
    </button>
  </div>
</nav>

{/* MOBILE DRAWER */}
<div className="mobile-menu" id="mobileMenu">
  <a href="#menu">Menú</a>
  <a href="#nosotros">Nosotros</a>
  <a href="#reels">Reels</a>
  <a href="#local">Local</a>
  <a className="btn" href="#local">Pedí ahora
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </a>
</div>

{/* HERO */}
<header className="hero">
  <div className="hero-media">
    <img className="hero-img" src="IMG_3119.JPEG" alt="Las Luigi Pizzas — Eyyy! ¿Vos querés?" />
    <div className="hero-actions">
      <a className="btn green" href="#local">Pedí ahora
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
      <a className="btn ghost" href="#menu">Ver el menú
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
      </a>
    </div>
  </div>
</header>
<div className="checkers"></div>

{/* MARQUEE */}
<div className="marquee" aria-hidden="true">
  <div className="marquee-track" id="marquee">
    <span>MUZZARELLA</span><span>LOMO LUIGI</span><span>HAMBURGUESAS</span><span>EMPANADAS</span><span>FUGAZZETTA</span><span>A LA PIEDRA</span><span>ENVÍOS</span>
    <span>MUZZARELLA</span><span>LOMO LUIGI</span><span>HAMBURGUESAS</span><span>EMPANADAS</span><span>FUGAZZETTA</span><span>A LA PIEDRA</span><span>ENVÍOS</span>
  </div>
</div>

{/* Contenedor común de menú + nosotros + proceso: permite que la pizza derecha
     viaje desde el menú hasta el límite con la sección verde sin ser recortada. */}
<div className="pizza-track">
  <img className="side-pizza side-pizza-left" src="PIZZA.PNG" alt="" aria-hidden="true" />
  <img className="side-pizza side-pizza-right" src="PIZZA.PNG" alt="" aria-hidden="true" />

{/* MENU */}
<section className="section menu-sec" id="menu">
  <div className="wrap">
    <div className="sec-head reveal">
      <div>
        <span className="sec-kicker script">Mirá nuestro</span>
        <h2 className="sec-title"><em>MENÚ</em></h2>
      </div>
      <span className="script">recién horneadas</span>
    </div>
    <div className="menu-grid" id="menuGrid">
      {/* cards injected */}
    </div>
  </div>
</section>

{/* NOSOTROS */}
<section className="section origen" id="nosotros">
  <div className="wrap">
    <div className="origen-grid">
      <div className="origen-photo">
        <div className="stamp">Hecho<br />en el<br />barrio</div>
        <div className="frame">
          <img alt="El local de Las Luigi Pizzas" data-src="local.PNG" />
        </div>
      </div>
      <div className="origen-copy">
        <span className="sec-kicker script">La parte que más nos gusta</span>
        <h2 className="origen-big reveal">LUIGI</h2>
        <p className="lead reveal">Somos un local de barrio, de esos donde te conocen por el nombre y saben cómo te gusta la pizza antes de que la pidas.</p>
        <p className="reveal">Amasamos a mano, horneamos a la piedra y armamos cada lomo, hamburguesa y empanada como si fuera para nosotros. Nada de vueltas: ingredientes de verdad y porciones que se sienten.</p>
        <p className="reveal">Y si hay partido de la Selección, ya sabés: la cocina se prende a full. Pasá, pedí, y quedate con la parte que más nos gusta.</p>
      </div>
    </div>
  </div>
</section>

{/* PROCESO */}
<section className="section proceso" id="proceso">
  <div className="wrap">
    <div className="sec-head reveal">
      <div>
        <span className="sec-kicker script">Así lo hacemos</span>
        <h2 className="sec-title">De la masa a la <em>mesa</em></h2>
      </div>
    </div>
    <div className="steps">
      <div className="step reveal"><div className="num">01</div><h4>La masa</h4><p>Amasada a mano y con su tiempo de leudado, para una base finita, crocante y liviana.</p></div>
      <div className="step reveal"><div className="num">02</div><h4>El relleno</h4><p>Muzzarella de verdad, lomo tierno, carne casera y verduras frescas. Todo bien cargado.</p></div>
      <div className="step reveal"><div className="num">03</div><h4>El horno</h4><p>A la piedra, hasta que el borde se dora y el queso se estira hasta la vereda.</p></div>
      <div className="step reveal"><div className="num">04</div><h4>A tu casa</h4><p>Lo mandamos calentito en nuestras cajas Luigi o te esperamos en el local.</p></div>
    </div>
  </div>
</section>

</div>{/* /.pizza-track */}

{/* REELS */}
<section className="section reels-sec" id="reels">
  <div className="wrap">
    <div className="sec-head reveal">
      <div>
        <span className="sec-kicker script">Mirá nuestros</span>
        <h2 className="sec-title">REELS</h2>
      </div>
      <span className="script">directo de Instagram</span>
    </div>

    <div className="reels-grid" id="reelsGrid">
      {/*
        ▼▼▼  VIDEOS DE LOS REELS  ▼▼▼
        Cada tarjeta reproduce un video propio (sin header de Instagram).
        1) Creá una carpeta "videos" al lado de este archivo.
        2) Poné adentro los .mp4 con estos nombres exactos:
             videos/reel1.mp4  ·  videos/reel2.mp4  ·  videos/reel3.mp4  ·  videos/reel4.mp4
        3) (Opcional) portada real: videos/reel1.jpg, reel2.jpg, ... (si no, se usa la portada branded).
        Mientras no estén los .mp4, la portada abre el reel en Instagram (nunca queda roto).
        Para cambiar el video de una tarjeta, editá su data-video y su href.
      */}

      <article className="reel-card">
        <video className="reel-vid" playsInline={true} preload="none" poster="videos/reel1.jpg"></video>
        <a className="reel-cover c1" href="https://www.instagram.com/reel/DaTgjNclTYc/" data-video="videos/reel1.mp4" target="_blank" rel="noopener">
          <div className="reel-top"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c2.7 0 3.1 0 4.1.05 1.1.05 1.7.24 2.1.4.5.2.9.45 1.3.85.4.4.65.8.85 1.3.16.4.35 1 .4 2.1.05 1 .05 1.4.05 4.1s0 3.1-.05 4.1c-.05 1.1-.24 1.7-.4 2.1-.2.5-.45.9-.85 1.3-.4.4-.8.65-1.3.85-.4.16-1 .35-2.1.4-1 .05-1.4.05-4.1.05s-3.1 0-4.1-.05c-1.1-.05-1.7-.24-2.1-.4a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.16-.4-.35-1-.4-2.1C2.05 15.1 2.05 14.7 2.05 12s0-3.1.05-4.1c.05-1.1.24-1.7.4-2.1.2-.5.45-.9.85-1.3.4-.4.8-.65 1.3-.85.4-.16 1-.35 2.1-.4C8.9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" /></svg> @lasluigipizzas</div>
          <div className="reel-mid">
            <div className="reel-play"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7L8 5Z" /></svg></div>
            <div className="reel-title">Lomo Luigi</div>
          </div>
          <div className="reel-cap">Juegan en otra liga</div>
        </a>
      </article>

      <article className="reel-card">
        <video className="reel-vid" playsInline={true} preload="none" poster="videos/reel2.jpg"></video>
        <a className="reel-cover c2" href="https://www.instagram.com/reel/DaEKq1PD6ZY/" data-video="videos/reel2.mp4" target="_blank" rel="noopener">
          <div className="reel-top"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c2.7 0 3.1 0 4.1.05 1.1.05 1.7.24 2.1.4.5.2.9.45 1.3.85.4.4.65.8.85 1.3.16.4.35 1 .4 2.1.05 1 .05 1.4.05 4.1s0 3.1-.05 4.1c-.05 1.1-.24 1.7-.4 2.1-.2.5-.45.9-.85 1.3-.4.4-.8.65-1.3.85-.4.16-1 .35-2.1.4-1 .05-1.4.05-4.1.05s-3.1 0-4.1-.05c-1.1-.05-1.7-.24-2.1-.4a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.16-.4-.35-1-.4-2.1C2.05 15.1 2.05 14.7 2.05 12s0-3.1.05-4.1c.05-1.1.24-1.7.4-2.1.2-.5.45-.9.85-1.3.4-.4.8-.65 1.3-.85.4-.16 1-.35 2.1-.4C8.9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" /></svg> @lasluigipizzas</div>
          <div className="reel-mid">
            <div className="reel-play"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7L8 5Z" /></svg></div>
            <div className="reel-title">Detrás de la cocina</div>
          </div>
          <div className="reel-cap">Los que hacen la magia</div>
        </a>
      </article>

      <article className="reel-card">
        <video className="reel-vid" playsInline={true} preload="none" poster="videos/reel3.jpg"></video>
        <a className="reel-cover c3" href="https://www.instagram.com/reel/DY98jG-BPgN/" data-video="videos/reel3.mp4" target="_blank" rel="noopener">
          <div className="reel-top"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c2.7 0 3.1 0 4.1.05 1.1.05 1.7.24 2.1.4.5.2.9.45 1.3.85.4.4.65.8.85 1.3.16.4.35 1 .4 2.1.05 1 .05 1.4.05 4.1s0 3.1-.05 4.1c-.05 1.1-.24 1.7-.4 2.1-.2.5-.45.9-.85 1.3-.4.4-.8.65-1.3.85-.4.16-1 .35-2.1.4-1 .05-1.4.05-4.1.05s-3.1 0-4.1-.05c-1.1-.05-1.7-.24-2.1-.4a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.16-.4-.35-1-.4-2.1C2.05 15.1 2.05 14.7 2.05 12s0-3.1.05-4.1c.05-1.1.24-1.7.4-2.1.2-.5.45-.9.85-1.3.4-.4.8-.65 1.3-.85.4-.16 1-.35 2.1-.4C8.9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" /></svg> @lasluigipizzas</div>
          <div className="reel-mid">
            <div className="reel-play"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7L8 5Z" /></svg></div>
            <div className="reel-title">¿Sabés quién vino?</div>
          </div>
          <div className="reel-cap">Hasta jugadores vienen</div>
        </a>
      </article>

      <article className="reel-card">
        <video className="reel-vid" playsInline={true} preload="none" poster="videos/reel4.jpg"></video>
        <a className="reel-cover c4" href="https://www.instagram.com/reel/DY45g_QuZB6/" data-video="videos/reel4.mp4" target="_blank" rel="noopener">
          <div className="reel-top"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c2.7 0 3.1 0 4.1.05 1.1.05 1.7.24 2.1.4.5.2.9.45 1.3.85.4.4.65.8.85 1.3.16.4.35 1 .4 2.1.05 1 .05 1.4.05 4.1s0 3.1-.05 4.1c-.05 1.1-.24 1.7-.4 2.1-.2.5-.45.9-.85 1.3-.4.4-.8.65-1.3.85-.4.16-1 .35-2.1.4-1 .05-1.4.05-4.1.05s-3.1 0-4.1-.05c-1.1-.05-1.7-.24-2.1-.4a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.16-.4-.35-1-.4-2.1C2.05 15.1 2.05 14.7 2.05 12s0-3.1.05-4.1c.05-1.1.24-1.7.4-2.1.2-.5.45-.9.85-1.3.4-.4.8-.65 1.3-.85.4-.16 1-.35 2.1-.4C8.9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" /></svg> @lasluigipizzas</div>
          <div className="reel-mid">
            <div className="reel-play"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7L8 5Z" /></svg></div>
            <div className="reel-title">¿Pinta un lomo?</div>
          </div>
          <div className="reel-cap">Mañana juega la Selección</div>
        </a>
      </article>
    </div>

    <div className="reels-foot">
      <a className="btn ghost" href="https://www.instagram.com/lasluigipizzas" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" /></svg>
        Seguinos en Instagram
      </a>
    </div>
  </div>
</section>

{/* CTA + SUCURSALES */}
<section className="cta-band" id="local">
  <div className="wrap">
    <span className="script">¿Te dio hambre?</span>
    <h2 className="reveal">PEDÍ AHORA</h2>
    <p className="reveal">Abierto de Martes a Domingo · Envíos a domicilio · Retiro en el local</p>
    <a className="btn reveal" id="waTarget" href="#">Hacé tu pedido por WhatsApp
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>

    {/*
      ▼▼▼  SUCURSALES — COMPLETAR DATOS REALES  ▼▼▼
      En cada tarjeta reemplazá: el nombre (.suc-name), la dirección, el horario y
      el teléfono. En el botón "Llamar" poné href="tel:+5492611234567" y en
      "Cómo llegar" el link de Google Maps de esa sucursal.
    */}
    <div className="sucursales">

      <div className="suc-slot">
      <article className="suc-card reveal">
        <img className="suc-sticker" src="sucursal-sticker.png" alt="Local de Las Luigi Pizzas" />
        <span className="suc-tag">Local 1</span>
        <h3 className="suc-name">
          <svg className="pin" viewBox="0 0 24 24" fill="none" stroke="#7FB63C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          Sucursal Centro
        </h3>
        <div className="suc-body">
        <div className="suc-info">
        <div className="suc-row">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          <span>Completá la dirección</span>
        </div>
        <div className="suc-row">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span>Martes a Domingo · 20:00 a 00:30</span>
        </div>
        <div className="suc-row">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg>
          <span>Completá el teléfono</span>
        </div>
        <div className="suc-actions">
          <a className="btn" href="#">Llamar</a>
          <a className="btn ghost" href="https://www.google.com/maps/search/?api=1&amp;query=Las+Luigi+Pizzas" target="_blank" rel="noopener">Cómo llegar</a>
        </div>
        </div>
        <div className="suc-map">
          {/* UBICACIÓN PROVISORIA: cambiá el valor de q= por la dirección real de esta sucursal */}
          <iframe title="Mapa de la Sucursal Centro" loading="lazy" allowfullscreen={true} referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Plaza+Independencia,+Mendoza,+Argentina&amp;z=16&amp;output=embed"></iframe>
        </div>
      </div>
      </article>
      </div>

      <div className="suc-slot">
      <article className="suc-card reveal">
        <img className="suc-sticker" src="sucursal-sticker.png" alt="Local de Las Luigi Pizzas" />
        <span className="suc-tag">Local 2</span>
        <h3 className="suc-name">
          <svg className="pin" viewBox="0 0 24 24" fill="none" stroke="#7FB63C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          Sucursal Norte
        </h3>
        <div className="suc-body">
        <div className="suc-info">
        <div className="suc-row">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          <span>Completá la dirección</span>
        </div>
        <div className="suc-row">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span>Martes a Domingo · 20:00 a 00:30</span>
        </div>
        <div className="suc-row">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg>
          <span>Completá el teléfono</span>
        </div>
        <div className="suc-actions">
          <a className="btn" href="#">Llamar</a>
          <a className="btn ghost" href="https://www.google.com/maps/search/?api=1&amp;query=Las+Luigi+Pizzas" target="_blank" rel="noopener">Cómo llegar</a>
        </div>
        </div>
        <div className="suc-map">
          {/* UBICACIÓN PROVISORIA: cambiá el valor de q= por la dirección real de esta sucursal */}
          <iframe title="Mapa de la Sucursal Norte" loading="lazy" allowfullscreen={true} referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Parque+General+San+Martin,+Mendoza,+Argentina&amp;z=15&amp;output=embed"></iframe>
        </div>
      </div>
      </article>
      </div>

    </div>
  </div>
</section>

<div className="checkers green"></div>

{/* FOOTER */}
<footer>
  <div className="wrap">
    <div className="foot-grid">
      <div>
        <div className="foot-logo"><svg className="mark"><use href="#ic-slice" /></svg>LUIGI <span>PIZZAS</span></div>
        <p>Pizzas a la piedra, lomos, hamburguesas y empanadas. Del horno directo a tu mesa. En el barrio, para el barrio.</p>
      </div>
      <div className="foot-col">
        <h5>Navegá</h5>
        <a href="#menu">Menú</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#reels">Reels</a>
        <a href="#local">Local</a>
      </div>
      <div className="foot-col">
        <h5>Contacto</h5>
        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg>Pedí por WhatsApp</a>
        <a href="https://www.instagram.com/lasluigipizzas" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>@lasluigipizzas</a>
        <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>Nuestro local</a>
      </div>
    </div>
    <div className="foot-bottom">
      <span>© 2026 Las Luigi Pizzas — Todos los derechos reservados</span>
      <span>Hecho en el barrio</span>
    </div>
  </div>
</footer>

{/* BOTÓN FLOTANTE WHATSAPP (se transforma en el CTA al llegar a "¿Te dio hambre?") */}
<a className="wa-fab" id="waFab" href="#" aria-label="Hacé tu pedido por WhatsApp">
  <span className="wa-fab-ico" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.06L2 22l5.06-1.35A10 10 0 1 0 12 2Zm0 18.2a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.08.82.82-3-.19-.31A8.2 8.2 0 1 1 12 20.2Z" />
      <path d="M16.9 14.2c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.18-1.34-.8-.72-1.35-1.6-1.51-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26s.98 2.62 1.11 2.8c.14.18 1.9 2.9 4.6 4.07.64.28 1.15.44 1.54.57.65.2 1.24.18 1.7.11.52-.08 1.6-.65 1.83-1.29.23-.63.23-1.17.16-1.29-.07-.11-.25-.18-.52-.32Z" />
    </svg>
  </span>
  <span className="wa-fab-text">Hacé tu pedido por WhatsApp</span>
</a>