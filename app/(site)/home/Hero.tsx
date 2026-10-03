import Image from "next/image";

import { SERVICES } from "../data/home";
import VinylStage from "./vinyl/VinylStage";

/* ═══════════════════════════════════════════════════════════════
   APERTURA
   Quiénes somos en una línea, el vinilo de Darkside's Pick (se toca
   y suena) y los dos caminos principales: artistas y llamado.
   ═══════════════════════════════════════════════════════════════ */

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Resplandor rojo detrás del disco */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ds-red/20 blur-[90px] md:left-[72%] md:top-1/2 md:h-[44rem] md:w-[44rem]"
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 content-center gap-5 px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] md:grid-cols-[1fr_1.05fr] md:items-center md:gap-10 md:px-10 md:pt-28">
        {/* Texto */}
        <div className="order-1 flex flex-col">
          <h1 className="sr-only">Darkside UY — Productora cultural independiente</h1>
          <Image
            src="/Darksideuy.png"
            alt=""
            width={1817}
            height={394}
            priority
            className="h-7 w-auto self-start md:h-10"
          />

          <p className="mt-5 font-display text-[clamp(2.2rem,10vw,5.6rem)] font-bold uppercase leading-[0.88] tracking-tight">
            Productora
            <br />
            cultural
            <br />
            <span className="text-ds-red">independiente</span>
          </p>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
            Mercedes, Uruguay — 2026
          </p>

          {/* Accesos directos (en escritorio van acá; en celular, debajo del disco) */}
          <div className="mt-8 hidden gap-3 md:flex">
            <HeroLinks />
          </div>
        </div>

        {/* El vinilo */}
        <div className="order-2">
          <VinylStage />
        </div>

        <div className="order-3 flex flex-col gap-3 md:hidden">
          <HeroLinks />
        </div>
      </div>

      {/* Lo que hacemos con cada artista, en una cinta */}
      <div aria-label="Servicios" className="relative border-y border-white/10 bg-black/40 py-3">
        <div className="flex w-max marquee">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {SERVICES.map((service) => (
                <li key={service} className="flex items-center gap-6 px-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                  {service}
                  <span className="h-1.5 w-1.5 rounded-full bg-ds-red" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroLinks() {
  return (
    <>
      <a
        href="#artists"
        className="flex min-h-[52px] flex-1 items-center justify-center whitespace-nowrap rounded-2xl bg-ds-red px-6 font-display text-sm font-bold uppercase tracking-[0.18em] shadow-[0_0_40px_rgba(229,9,20,0.35)] transition active:scale-[0.98] md:flex-none md:hover:brightness-110"
      >
        Conocé a los artistas
      </a>
      <a
        href="#llamado-artistas"
        className="flex min-h-[52px] flex-1 items-center justify-center whitespace-nowrap rounded-2xl border border-white/20 px-6 font-display text-sm font-bold uppercase tracking-[0.18em] transition active:scale-[0.98] md:flex-none md:hover:border-ds-red"
      >
        Sumate al llamado
      </a>
    </>
  );
}
