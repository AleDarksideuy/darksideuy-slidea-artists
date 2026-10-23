"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { LIGA_SKATERS } from "../data/home";

const GALLERY = LIGA_SKATERS.gallery;
const PHOTOS = GALLERY.photos;
const TOTAL = PHOTOS.length;
const pad = (n: number) => String(n).padStart(2, "0");
/* Con la foto en grande, la página de atrás no se mueve */
const lockScroll = (on: boolean) => document.documentElement.classList.toggle("overflow-hidden", on);

/* Un deslizamiento (dedo, mouse o trackpad de costado) pasa de foto desde estos píxeles */
const SWIPE_PX = 40;

/* ═══════════════════════════════════════════════════════════════
   EL ROLLO DE LA FECHA 1
   Un carrusel en 3D: la foto del centro de frente y a color, las de
   los costados giradas y en sombra, y detrás "FECHA 1 · 19·09" gigante
   que corre al revés. Se pasa con las flechas, deslizando, con las
   teclas o tocando una foto de costado (o una rayita de la barra).
   Tocar la del centro la abre en grande. La página baja normal.
   ═══════════════════════════════════════════════════════════════ */

export default function LigaGallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const lastWheel = useRef(0);
  const swipeX = useRef<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [index, setIndex] = useState(0);

  const go = (i: number) => setCurrent(Math.min(TOTAL - 1, Math.max(0, i)));
  const open = (i: number) => {
    setIndex(i);
    lockScroll(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = (dir: number) => setIndex((i) => (i + dir + TOTAL) % TOTAL);

  if (TOTAL === 0) return null;
  const photo = PHOTOS[index];

  return (
    <div
      className="relative mx-auto mt-14 max-w-[100rem] md:mt-20"
      onKeyDown={(e) => {
        if (dialog.current?.open) return;
        if (e.key === "ArrowRight") go(current + 1);
        if (e.key === "ArrowLeft") go(current - 1);
      }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{GALLERY.kicker}</p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight md:text-4xl">{GALLERY.title}</h3>
      </div>

      {/* ── El escenario: se desliza de costado, la página sigue bajando normal ── */}
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label={GALLERY.title}
        className="relative mt-4 h-[min(64svh,120vw)] touch-pan-y select-none overflow-hidden [--w:min(42svh,74vw)] md:mt-6 md:h-[min(72svh,46rem)] md:[--w:min(48svh,30rem)]"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.moved || Math.abs(e.clientX - d.x) < SWIPE_PX) return;
          d.moved = true;
          go(current + (e.clientX < d.x ? 1 : -1));
        }}
        onPointerUp={() => {
          /* el click que sigue a un deslizamiento no abre la foto */
          setTimeout(() => (drag.current = null));
        }}
        onPointerCancel={() => (drag.current = null)}
        onWheel={(e) => {
          if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20) return;
          const now = performance.now();
          if (now - lastWheel.current < 350) return;
          lastWheel.current = now;
          go(current + (e.deltaX > 0 ? 1 : -1));
        }}
      >
        {/* Detrás: la fecha gigante, que corre al revés que las fotos */}
        <p
          aria-hidden
          style={{ transform: `translate3d(${-current * 7}vw, -50%, 0)` }}
          className="pointer-events-none absolute left-[6vw] top-1/2 select-none whitespace-nowrap font-display text-[clamp(7rem,30vw,26rem)] font-bold uppercase leading-none text-transparent transition-transform duration-500 ease-out [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] motion-reduce:transition-none"
        >
          Fecha 1 <span className="[-webkit-text-stroke:1px_rgba(229,9,20,0.55)]">{GALLERY.day}</span> {GALLERY.place}
        </p>

        <ul className="absolute inset-0 flex items-center justify-center [perspective:1400px] [transform-style:preserve-3d]">
          {PHOTOS.map((p, i) => {
            const d = i - current;
            const away = Math.min(Math.abs(d), 3);
            const centered = d === 0;
            return (
              <li
                key={p.src}
                aria-hidden={Math.abs(d) > 2}
                style={
                  {
                    transform: `translate3d(calc(var(--w) * ${d * 0.72}), ${away * away * 6}px, ${-away * 160}px) rotateY(${Math.max(-1, Math.min(1, d)) * -38}deg) rotateZ(${d * 1.5}deg)`,
                    zIndex: 100 - away * 10,
                  } as CSSProperties
                }
                className="absolute aspect-[4/5] w-[var(--w)] transition-transform duration-[450ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
              >
                <button
                  type="button"
                  tabIndex={Math.abs(d) > 1 ? -1 : 0}
                  onClick={() => {
                    if (drag.current?.moved) return;
                    if (centered) open(i);
                    else go(i);
                  }}
                  aria-label={centered ? `Ver en grande la foto ${i + 1} de ${TOTAL}` : `Ir a la foto ${i + 1} de ${TOTAL}`}
                  className="group relative block h-full w-full overflow-hidden bg-ds-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-ds-red"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    draggable={false}
                    sizes="(max-width: 768px) 74vw, 30rem"
                    className="h-full w-full object-cover transition-[scale] duration-300 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden
                    style={{ opacity: Math.min(0.8, away * 0.55) }}
                    className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-[450ms]"
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 ring-inset ring-ds-red transition-[box-shadow] duration-300 ${centered ? "ring-2" : "ring-0"}`}
                  />
                  <span className="absolute left-0 top-0 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                    F1 · <span className="text-ds-red-soft">{pad(i + 1)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Controles: contador, flechas y una rayita por foto ── */}
      <div className="mx-auto mt-4 flex max-w-6xl items-center gap-4 px-5 md:mt-6 md:gap-6 md:px-10">
        <span aria-live="polite" className="shrink-0 font-display text-4xl font-bold leading-none md:text-6xl">
          <span className="text-ds-red">{pad(current + 1)}</span>
          <span className="text-xl text-white/35 md:text-3xl"> / {pad(TOTAL)}</span>
        </span>
        <div className="flex flex-1 gap-1.5">
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              aria-current={i === current}
              className="group flex h-8 flex-1 items-center"
            >
              <span className={`block h-0.5 w-full transition-colors duration-300 ${i <= current ? "bg-ds-red" : "bg-white/20 group-hover:bg-white/45"}`} />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            aria-label="Foto anterior"
            className="grid size-11 place-items-center border border-white/25 font-mono text-lg transition-colors hover:border-ds-red hover:bg-ds-red disabled:pointer-events-none disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === TOTAL - 1}
            aria-label="Foto siguiente"
            className="grid size-11 place-items-center border border-white/25 font-mono text-lg transition-colors hover:border-ds-red hover:bg-ds-red disabled:pointer-events-none disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-6xl px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 md:px-10">
        Deslizá o usá las flechas · Tocá la del centro para verla grande
      </p>

      {/* ── Foto en grande ── */}
      <dialog
        ref={dialog}
        aria-label={GALLERY.title}
        onClose={() => {
          lockScroll(false);
          go(index);
        }}
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
    </div>
  );
}
