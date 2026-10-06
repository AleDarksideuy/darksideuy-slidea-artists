"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { CONTACT } from "../data/home";
import { TEASER } from "../data/proximamente";

/* ═══════════════════════════════════════════════════════════════
   PRÓXIMAMENTE — EL EXPEDIENTE CLASIFICADO
   Adelanto de un producto que todavía no se lanza. No dice qué es:
   solo renglones tachados, como un documento censurado. Tocarlos los
   hace destellar con "acceso restringido". Sin pistas en el código
   (solo usa TEASER, que no revela nada).
   ═══════════════════════════════════════════════════════════════ */

/* Renglones censurados: anchos distintos para que parezca texto real */
const LINES = ["94%", "81%", "88%", "57%", "90%", "72%", "38%"];
const DENIED_MS = 1300;

export default function Proximamente() {
  const [denied, setDenied] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const tryRead = (i: number) => {
    clearTimeout(timer.current);
    setDenied(i);
    timer.current = setTimeout(() => setDenied(null), DENIED_MS);
  };

  return (
    <section id={TEASER.id} className="relative pt-24 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-ds-ink to-ds-ink">
          <div className="grid gap-10 p-6 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-14 md:p-12">
            {/* Lo único que se dice */}
            <div>
              <div
                aria-hidden
                className="mb-6 inline-flex rotate-[-4deg] items-center gap-2 rounded-xl border-2 border-ds-red px-3 py-1.5 font-display text-sm font-bold uppercase tracking-[0.25em] text-ds-red-soft shadow-[0_0_30px_rgba(229,9,20,0.25)] md:text-base"
              >
                <Lock size={15} /> Próximamente
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{TEASER.kicker}</p>
              <h2 className="mt-3 font-display text-[clamp(2.4rem,10vw,5rem)] font-bold uppercase leading-[0.9]">{TEASER.title}</h2>
              <p className="mt-4 text-base text-white/65 md:text-lg">{TEASER.text}</p>

              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-8 font-display text-sm font-bold uppercase tracking-[0.16em] active:scale-[0.98] md:inline-flex md:w-auto md:hover:border-ds-red"
              >
                <FaInstagram size={18} /> {TEASER.follow}
              </a>
            </div>

            {/* El expediente: todo tachado */}
            <div
              aria-label="Contenido clasificado"
              className="relative rounded-2xl border border-white/10 bg-black/50 p-5 md:p-7"
            >
              <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                <span>Darkside UY · Expediente</span>
                <span className="text-ds-red-soft">Clasificado</span>
              </div>
              <ul className="space-y-3">
                {LINES.map((width, i) => {
                  const blocked = denied === i;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => tryRead(i)}
                        aria-label={blocked ? TEASER.denied : "Renglón censurado"}
                        className="group relative block h-5 w-full text-left"
                      >
                        <span
                          className={`absolute inset-y-0 left-0 rounded-[3px] transition-colors duration-200 ${
                            blocked ? "bg-ds-red motion-safe:animate-[redacted-glitch_0.3s_steps(2)_2]" : "bg-white/[0.12] md:group-hover:bg-white/20"
                          }`}
                          style={{ width }}
                        />
                        {blocked && (
                          <span className="absolute inset-y-0 left-2 flex items-center font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                            {TEASER.denied}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p aria-live="polite" className="sr-only">
                {denied !== null ? TEASER.denied : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
