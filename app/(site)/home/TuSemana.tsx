import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TU_SEMANA } from "../data/home";

/* ═══════════════════════════════════════════════════════════════
   TU SEMANA COMO ARTISTA (infoproducto)
   La semana a la vista: siete bloques, uno por día, y el paso a la
   página de venta.
   ═══════════════════════════════════════════════════════════════ */

export default function TuSemana() {
  return (
    <section id="tu-semana" className="relative pt-24 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="overflow-hidden rounded-3xl border border-ds-red/40 bg-gradient-to-br from-ds-red/20 via-ds-ink to-ds-ink">
          <div className="p-6 md:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{TU_SEMANA.kicker}</p>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(2rem,8vw,4rem)] font-bold uppercase leading-[0.95]">
              {TU_SEMANA.title}
            </h2>
            <p className="mt-4 max-w-lg text-sm text-white/70 md:text-base">{TU_SEMANA.text}</p>
          </div>

          {/* La semana: un bloque por día */}
          <ol className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-6 pb-2 md:grid md:grid-cols-7 md:px-12">
            {TU_SEMANA.blocks.map((block, i) => (
              <li
                key={block}
                className={`flex min-w-[8.5rem] shrink-0 snap-start flex-col justify-between rounded-2xl border p-4 md:min-w-0 ${
                  i === TU_SEMANA.blocks.length - 1 ? "border-ds-red/60 bg-ds-red/15" : "border-white/10 bg-black/30"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Día {i + 1}</span>
                <span className="mt-6 font-display text-sm font-bold uppercase leading-tight">{block}</span>
              </li>
            ))}
          </ol>

          <div className="p-6 md:px-12 md:pb-12">
            <Link
              href={TU_SEMANA.href}
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-ds-red px-8 font-display text-sm font-bold uppercase tracking-[0.18em] active:scale-[0.98] md:w-auto md:inline-flex md:hover:brightness-110"
            >
              Quiero verlo <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
