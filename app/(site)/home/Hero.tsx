"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { MANIFESTO, SERVICES } from "../data/home";
import DStage from "./DStage";
import Metrics from "./Metrics";
import { requestPowerOn } from "./power";

/* ═══════════════════════════════════════════════════════════════
   APERTURA
   Quiénes somos en una línea, la D en 3D (tocarla prende la página),
   "Conocé a Darksideuy" (desplegable con el manifiesto y los números)
   y el llamado de artistas.
   ═══════════════════════════════════════════════════════════════ */

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Resplandor rojo detrás de la D */}
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

          {/* Accesos (en escritorio van acá; en celular, debajo de la D) */}
          <div className="mt-8 hidden gap-3 md:flex">
            <HeroLinks open={open} onToggle={() => setOpen((o) => !o)} />
          </div>
        </div>

        {/* La D */}
        <div className="order-2">
          <DStage />
        </div>

        <div className="order-3 flex flex-col gap-3 md:hidden">
          <HeroLinks open={open} onToggle={() => setOpen((o) => !o)} />
        </div>
      </div>

      {/* ── Conocé a Darksideuy: manifiesto y números ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="conoce-darksideuy"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="mx-auto max-w-6xl px-5 pb-14 md:px-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">Conocé a Darksideuy</p>
              <p className="mt-4 font-display text-[clamp(1.9rem,7.5vw,4.2rem)] font-bold uppercase leading-[0.95]">
                {MANIFESTO.lead}
              </p>
              <div className="mt-8 grid gap-6 text-[15px] leading-7 text-white/70 md:grid-cols-2 md:gap-12">
                {MANIFESTO.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-8 border-l-2 border-ds-red pl-5 font-display text-xl font-bold uppercase leading-snug md:text-2xl">
                {MANIFESTO.closing}
              </p>
              <Metrics className="mt-12" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lo que hacemos con cada artista, en una cinta */}
      <div aria-label="Servicios" className="relative border-y border-white/10 bg-black/40 py-3">
        {/* Dos mitades iguales que se desplazan; cada mitad repite la lista
            para ser más ancha que cualquier pantalla y que nunca quede un hueco */}
        <div className="flex w-max marquee">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {[...SERVICES, ...SERVICES, ...SERVICES].map((service, i) => (
                <li
                  key={`${service}-${i}`}
                  aria-hidden={i >= SERVICES.length || undefined}
                  className="flex items-center gap-6 px-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-white/70"
                >
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

function HeroLinks({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="conoce-darksideuy"
        className="flex min-h-[52px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-ds-red px-6 font-display text-sm font-bold uppercase tracking-[0.18em] shadow-[0_0_40px_rgba(229,9,20,0.35)] transition active:scale-[0.98] md:flex-none md:hover:brightness-110"
      >
        Conocé a Darksideuy
        <ChevronDown size={17} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <a
        href="#llamado-artistas"
        onClick={() => requestPowerOn("llamado-artistas")}
        className="flex min-h-[52px] flex-1 items-center justify-center whitespace-nowrap rounded-2xl border border-white/20 px-6 font-display text-sm font-bold uppercase tracking-[0.18em] transition active:scale-[0.98] md:flex-none md:hover:border-ds-red"
      >
        Sumate al llamado
      </a>
    </>
  );
}
