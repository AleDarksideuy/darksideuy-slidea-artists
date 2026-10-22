"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { LIGA_SKATERS } from "../data/home";

const GALLERY = LIGA_SKATERS.gallery;
const pad = (n: number) => String(n).padStart(2, "0");
/* Cómo caen las fotos al revelarse: cada una con su ángulo, como tiradas sobre la mesa */
const TOSS = ["-4deg", "3deg", "-2deg", "5deg", "-3deg", "2deg", "-5deg"];
/* Con la foto en grande, la página de atrás no se mueve */
const lockScroll = (on: boolean) => document.documentElement.classList.toggle("overflow-hidden", on);

/* ═══════════════════════════════════════════════════════════════
   EL ROLLO DE LA FECHA 1
   En celular es una tira de película que se pasa de costado; en
   computadora, un collage con la primera foto en grande. Al entrar
   en pantalla cada foto cae, salta el flash y se revela del blanco y
   negro al color. Tocar una foto la abre en grande (flechas, swipe y
   Esc para cerrar).
   ═══════════════════════════════════════════════════════════════ */

export default function LigaGallery() {
  const roll = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const swipeX = useRef<number | null>(null);
  const [shown, setShown] = useState(false);
  const [index, setIndex] = useState(0);
  const photos = GALLERY.photos;
  const total = photos.length;

  useEffect(() => {
    const el = roll.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const open = (i: number) => {
    setIndex(i);
    lockScroll(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = (dir: number) => setIndex((i) => (i + dir + total) % total);

  if (total === 0) return null;
  const photo = photos[index];

  return (
    <div ref={roll} data-in={shown} className="lg-roll mt-14 md:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{GALLERY.kicker}</p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight md:text-4xl">{GALLERY.title}</h3>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {pad(total)} fotos · Tocá una para verla grande
        </p>
      </div>

      <ul className="-mx-5 mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto bg-black px-5 py-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible md:bg-transparent md:p-0 [&::-webkit-scrollbar]:hidden">
        {photos.map((p, i) => (
          <li
            key={p.src}
            data-lg
            style={{ "--d": `${i * 110}ms`, "--r": TOSS[i % TOSS.length] } as CSSProperties}
            className={`lg-frame relative w-[76%] shrink-0 snap-center md:w-auto ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Ver foto ${i + 1} de ${total}: ${p.alt}`}
              className={`group relative block w-full overflow-hidden bg-ds-ink outline-none focus-visible:ring-2 focus-visible:ring-ds-red ${
                i === 0 ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={p.src}
                alt=""
                width={p.width}
                height={p.height}
                sizes={i === 0 ? "(max-width: 768px) 76vw, 50vw" : "(max-width: 768px) 76vw, 25vw"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span aria-hidden className="lg-flash pointer-events-none absolute inset-0 bg-white opacity-0" />
              <span aria-hidden className="pointer-events-none absolute inset-0 ring-0 ring-inset ring-ds-red transition-[box-shadow] duration-300 group-hover:ring-4" />
              <span className="absolute bottom-0 left-0 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                F1 · <span className="text-ds-red-soft">{pad(i + 1)}</span>
              </span>
            </button>
          </li>
        ))}

        {/* Cierre del rollo: la fecha en grande */}
        <li
          data-lg
          style={{ "--d": `${total * 110}ms`, "--r": "0deg" } as CSSProperties}
          className="lg-frame relative flex w-[76%] shrink-0 snap-center md:col-span-2 md:w-auto"
        >
          <div className="relative flex w-full flex-col justify-between overflow-hidden border border-white/10 border-t-ds-red bg-ds-ink p-5 max-md:aspect-[4/5] md:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ds-red-soft">Fin del rollo</span>
            <span
              aria-hidden
              className="select-none font-display text-[clamp(4.5rem,18vw,10rem)] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]"
            >
              {GALLERY.day}
            </span>
            <span className="font-display text-xl font-bold uppercase leading-tight md:text-2xl">
              Fecha 1
              <span className="block font-mono text-[10px] font-normal tracking-[0.2em] text-white/50">{GALLERY.place}</span>
            </span>
          </div>
        </li>
      </ul>

      {/* Foto en grande */}
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
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            F1 · <span className="text-ds-red-soft">{pad(index + 1)}</span> / {pad(total)}
          </span>
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
          <p className="line-clamp-2 text-center text-xs text-white/55 md:text-sm">{photo.alt}</p>
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
