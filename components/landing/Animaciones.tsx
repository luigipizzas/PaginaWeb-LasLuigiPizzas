// @ts-nocheck
/*
 * Código de animación portado tal cual desde la landing original en HTML.
 * Se excluye del chequeo de tipos a propósito: es JS de navegador ya probado
 * (querySelector devuelve Element y haría falta castear en decenas de lugares).
 * Si se refactoriza a futuro, conviene tiparlo de a un bloque por vez.
 */
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Todas las interacciones y animaciones de la landing original.
 * Portado de los <script> inline: menú móvil, nav transparente, reels,
 * scroll suave con Lenis y los ScrollTrigger de GSAP.
 */
export default function Animaciones() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- Interacciones de la interfaz ----------
    /* ===================== MOBILE MENU ===================== */
    (function(){
      const toggle = document.getElementById('menuToggle');
      const menu = document.getElementById('mobileMenu');
      if(!toggle || !menu) return;
      const close = ()=>{ menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); };
      toggle.addEventListener('click', ()=>{
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', close));
    })();

    /* ===================== NAV: transparente sobre el hero, sólido al scrollear ===================== */
    (function(){
      const nav = document.querySelector('nav');
      const hero = document.querySelector('.hero');
      if(!nav) return;

      // Mientras el hero está en pantalla el nav va transparente (se ve la imagen).
      // Cuando el hero queda arriba, el nav toma fondo sólido para que se lea.
      function update(){
        const limit = hero ? Math.max(hero.offsetHeight - 90, 40) : 40;
        nav.classList.toggle('scrolled', window.scrollY > limit);
      }
      update();
      window.addEventListener('scroll', update, {passive:true});
      window.addEventListener('resize', update);

      // refuerzo con IntersectionObserver (más preciso y eficiente)
      if(hero && 'IntersectionObserver' in window){
        new IntersectionObserver(([e])=>{
          nav.classList.toggle('scrolled', !e.isIntersecting);
        }, {rootMargin:'-90px 0px 0px 0px', threshold:0}).observe(hero);
      }
    })();

    /* ===================== REELS: reproducir video propio ===================== */
    (function(){
      document.querySelectorAll('.reel-cover').forEach(cover=>{
        cover.addEventListener('click', function(e){
          const src = cover.dataset.video;
          const card = cover.closest('.reel-card');
          const vid = card ? card.querySelector('.reel-vid') : null;
          if(!src || !vid){ return; } // sin video local: el link abre el reel en Instagram
          e.preventDefault();
          let failed = false;
          // si el archivo no existe, abrimos el reel en Instagram (nunca queda roto)
          vid.addEventListener('error', ()=>{
            if(!failed){ failed = true; window.open(cover.href, '_blank', 'noopener'); }
          }, {once:true});
          // cuando arranca a reproducir, ocultamos la portada y mostramos controles
          vid.addEventListener('playing', ()=>{
            cover.classList.add('is-hidden');
            vid.setAttribute('controls','');
          }, {once:true});
          vid.src = src;
          const p = vid.play();
          if(p && p.catch){ p.catch(()=>{}); }
        });
      });
    })();


    // ---------- Animaciones ----------
    (() => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ===================== LENIS (scroll suave) ===================== */
      if(!reduce && Lenis){
        const lenis = new Lenis({ lerp:0.09, smoothWheel:true, wheelMultiplier:1 });
        // Lo movemos con el ticker de GSAP para que quede sincronizado con ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        // Los enlaces internos (#menu, #local, etc.) hacen scroll suave con Lenis
        document.querySelectorAll('a[href^="#"]').forEach(a => {
          a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if(id === '#'){ e.preventDefault(); lenis.scrollTo(0); return; }
            const el = document.querySelector(id);
            if(el){ e.preventDefault(); lenis.scrollTo(el, { offset:-80 }); }
          });
        });
      }

      if(!reduce){
        /* Hero: la imagen entra con un zoom sutil y los botones suben con fade */
        gsap.from('.hero-img', {scale:1.06, duration:1.4, ease:'power3.out'});
        gsap.from('.hero-actions .btn', {y:26, opacity:0, duration:.7, ease:'back.out(1.6)', delay:.6, stagger:.13});

        gsap.utils.toArray('.sticker').forEach((s,i)=>{
          gsap.to(s, {y:(i%2?-22:22), rotation:(i%2?8:-8), duration:2.4+i*.3, yoyo:true, repeat:-1, ease:'sine.inOut'});
        });

        const track = document.getElementById('marquee');
        if(track){
          const half = track.scrollWidth/2;
          gsap.to(track, {x:-half, duration:24, ease:'none', repeat:-1});
        }

        gsap.utils.toArray('.reveal').forEach(el=>{
          gsap.to(el, {opacity:1, y:0, duration:.9, ease:'power3.out',
            scrollTrigger:{trigger:el, start:'top 88%'}});
        });

        ScrollTrigger.batch('.card', {
          start:'top 90%',
          onEnter: b=>gsap.to(b,{opacity:1,y:0,rotate:0,duration:.7,ease:'power3.out',stagger:.1})
        });
        gsap.set('.card', {rotate:-2});

        gsap.to('.origen-big', {xPercent:8, ease:'none',
          scrollTrigger:{trigger:'.origen', start:'top bottom', end:'bottom top', scrub:.6}});
        gsap.to('.origen-photo .frame', {yPercent:-8, ease:'none',
          scrollTrigger:{trigger:'.origen', start:'top bottom', end:'bottom top', scrub:.6}});

        /* Foto del local: opacidad ligada al scroll (aparece al entrar, se desvanece al salir de vista) */
        const oPhoto = document.querySelector('.origen-photo');
        if(oPhoto){
          gsap.timeline({scrollTrigger:{trigger:oPhoto, start:'top bottom', end:'bottom top', scrub:true}})
            .fromTo(oPhoto, {opacity:0}, {opacity:1, ease:'none', duration:.3})  // entra por abajo → aparece
            .to(oPhoto, {opacity:1, duration:.4})                                // se queda visible en el centro
            .to(oPhoto, {opacity:0, ease:'none', duration:.3});                  // sale por arriba → se desvanece

          /* Tarjeta 3D: se inclina siguiendo el mouse (solo con puntero fino, no en touch) */
          if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
            gsap.set(oPhoto, {transformPerspective:900, transformOrigin:'center'});
            const rotX = gsap.quickTo(oPhoto, 'rotationX', {duration:.4, ease:'power2.out'});
            const rotY = gsap.quickTo(oPhoto, 'rotationY', {duration:.4, ease:'power2.out'});
            const scl  = gsap.quickTo(oPhoto, 'scale',     {duration:.4, ease:'power2.out'});
            const MAX = 11; // grados de inclinación
            oPhoto.addEventListener('pointermove', e=>{
              const r = oPhoto.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width  - .5;   // -0.5 .. 0.5
              const py = (e.clientY - r.top)  / r.height - .5;
              rotY(px * MAX * 2);
              rotX(-py * MAX * 2);
              scl(1.035);
            });
            oPhoto.addEventListener('pointerleave', ()=>{ rotX(0); rotY(0); scl(1); });
          }
        }

        const steps = gsap.utils.toArray('.step');
        if(steps.length){
          // Selección de pasos SIN pin: resalta cada paso mientras la sección pasa por pantalla.
          // Al no pinnear, la sección de reels queda pegada debajo (ya no "sube" con el scroll).
          ScrollTrigger.create({
            trigger:'.proceso', start:'top 70%', end:'bottom 65%', scrub:.5,
            onUpdate:self=>{
              const idx = Math.min(steps.length-1, Math.floor(self.progress*steps.length));
              steps.forEach((s,i)=>{
                gsap.to(s,{scale:i===idx?1.04:1, borderColor:i===idx?'#E23528':'#1C140C',
                  backgroundColor:i===idx?'#2A1E12':'#1C140C', duration:.3});
              });
            }
          });
        }

        gsap.to('.hero-bg-word', {yPercent:20, ease:'none',
          scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:.5}});

        /* Pizzas laterales: salen desde abajo del marquee y se abren a cada lado con el scroll */
        (() => {
          const sec = document.querySelector('.menu-sec');
          const pL  = document.querySelector('.side-pizza-left');
          const pR  = document.querySelector('.side-pizza-right');
          if(!sec || !pL || !pR) return;
          // Estado inicial: escondidas arriba (clippeadas bajo el marquee), juntas hacia el centro
          gsap.set(pL, {yPercent:-120, xPercent:135, rotate:-65, opacity:0});
          gsap.set(pR, {yPercent:-120, xPercent:-135, rotate:65, opacity:0});
          // Aparición + apertura hacia cada lado, atada al scroll de entrada al menú
          gsap.timeline({scrollTrigger:{trigger:sec, start:'top 92%', end:'top 30%', scrub:.6}})
            .to(pL, {yPercent:0, xPercent:0, rotate:-14, opacity:1, ease:'none'}, 0)
            .to(pR, {yPercent:0, xPercent:0, rotate:14,  opacity:1, ease:'none'}, 0);
          // Descenso + rotación mientras giran, atado al scroll.
          // immediateRender:false para no pisar el estado del reveal al cargar.

          // Los recorridos van como función + invalidateOnRefresh: así se recalculan al
          // redimensionar (las alturas cambian, y bajo 900px las pizzas son display:none).
          const TOP_CSS = 50;   // .side-pizza { top:50px }

          // IZQUIERDA: baja hasta el final del menú (como estaba).
          gsap.fromTo(pL, {y:0, rotate:-14},
            {y:() => Math.max(160, sec.offsetHeight - pL.offsetHeight - 100),
             rotate:54, ease:'none', immediateRender:false,
             scrollTrigger:{trigger:sec, start:'top 30%', end:'bottom bottom',
                            scrub:1, invalidateOnRefresh:true}});

          // DERECHA: sigue bajando por "La parte que más nos gusta" y termina centrada
          // justo sobre el límite entre esa sección y la verde (mitad en cada una).
          const origen = document.querySelector('.origen');
          if(origen){
            gsap.fromTo(pR, {y:0, rotate:14},
              {y:() => {
                 const limite = origen.offsetTop + origen.offsetHeight;  // relativo a .pizza-track
                 return Math.max(160, limite - pR.offsetHeight / 2 - TOP_CSS);
               },
               rotate:-70, ease:'none', immediateRender:false,
               scrollTrigger:{trigger:sec, start:'top 30%', endTrigger:origen, end:'bottom 60%',
                              scrub:1, invalidateOnRefresh:true}});
          }
        })();
      } else {
        gsap.set('.reveal',{opacity:1,y:0});
        gsap.set('.hero-title .line span',{yPercent:0});
        gsap.set('.side-pizza-left',{opacity:1,rotate:-12});
        gsap.set('.side-pizza-right',{opacity:1,rotate:12});
      }
    })();



    // ---------- Botón flotante de WhatsApp + sucursales ----------
    (() => {
      const fab    = document.getElementById('waFab');
      const target = document.getElementById('waTarget');
      if(!fab || !target) return;
      const text = fab.querySelector('.wa-fab-text');
      const ico  = fab.querySelector('.wa-fab-ico');

      // El flotante usa el mismo link que el botón real
      const href = target.getAttribute('href');
      if(href) fab.setAttribute('href', href);

      const M = 24, R = 62;                                  // margen y diámetro del círculo
      const rest = ()=>({w:R, h:R, l:innerWidth-R-M, t:innerHeight-R-M});

      // Ancho natural del texto: lo necesitamos para poder animarlo de 0 a completo.
      const TEXTW = (()=>{ text.style.width='auto'; const w = text.scrollWidth; text.style.width='0px'; return w; })();
      const GAP = 10;

      function place(p){
        const r = target.getBoundingClientRect(), a = rest();
        gsap.set(fab, {
          width : a.w + (r.width  - a.w)*p,
          height: a.h + (r.height - a.h)*p,
          left  : a.l + (r.left   - a.l)*p,
          top   : a.t + (r.top    - a.t)*p,
          gap   : GAP * p
        });
        gsap.set(ico,  {scale: 1 - .18*p});
        // El texto crece en ancho junto con la píldora y recién se ve sobre el final
        gsap.set(text, {width: TEXTW * p, opacity: p < .55 ? 0 : (p-.55)/.45});
        target.classList.toggle('is-replaced', p > .02);
      }

      // Con "reducir movimiento" activado: círculo siempre, y el botón real intacto.
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        place(0);
        gsap.set(fab,{autoAlpha:1});
        target.classList.remove('is-replaced');
        window.addEventListener('resize', ()=>place(0));
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.set(fab,{autoAlpha:0, scale:.5});
      place(0);

      // Aparece recién pasado el hero (si no, tapa la imagen principal)
      ScrollTrigger.create({
        trigger:'.hero', start:'bottom 85%',
        onEnter    : ()=>gsap.to(fab,{autoAlpha:1, scale:1,  duration:.4, ease:'back.out(1.7)'}),
        onLeaveBack: ()=>gsap.to(fab,{autoAlpha:0, scale:.5, duration:.25, ease:'power2.in'})
      });

      // Progreso del morph: de círculo (0) a botón (1)
      // Arranca cuando la sección ya está bien entrada en pantalla (no apenas asoma)
      const morph = ScrollTrigger.create({trigger:'.cta-band', start:'top 58%', end:'top 22%'});

      gsap.ticker.add(()=>place(morph.progress));
      window.addEventListener('resize', ()=>place(morph.progress));

      /* ===== SUCURSALES: arrancan superpuestas al centro y se acomodan ===== */
      (function(){
        const slots = gsap.utils.toArray('.suc-slot');
        if(slots.length !== 2) return;

        // offsetLeft NO se ve afectado por los transforms de GSAP, así que sirve
        // para medir la distancia real entre las dos columnas en cualquier momento.
        const gap  = ()=> slots[1].offsetLeft - slots[0].offsetLeft;
        const apiladas = ()=> gap() < 20;                 // en celular van una debajo de otra

        if(apiladas()) return;                            // sin efecto lateral en móvil

        gsap.timeline({
          scrollTrigger:{
            trigger:'.sucursales',
            start:'top 92%', end:'top 45%',
            scrub:.6, invalidateOnRefresh:true
          }
        })
        /* fromTo (y no from): con invalidateOnRefresh, un .from() vuelve a leer la
           posición actual —ya desplazada— como destino y las tarjetas quedan
           trabadas superpuestas. Con fromTo el inicio y el final son explícitos. */
        .fromTo(slots[0], {x:()=> gap()/2, rotate:-5, scale:.9},
                          {x:0, rotate:0, scale:1, ease:'power2.out'}, 0)
        .fromTo(slots[1], {x:()=>-gap()/2, rotate: 5, scale:.9},
                          {x:0, rotate:0, scale:1, ease:'power2.out'}, 0);
      })();

      /* Las fotos, los videos y los mapas terminan de cargar DESPUÉS del load y
         alargan la página: sin recalcular, todos los ScrollTrigger quedan corridos
         y disparan en el lugar equivocado. */
      const refresh = ()=>ScrollTrigger.refresh();
      document.querySelectorAll('img').forEach(img=>{
        if(!img.complete) img.addEventListener('load', refresh, {once:true});
      });
      setTimeout(refresh, 600);
      setTimeout(refresh, 2000);
    })();



    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
    };
  }, []);

  return null;
}
