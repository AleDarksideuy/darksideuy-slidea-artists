"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { JUAN_MAIDANA as JM } from "../data/home";
import { useReducedMotion } from "../lib/device";

const COUNT_MS = 1600;
/* Instagram, TikTok y YouTube en la barra del reparto */
const SHARE_COLORS = ["bg-ds-red", "bg-white", "bg-white/35"];

/* Miles con punto, sin depender del idioma del navegador */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/* Avisa una sola vez cuando el bloque entra en pantalla */
function useInViewOnce<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ═══════════════════════════════════════════════════════════════
   JUAN MAIDANA — PRESENTACIÓN DE TV
   El lenguaje de los gráficos de una transmisión deportiva: apertura
   con el apellido gigante, barra inferior con el nombre, tablero de
   estadísticas y cinta de datos. Todo entra con el scroll (las
   animaciones están en globals.css, bajo .jm-in).
   ═══════════════════════════════════════════════════════════════ */

export default function JuanMaidana() {
  const reducedMotion = useReducedMotion();
  const [opening, openingIn] = useInViewOnce<HTMLDivElement>(0.35);
  const [board, boardIn] = useInViewOnce<HTMLDivElement>(0.15);
  const [progress, setProgress] = useState(0);

  /* El conteo corre una sola vez, cuando el tablero entra en pantalla */
  useEffect(() => {
    if (!boardIn) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [boardIn]);

  /* Sin animación: los valores finales desde el principio */
  const count = (value: number) => fmt(Math.round(value * (reducedMotion ? 1 : progress)));

  const ticker = [
    `${JM.event} · ${JM.place}`,
    `${fmt(JM.total)} ${JM.totalLabel}`,
    ...JM.stats.map((s) => `${fmt(s.value)} ${s.label}`),
    `+${fmt(JM.followers.value)} ${JM.followers.label} ${JM.followers.note}`,
  ];

  return (
    <section id={JM.id} className="relative pt-24 md:pt-36">
      <div className="mx-auto max-w-6xl md:grid md:grid-cols-[minmax(0,26rem)_1fr] md:items-start md:gap-12 md:px-10 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
        {/* ── Apertura ── */}
        <div
          ref={opening}
          data-in={openingIn}
          className="jm-in @container relative aspect-[3/4] max-h-[84svh] w-full overflow-hidden bg-black md:max-h-none md:border md:border-white/10"
        >
          {/* Cortes diagonales */}
          <div
            aria-hidden
            data-jm="right"
            className="absolute inset-y-0 right-0 w-[46%] bg-ds-red [clip-path:polygon(55%_0,100%_0,100%_100%,5%_100%)]"
          />
          <div
            aria-hidden
            data-jm="left"
            style={delay(80)}
            className="absolute inset-y-0 left-0 w-[40%] bg-ds-red [clip-path:polygon(40%_0,47%_0,7%_100%,0_100%)]"
          />

          {/* El apellido, gigante y comprimido, detrás */}
          <p
            aria-hidden
            data-jm="wipe"
            style={delay(120)}
            className="absolute left-1/2 top-[7%] -translate-x-1/2 scale-x-[0.68] whitespace-nowrap font-display text-[30cqw] font-bold uppercase leading-[0.8] text-white"
          >
            {JM.surname}
          </p>

          {/* Luz detrás de la cabeza */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[2%] aspect-square w-[78cqw] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.3),rgba(229,9,20,0.22)_38%,transparent_68%)]"
          />

          {/* El recorte, al frente, solapando las letras */}
          <div data-jm="rise" style={delay(200)} className="absolute left-1/2 top-[11%] w-[70cqw] -translate-x-1/2">
            <Image
              src={JM.photo}
              alt={JM.name}
              width={444}
              height={1300}
              sizes="(max-width: 768px) 70vw, 340px"
              className="h-auto w-full"
            />
          </div>

          {/* Barra inferior */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pb-5 pr-5 pt-16">
            <p
              data-jm="left"
              style={delay(420)}
              className="w-fit bg-white px-5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black md:text-[10px]"
            >
              El caso · {JM.event}
            </p>
            <h2
              data-jm="left"
              style={delay(300)}
              className="w-fit bg-ds-red py-2 pl-5 pr-10 font-display text-[clamp(1.9rem,10cqw,3rem)] font-bold uppercase leading-none text-white [clip-path:polygon(0_0,100%_0,calc(100%-1.25rem)_100%,0_100%)]"
            >
              {JM.name}
            </h2>
            <p
              data-jm="left"
              style={delay(380)}
              className="w-fit bg-ds-ink py-2 pl-5 pr-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85 md:text-[11px]"
            >
              {JM.role}
            </p>
          </div>
        </div>

        {/* ── Tablero de estadísticas ── */}
        <div ref={board} data-in={boardIn} className="jm-in px-5 pt-8 md:px-0 md:pt-0">
          <p data-jm="rise" className="max-w-xl text-base text-white/75 md:text-lg">
            {JM.text}
          </p>

          <div data-jm="rise" style={delay(80)} className="mt-8 border-t border-white/10 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">El caso</p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight md:text-3xl">{JM.event}</h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{JM.place}</p>
          </div>

          <p data-jm="rise" style={delay(140)} className="mt-6">
            <span className="sr-only">
              {fmt(JM.total)} {JM.totalLabel}
            </span>
            <span aria-hidden className="block font-display text-[clamp(3rem,17vw,6rem)] font-bold leading-[0.9] tabular-nums">
              {count(JM.total)}
            </span>
            <span aria-hidden className="mt-2 block font-display text-lg font-bold uppercase tracking-[0.12em] text-ds-red md:text-xl">
              {JM.totalLabel}
            </span>
          </p>

          {/* Reparto por plataforma, en proporción */}
          <div className="mt-6">
            <div data-jm="grow" style={delay(260)} aria-hidden className="flex h-3 gap-0.5 md:h-4">
              {JM.platforms.map((p, i) => (
                <span key={p.name} className={SHARE_COLORS[i]} style={{ width: `${(p.plays / JM.total) * 100}%` }} />
              ))}
            </div>
            <ul data-jm="rise" style={delay(320)} className="mt-3 grid grid-cols-3 gap-2">
              {JM.platforms.map((p, i) => (
                <li key={p.name}>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                    <span aria-hidden className={`h-2 w-2 shrink-0 ${SHARE_COLORS[i]}`} />
                    {p.name}
                  </span>
                  <span className="mt-1 block font-display text-base font-bold tabular-nums md:text-xl">{fmt(p.plays)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mosaicos de marcador */}
          <ul className="mt-8 grid grid-cols-2 gap-2 md:gap-3">
            {JM.stats.map((s, i) => (
              <li key={s.label} data-jm="rise" style={delay(380 + i * 60)} className="border border-white/10 border-t-ds-red bg-ds-ink p-4">
                <span className="sr-only">{fmt(s.value)}</span>
                <span aria-hidden className="block font-display text-5xl font-bold leading-none tabular-nums md:text-6xl">
                  {count(s.value)}
                </span>
                <span className="mt-2 block font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-white/85">{s.label}</span>
                <span className="mt-1 block text-xs text-white/50">{s.detail}</span>
              </li>
            ))}
            {/* Los seguidores, siempre con su aclaración al lado */}
            <li data-jm="rise" style={delay(620)} className="col-span-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-ds-red p-4 text-white">
              <span className="sr-only">+{fmt(JM.followers.value)}</span>
              <span aria-hidden className="font-display text-5xl font-bold leading-none tabular-nums md:text-6xl">
                +{count(JM.followers.value)}
              </span>
              <span className="font-mono text-[11px] uppercase leading-snug tracking-[0.14em]">
                {JM.followers.label} <strong className="font-bold">{JM.followers.note}</strong>
              </span>
            </li>
          </ul>

          <p
            data-jm="rise"
            style={delay(700)}
            className="mt-8 border-l-2 border-ds-red pl-5 font-display text-xl font-bold uppercase leading-tight text-white/85 md:text-2xl"
          >
            {JM.closing}
          </p>
        </div>
      </div>

      {/* ── Cinta de datos ── */}
      <div className="mt-10 overflow-hidden border-y border-white/10 bg-ds-ink md:mt-16">
        <div className="jm-ticker flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0">
              {ticker.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 whitespace-nowrap py-3 pl-4 font-display text-xs font-bold uppercase tracking-[0.16em] md:text-sm"
                >
                  <span aria-hidden className="h-2 w-2 rotate-45 bg-ds-red" />
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
