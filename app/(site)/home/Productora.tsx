"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { CONTACT, FIC, MAGAZINE, PARTNERS, TERRITORIO } from "../data/home";
import { useReducedMotion } from "../lib/device";

/* ═══════════════════════════════════════════════════════════════
   LA PRODUCTORA
   Qué la respalda: FIC, partners, revista y el próximo territorio.
   (El manifiesto y los números están en "Conocé a Darksideuy", arriba.)
   ═══════════════════════════════════════════════════════════════ */

export default function Productora() {
  return (
    <section id="productora" className="relative px-5 pt-24 md:px-10 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">La productora</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">Respaldo</h2>

        {/* Respaldo */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-ds-ink p-6 md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <Image src={FIC.logo} alt="FIC — Fondo de Incentivo Cultural" width={160} height={60} className="h-10 w-auto" />
              <span className="rounded-full border border-ds-red/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ds-red-soft">
                Seleccionado {FIC.year}
              </span>
            </div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{FIC.org}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{FIC.text}</p>
          </article>

          <article className="flex flex-col justify-between rounded-3xl border border-white/10 bg-ds-ink p-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Revista cultural</p>
              <p className="mt-2 font-display text-6xl font-bold leading-none">
                {MAGAZINE.edition}
                <span className="ml-2 align-top font-mono text-[10px] uppercase tracking-[0.2em] text-ds-red-soft">Edición actual</span>
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">{MAGAZINE.text}</p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-ds-ink p-6 md:col-span-3">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-md">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Partners</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{PARTNERS.text}</p>
              </div>
              <ul className="grid grid-cols-3 items-center gap-6">
                {PARTNERS.items.map((p) => (
                  <li key={p.title} className="flex flex-col items-center gap-2 text-center">
                    <Image src={p.logo} alt={p.title} width={120} height={60} className="h-10 w-auto object-contain md:h-12" />
                    <span className="text-[10px] leading-tight text-white/45">{p.subtitle}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={CONTACT.emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-white/15 px-4 font-display text-xs font-bold uppercase tracking-[0.16em] md:hover:border-ds-red"
            >
              Quiero colaborar <ArrowUpRight size={15} />
            </a>
          </article>
        </div>

        <Territorio />
      </div>
    </section>
  );
}

/* Próximo territorio: los departamentos van pasando */
function Territorio() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const { departamentos } = TERRITORIO;

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % departamentos.length), 2200);
    return () => clearInterval(timer);
  }, [reducedMotion, departamentos.length]);

  return (
    <div className="mt-16 overflow-hidden rounded-3xl border border-white/10 p-6 md:p-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">Próximo territorio · Est. 2026</p>
      <p className="relative mt-3 h-[1.05em] font-display text-[clamp(2.6rem,12vw,7rem)] font-bold uppercase leading-none" aria-live="off">
        {departamentos.map((d, i) => (
          <span
            key={d}
            className={`absolute left-0 top-0 transition-all duration-500 motion-reduce:transition-none ${
              i === index ? "translate-y-0 opacity-100" : i < index ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
            }`}
          >
            {d}
          </span>
        ))}
      </p>
      <p className="mt-6 max-w-lg text-sm text-white/65">{TERRITORIO.text}</p>
    </div>
  );
}
