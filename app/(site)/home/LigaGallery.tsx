"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { LIGA_SKATERS } from "../data/home";
import { useReducedMotion } from "../lib/device";

const GALLERY = LIGA_SKATERS.gallery;
const PHOTOS = GALLERY.photos;
const TOTAL = PHOTOS.length;
/* Cuánto hay que bajar por cada foto (en alto de pantalla) */
const PER_PHOTO_VH = 55;
const pad = (n: number) => String(n).padStart(2, "0");
/* Cada foto se queda un rato de frente: el paso a la siguiente ocurre en la mitad de cada tramo */
const dwell = (x: number) => {
  const i = Math.floor(x);
  const f = Math.min(1, Math.max(0, (x - i - 0.25) / 0.5));
  return i + f * f * (3 - 2 * f);
};
/* Con la foto en grande, la página de atrás no se mueve */
const lockScroll = (on: boolean) => document.documentElement.classList.toggle("overflow-hidden", on);

/* ═══════════════════════════════════════════════════════════════
   EL ROLLO DE LA FECHA 1
   Una pista que se recorre bajando: la pantalla se queda quieta y las
   fotos pasan de costado en 3D, la del centro de frente y a color, las
   de los costados giradas y en sombra. Detrás corre "FECHA 1 · 19·09"
   gigante en sentido contrario, y abajo el contador y la barra de la
   pista. Tocar la foto del centro la abre en grande; tocar otra la trae
   al centro. Con movimiento reducido es una tira simple.
   ═══════════════════════════════════════════════════════════════ */

export default function LigaGallery() {
  const reducedMotion = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const shades = useRef<(HTMLSpanElement | null)[]>([]);
  const backdrop = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const swipeX = useRef<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [index, setIndex] = useState(0);

  /* La pista: cada cuadro, según cuánto se bajó, ubica las fotos (con un poco de inercia) */
  useEffect(() => {
    const el = track.current;
    if (reducedMotion || !el) return;
    let frame = 0;
    let running = false;
    let smooth = -1;
    let shown = -1;

    const paint = () => {
      const rect = el.getBoundingClientRect();
      const length = rect.height - window.innerHeight;
      const target = dwell((length > 0 ? Math.min(1, Math.max(0, -rect.top / length)) : 0) * (TOTAL - 1));
      smooth = smooth < 0 ? target : smooth + (target - smooth) * 0.14;
      if (Math.abs(target - smooth) < 0.001) smooth = target;

      const width = cards.current[0]?.offsetWidth ?? 300;
      const gap = width * (window.innerWidth < 768 ? 0.8 : 0.72);
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = i - smooth;
        const away = Math.min(Math.abs(d), 3);
        card.style.transform = `translate3d(${d * gap}px, ${away * away * 6}px, ${-away * 160}px) rotateY(${Math.max(-1, Math.min(1, d)) * -38}deg) rotateZ(${d * 1.5}deg)`;
        card.style.zIndex = String(100 - Math.round(away * 10));
        const shade = shades.current[i];
        if (shade) shade.style.opacity = String(Math.min(0.8, away * 0.55));
      });
      if (backdrop.current) backdrop.current.style.transform = `translate3d(${-smooth * 7}vw, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${TOTAL > 1 ? smooth / (TOTAL - 1) : 1})`;

      const near = Math.round(smooth);
      if (near !== shown) {
        shown = near;
        setCurrent(near);
      }
      if (running) frame = requestAnimationFrame(paint);
    };

    /* Solo se mueve mientras la pista está en pantalla */
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      running = entry.isIntersecting;
      if (running) frame = requestAnimationFrame(paint);
    });
    observer.observe(el);
    frame = requestAnimationFrame(paint);
    return () => {
      observer.disconnect();
      running = false;
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const open = (i: number) => {
    setIndex(i);
    lockScroll(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = (dir: number) => setIndex((i) => (i + dir + TOTAL) % TOTAL);

  /* Tocar una foto de costado la trae al centro bajando hasta ella */
  const bringToCenter = (i: number) => {
    const el = track.current;
    if (!el || TOTAL < 2) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const length = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (TOTAL - 1)) * length, behavior: "smooth" });
  };

  if (TOTAL === 0) return null;
  const photo = PHOTOS[index];

  const lightbox = (
    <dialog
      ref={dialog}
      aria-label={GALLERY.title}
      onClose={() => lockScroll(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-[#050505] p-0 text-white backdrop:bg-black/90"
    >
      <div
        className="absolute inset-0 flex items-center justify-center px-4 pb-20 pt-16 md:px-24"
        onClick={close}
        onPointerDown={(e) => {
          swipeX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
      >
        <figure className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="lg-develop select-none object-contain"
            draggable={false}
          />
        </figure>
      </div>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 md:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">{GALLERY.title}</span>
        <button
          type="button"
          onClick={close}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white"
        >
          Cerrar ✕
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Foto anterior"
          className="border border-white/25 px-4 py-2 font-mono text-sm hover:border-ds-red hover:bg-ds-red"
        >
          ←
        </button>
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/70">
          <span className="text-ds-red-soft">{pad(index + 1)}</span> / {pad(TOTAL)}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Foto siguiente"
          className="border border-white/25 px-4 py-2 font-mono text-sm hover:border-ds-red hover:bg-ds-red"
        >
          →
        </button>
      </div>
    </dialog>
  );

  /* Movimiento reducido: una tira simple que se pasa de costado */
  if (reducedMotion) {
    return (
      <div className="mx-auto mt-14 max-w-6xl px-5 md:mt-20 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{GALLERY.kicker}</p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight md:text-4xl">{GALLERY.title}</h3>
        <ul className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
          {PHOTOS.map((p, i) => (
            <li key={p.src} className="w-[72%] shrink-0 snap-center md:w-[30%]">
              <button type="button" onClick={() => open(i)} aria-label={`Ver foto ${i + 1} de ${TOTAL}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-ds-ink">
                <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 768px) 72vw, 30vw" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
        {lightbox}
      </div>
    );
  }

  return (
    <div ref={track} style={{ height: `${(TOTAL - 1) * PER_PHOTO_VH + 100}svh` }} className="relative mt-10 md:mt-16">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Detrás: la fecha gigante, que corre al revés que las fotos */}
        <p
          ref={backdrop}
          aria-hidden
          className="pointer-events-none absolute left-[8vw] top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(7rem,30vw,26rem)] font-bold uppercase leading-none text-transparent will-change-transform [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]"
        >
          Fecha 1 <span className="[-webkit-text-stroke:1px_rgba(229,9,20,0.55)]">{GALLERY.day}</span> {GALLERY.place}
        </p>

        {/* Arriba: qué es */}
        <div className="absolute inset-x-0 top-0 z-[200] mx-auto max-w-6xl px-5 pt-16 md:px-10 md:pt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{GALLERY.kicker}</p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight md:text-4xl">{GALLERY.title}</h3>
        </div>

        {/* La pista de fotos */}
        <ul className="absolute inset-0 flex items-center justify-center [perspective:1400px] [transform-style:preserve-3d]">
          {PHOTOS.map((p, i) => (
            <li
              key={p.src}
              ref={(node) => {
                cards.current[i] = node;
              }}
              className="absolute aspect-[4/5] h-[min(56svh,90vw)] will-change-transform md:h-[min(60svh,46rem)]"
            >
              <button
                type="button"
                onClick={() => (i === current ? open(i) : bringToCenter(i))}
                aria-label={i === current ? `Ver en grande la foto ${i + 1} de ${TOTAL}` : `Ir a la foto ${i + 1} de ${TOTAL}`}
                className="group relative block h-full w-full overflow-hidden bg-ds-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-ds-red"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 768px) 72vw, 40vw"
                  className="h-full w-full object-cover transition-[scale] duration-500 group-hover:scale-[1.03]"
                />
                <span
                  ref={(node) => {
                    shades.current[i] = node;
                  }}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black opacity-0"
                />
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 ring-inset ring-ds-red transition-[box-shadow] duration-300 ${i === current ? "ring-2" : "ring-0"}`}
                />
                <span className="absolute left-0 top-0 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                  F1 · <span className="text-ds-red-soft">{pad(i + 1)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Abajo: el contador y la barra de la pista */}
        <div className="absolute inset-x-0 bottom-28 z-[200] mx-auto flex max-w-6xl items-end gap-5 px-5 md:bottom-10 md:px-10">
          <span aria-live="polite" className="font-display text-5xl font-bold leading-none md:text-7xl">
            <span className="text-ds-red">{pad(current + 1)}</span>
            <span className="text-2xl text-white/35 md:text-3xl"> / {pad(TOTAL)}</span>
          </span>
          <div className="mb-2 flex-1">
            <span className="block h-px w-full bg-white/15">
              <span ref={bar} style={{ transform: "scaleX(0)" }} className="block h-px w-full origin-left bg-ds-red" />
            </span>
            <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              Seguí bajando · Tocá la foto para verla grande
            </span>
          </div>
        </div>
      </div>
      {lightbox}
    </div>
  );
}
