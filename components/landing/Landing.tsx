import type { Producto, Reel, Sucursal } from "@/lib/tipos";
import Image from "next/image";
import MenuGrid from "./MenuGrid";
import ReelsGrid from "./ReelsGrid";
import SucursalesGrid from "./SucursalesGrid";
import Animaciones from "./Animaciones";
import Cargando from "./Cargando";
import { CarritoProvider } from "@/components/carrito/CarritoContext";
import PanelCarrito from "@/components/carrito/PanelCarrito";
import BotonWhatsAppFlotante from "@/components/carrito/BotonWhatsAppFlotante";
import BotonPedidoCTA from "@/components/carrito/BotonPedidoCTA";

/**
 * Landing de Las Luigi Pizzas.
 * El markup es el original portado a JSX; el contenido dinámico llega por props.
 */
export default function Landing({
  productos,
  reels = [],
  sucursales = [],
  textos = {},
}: {
  productos: Producto[];
  reels?: Reel[];
  sucursales?: Sucursal[];
  textos?: Record<string, Record<string, string>>;
}) {
  // Devuelve el texto editable; si todavía no se cargó, no rompe nada.
  const txt = (seccion: string, campo: string) => textos[seccion]?.[campo] ?? "";

  // El WhatsApp ya no arma un link directo acá: los botones llevan a elegir
  // sucursal y cada una manda el pedido a su propio número.
  const linkIg = `https://www.instagram.com/${
    textos.contacto?.instagram ?? "lasluigipizzas"
  }`;

  return (
    <CarritoProvider>
      <Cargando />
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
          <a href="#" className="logo" aria-label="Las Luigi Pizzas — inicio">
            <Image
              className="logo-img"
              src="/logo-las-luigi-pizzas.png"
              alt="Las Luigi Pizzas"
              width={1774}
              height={887}
              sizes="(max-width: 620px) 108px, 152px"
              loading="eager"
            />
          </a>
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

      {/* HERO + cuadros + marquee.
          En celular los tres juntos ocupan exactamente una pantalla: el bloque
          mide 100svh y el hero se estira con lo que sobra, así no hay que
          hardcodear las alturas de los cuadros ni del marquee. */}
      <div className="hero-bloque">
        <header className="hero">
          <div className="hero-media">
            <picture>
              {/* En celular va una foto vertical propia: la apaisada, recortada
                  a pantalla de teléfono, perdía el texto o la pizza. */}
              <source media="(max-width: 700px)" srcSet="/heroMOBILE.jpg" />
              <img className="hero-img" src="/IMG_3119.JPEG" alt="Las Luigi Pizzas — Eyyy! ¿Vos querés?" />
            </picture>
            <div className="hero-actions">
              <a className="btn green" href="#menu">Ver el menú
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
              </a>
              <a className="btn ghost" href="#local">Pedí ahora
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
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
      </div>

      {/* Contenedor común de menú + nosotros + proceso: permite que la pizza derecha
           viaje desde el menú hasta el límite con la sección verde sin ser recortada. */}
      <div className="pizza-track">
        <img className="side-pizza side-pizza-left" src="/PIZZA.PNG" alt="" aria-hidden="true" />
        <img className="side-pizza side-pizza-right" src="/PIZZA.PNG" alt="" aria-hidden="true" />

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
          <MenuGrid productos={productos} />
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="section origen" id="nosotros">
        <div className="wrap">
          <div className="origen-grid">
            <div className="origen-photo">
              <div className="stamp">Hecho<br />en el<br />barrio</div>
              <div className="frame">
                <img alt="El local de Las Luigi Pizzas" src="/local.PNG" loading="lazy" />
              </div>
            </div>
            <div className="origen-copy">
              <span className="sec-kicker script">{txt("nosotros","kicker")}</span>
              <h2 className="origen-big reveal">{txt("nosotros","titulo")}</h2>
              <p className="lead reveal">{txt("nosotros","parrafo1")}</p>
              <p className="reveal">{txt("nosotros","parrafo2")}</p>
              <p className="reveal">{txt("nosotros","parrafo3")}</p>
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

          <ReelsGrid reels={reels} />
          <div className="reels-foot">
            <a className="btn ghost" href={linkIg} target="_blank" rel="noopener">
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
          <h2 className="reveal">{txt("cta","titulo")}</h2>
          <p className="reveal">{txt("cta","texto")}</p>
          <BotonPedidoCTA texto={txt("cta","boton")} />

          {/* Las sucursales se cargan y editan desde el panel (/admin/editor) */}
          <SucursalesGrid items={sucursales} whatsappGeneral={textos.contacto?.whatsapp ?? ""} />
        </div>
      </section>

      <div className="checkers green"></div>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#" className="foot-logo" aria-label="Las Luigi Pizzas — volver al inicio">
                <Image
                  src="/logo-las-luigi-pizzas.png"
                  alt="Las Luigi Pizzas"
                  width={1774}
                  height={887}
                  sizes="(max-width: 620px) 210px, 260px"
                />
              </a>
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
              <a href={linkIg} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>@{txt("contacto","instagram")}</a>
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
      <BotonWhatsAppFlotante texto={txt("cta","boton")} />
      <Animaciones />
      <PanelCarrito />
    </CarritoProvider>
  );
}
