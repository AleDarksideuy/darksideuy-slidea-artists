"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { CONTACT, TU_SEMANA } from "../data/home";

/* ═══════════════════════════════════════════════════════════════
   TU SEMANA COMO ARTISTA — PRÓXIMAMENTE
   Mientras el producto no sale: los siete bloques de la semana
   sellados con candado. Tocar uno lo "espía" un instante (se abre el
   candado y se lee el nombre) y vuelve a sellarse.
   Se cambia por la sección normal con TU_SEMANA.launched = true.
   ═══════════════════════════════════════════════════════════════ */

const PEEK_MS = 1800;

export default function TuSemanaLocked() {
  const { teaser, blocks } = TU_SEMANA;
  const [peek, setPeek] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const spy = (i: number) => {
    clearTimeout(timer.current);
    setPeek(i);
    timer.current = setTimeout(() => setPeek(null), PEEK_MS);
  };

  return (
    <section id="tu-semana" className="relative pt-24 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-ds-ink to-ds-ink">
          <div className="p-6 md:p-12 md:pr-56">
            {/* Sello de "Próximamente": arriba del título en celular, en la esquina en escritorio */}
            <div
              aria-hidden
              className="pointer-events-none mb-5 inline-block rotate-[-4deg] rounded-xl border-2 border-ds-red px-3 py-1.5 font-display text-sm font-bold uppercase tracking-[0.25em] text-ds-red-soft shadow-[0_0_30px_rgba(229,9,20,0.25)] md:absolute md:right-10 md:top-10 md:mb-0 md:rotate-[8deg] md:text-lg"
            >
              Próximamente
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{teaser.kicker}</p>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(2rem,8vw,4rem)] font-bold uppercase leading-[0.95]">
              {teaser.title}
            </h2>
          </div>
          <p className="-mt-2 max-w-xl px-6 text-sm text-white/70 md:-mt-6 md:px-12 md:text-base">{teaser.text}</p>

          {/* La semana, sellada */}
          <p className="mt-8 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 md:px-12">{teaser.hint}</p>
          <ol className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto px-6 pb-2 md:grid md:grid-cols-7 md:px-12">
            {blocks.map((block, i) => {
              const open = peek === i;
              return (
                <li key={block} className="shrink-0 snap-start md:min-w-0">
                  <button
                    type="button"
                    onClick={() => spy(i)}
                    aria-label={open ? `Día ${i + 1}: ${block}` : `Día ${i + 1}, sellado. Tocá para espiar`}
                    className={`flex h-32 w-[8.5rem] flex-col justify-between rounded-2xl border p-4 text-left transition-colors duration-300 md:w-full ${
                      open ? "border-ds-red/70 bg-ds-red/15" : "border-white/10 bg-black/40 md:hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Día {i + 1}</span>
                      <span className={open ? "text-ds-red-soft" : "text-white/40 motion-safe:group-hover:animate-pulse"}>
                        {open ? <LockOpen size={15} /> : <Lock size={15} className={peek === null ? "" : "opacity-60"} />}
                      </span>
                    </span>
                    {/* el nombre: borroso hasta que se espía */}
                    <span
                      aria-hidden={!open}
                      className={`font-display text-sm font-bold uppercase leading-tight transition-[filter,opacity] duration-500 motion-reduce:transition-none ${
                        open ? "opacity-100 blur-0" : "select-none opacity-60 blur-[5px]"
                      }`}
                    >
                      {block}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p aria-live="polite" className="sr-only">
            {peek !== null ? `Adelanto del día ${peek + 1}: ${blocks[peek]}` : ""}
          </p>

          <div className="p-6 md:px-12 md:pb-12">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-8 font-display text-sm font-bold uppercase tracking-[0.16em] active:scale-[0.98] md:inline-flex md:w-auto md:hover:border-ds-red"
            >
              <FaInstagram size={18} /> {teaser.follow}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
