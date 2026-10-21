"use client";

import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { LIGA_SKATERS as LIGA } from "../data/home";
import { detectQuality, hasWebGL, useReducedMotion, type Quality } from "../lib/device";

/* La tabla en 3D se descarga aparte, solo en el navegador y cuando la sección se acerca */
const LigaBoard = dynamic(() => import("./LigaBoard"), { ssr: false });
/* Misma altura del piso que usa la tabla (LigaBoard.GROUND) */
const GROUND_PCT = "76%";

const noopSubscribe = () => () => {};

/* El día de hoy en Uruguay ("2026-10-31"), para marcar cada fecha como realizada o próxima */
const todayInUruguay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Montevideo" }).format(new Date());

type Status = "done" | "today" | "next" | "later" | "tbd";
const STATUS_LABEL: Record<Status, string> = {
  done: "Realizada",
  today: "Hoy",
  next: "Próxima",
  later: "Más adelante",
  tbd: "Fecha a confirmar",
};

/* Sin hoy (en el servidor), no se marca ninguna: así nunca queda una fecha vieja como próxima */
function statuses(today: string | null): (Status | null)[] {
  let nextGiven = false;
  return LIGA.dates.map(({ date }) => {
    if (!date) return "tbd";
    if (!today) return null;
    if (date < today) return "done";
    if (date === today) return "today";
    if (nextGiven) return "later";
    nextGiven = true;
    return "next";
  });
}

/* near: está por entrar (se carga el 3D) · visible: está en pantalla (se dibuja) */
function useNearAndVisible(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        nearObs.disconnect();
      },
      { rootMargin: "400px 0px" }
    );
    const visObs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [ref]);
  return { near, visible };
}

/* Si el 3D falla, queda la tabla plana */
class BoardBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* Tabla plana: sin WebGL, con movimiento reducido o mientras carga el 3D */
function FlatBoard() {
  return (
    <div aria-hidden className="relative flex aspect-[4/1] w-[min(84%,40rem)] items-center gap-[5%] rounded-full border border-white/10 bg-[#121212] px-[18%]">
      <Image src="/LOGO1.png" alt="" width={1080} height={1080} className="h-[70%] w-auto invert" />
      <Image src="/Darksideuy.png" alt="" width={1817} height={394} className="h-auto w-[62%]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKATERS DEL INTERIOR — LA LIGA
   Una tabla de skate en 3D con el logo de Darkside en la lija, que entra
   con un shove-it sobre la línea del piso, con "LIGA" gigante detrás.
   Abajo: por qué existe, quién puede correr, las tres fechas (con su estado calculado solo) y la tarjeta de la
   próxima fecha mientras no haya pasado.
   ═══════════════════════════════════════════════════════════════ */

export default function LigaSkaters() {
  const stage = useRef<HTMLDivElement>(null);
  const { near, visible } = useNearAndVisible(stage);
  const reducedMotion = useReducedMotion();
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const quality = useSyncExternalStore<Quality>(noopSubscribe, detectQuality, () => "low");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const use3D = webgl && !reducedMotion && !failed && near;
  const today = useSyncExternalStore<string | null>(noopSubscribe, todayInUruguay, () => null);
  const status = statuses(today);
  /* La tarjeta de la próxima fecha se va sola cuando el día ya pasó */
  const showNext = !today || LIGA.next.date >= today;

  return (
    <section id={LIGA.id} className="relative pt-24 md:pt-36">
      <header className="mx-auto max-w-6xl px-5 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{LIGA.kicker}</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">
          {LIGA.title[0]}
          <br />
          {LIGA.title[1]}
        </h2>
        <p className="mt-6 max-w-2xl text-base text-white/75 md:text-lg">
          <strong className="font-bold text-white">{LIGA.lead}</strong> {LIGA.text}
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{LIGA.where}</p>
      </header>

      {/* ── La pista: palabra gigante detrás, piso y tabla ── */}
      <div ref={stage} className="relative mt-6 h-[62svh] max-h-[34rem] min-h-[22rem] overflow-hidden md:mt-10 md:h-[34rem]">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[12%] select-none whitespace-nowrap text-center font-display text-[clamp(6rem,30vw,22rem)] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]"
        >
          {LIGA.backdrop}
        </p>
        {/* Línea del piso: la tabla flota encima, con su sombra */}
        <div aria-hidden style={{ top: GROUND_PCT }} className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {(!use3D || !ready) && (
          <div style={{ bottom: `calc(100% - ${GROUND_PCT})` }} className="absolute inset-x-0 flex h-[45%] items-center justify-center">
            <FlatBoard />
          </div>
        )}
        {use3D && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <BoardBoundary
              onError={() => {
                setFailed(true);
                setReady(false);
              }}
            >
              <LigaBoard visible={visible} quality={quality} onReady={() => setReady(true)} />
            </BoardBoundary>
          </div>
        )}

        {use3D && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            Arrastrá para girar · Tocá para un shove-it
          </p>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 md:mt-14 md:px-10">
        {/* ── Por qué existe · Quién puede correr ── */}
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-12">
          <blockquote className="border-l-2 border-ds-red pl-5">
            <p className="text-base text-white/75 md:text-lg">{LIGA.why}</p>
            <p className="mt-3 font-display text-xl font-bold uppercase leading-tight text-white md:text-2xl">{LIGA.whyStrong}</p>
          </blockquote>
          <div className="border border-white/10 border-t-ds-red bg-ds-ink p-5">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ds-red-soft">{LIGA.join.label}</span>
            <span className="mt-2 block font-display text-2xl font-bold uppercase leading-tight">{LIGA.join.title}</span>
            <p className="mt-3 text-sm text-white/60">{LIGA.join.text}</p>
          </div>
        </div>

        {/* ── Las tres fechas ── */}
        <h3 className="mt-14 font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft md:mt-20">Las fechas</h3>
        <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {LIGA.dates.map((d, i) => {
            const st = status[i];
            const live = st === "next" || st === "today";
            return (
              <li key={d.name} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 py-4 md:grid-cols-[8rem_1fr_auto] md:py-5">
                <span className={`font-display text-xl font-bold uppercase md:text-2xl ${st === "done" ? "text-white/45" : ""}`}>{d.name}</span>
                <span className={`text-sm md:text-base ${st === "done" ? "text-white/45" : "text-white/80"}`}>
                  {d.day}
                  {d.date && " de 2026"}
                  {d.tag && <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ds-red-soft">{d.tag}</span>}
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{d.place}</span>
                </span>
                {st && (
                  <span
                    className={`col-span-2 w-fit px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] md:col-span-1 ${
                      live ? "bg-ds-red text-white" : st === "done" ? "border border-white/15 text-white/50" : "border border-white/25 text-white/80"
                    }`}
                  >
                    {STATUS_LABEL[st]}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* ── La próxima fecha ── */}
        {showNext && (
          <article className="relative mt-8 overflow-hidden bg-ds-red p-6 text-white md:mt-10 md:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-display md:block text-[clamp(7rem,26vw,16rem)] font-bold leading-none text-black/15"
            >
              {Number(LIGA.next.date.slice(8))}
            </span>
            <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-white/85">{LIGA.next.kicker}</p>
            <h3 className="relative mt-3 max-w-xl font-display text-3xl font-bold uppercase leading-[0.95] md:text-5xl">{LIGA.next.title}</h3>
            <p className="relative mt-5 max-w-2xl text-base text-white/90 md:text-lg">{LIGA.next.text}</p>
          </article>
        )}

        {/* ── Galería de la Fecha 1 (aparece cuando haya fotos en data/home.ts) ── */}
        {LIGA.gallery.photos.length > 0 && (
          <div className="mt-14 md:mt-20">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{LIGA.gallery.title}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {LIGA.gallery.photos.map((photo) => (
                <li key={photo.src} className="relative aspect-[4/5] overflow-hidden bg-ds-ink">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
