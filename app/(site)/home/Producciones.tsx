"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";

import { FORMATS, PRODUCTIONS } from "../data/home";

/* ═══════════════════════════════════════════════════════════════
   PRODUCCIONES Y FORMATOS VISUALES
   Cada producción es un caso: al tocarlo se expande y muestra los
   visualizers y los links. Los formatos, en lista con su miniatura.
   ═══════════════════════════════════════════════════════════════ */

export default function Producciones() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="producciones" className="relative px-5 pt-24 md:px-10 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">
          Producciones / Dirección creativa / Sistema aplicado
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">Producciones</h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {PRODUCTIONS.map((p) => {
            const expanded = open === p.id;
            return (
              <motion.article
                key={p.id}
                layout
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`overflow-hidden rounded-3xl border bg-ds-ink ${expanded ? "border-ds-red/50 md:col-span-2" : "border-white/10"}`}
              >
                <button
                  onClick={() => setOpen(expanded ? null : p.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-4 p-3 text-left md:p-4"
                >
                  <motion.span layout className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl md:w-32">
                    <Image src={p.cover} alt={`${p.title} — ${p.artist}`} fill sizes="128px" className="object-cover" />
                  </motion.span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{p.artist}</span>
                    <span className="mt-1 block font-display text-xl font-bold uppercase leading-tight md:text-2xl">{p.title}</span>
                    <span className="mt-1 block text-sm text-white/55">{p.text}</span>
                  </span>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 transition-transform duration-300 ${expanded ? "rotate-45 bg-ds-red text-white" : ""}`}
                  >
                    <Plus size={18} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 md:grid md:grid-cols-4 md:overflow-visible md:px-4 lg:grid-cols-5">
                        {p.gallery.map((src, i) => (
                          <span key={src} className="relative aspect-video w-[78%] shrink-0 snap-start overflow-hidden rounded-xl md:w-auto">
                            <Image src={src} alt={`${p.title} · visual ${i + 1}`} fill sizes="(max-width: 768px) 78vw, 20vw" className="object-cover" />
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 md:p-4">
                        {p.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-[44px] items-center gap-1 rounded-xl bg-ds-red text-white px-4 font-display text-xs font-bold uppercase tracking-[0.16em]"
                          >
                            {link.label} <ArrowUpRight size={15} />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        {/* ── Formatos visuales ── */}
        <div className="mt-20 md:mt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{FORMATS.subtitle}</p>
          <h3 className="mt-3 font-display text-4xl font-bold uppercase md:text-5xl">Formatos visuales</h3>

          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {FORMATS.items.map((item) => {
              const content = (
                <>
                  <span className="relative block aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ds-ink">
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 md:group-hover:scale-105" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                        Próximamente
                      </span>
                    )}
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-3">
                    <span>
                      <span className="font-mono text-xs text-white/40">{item.id}</span>{" "}
                      <span className="font-display text-lg font-bold uppercase">{item.title}</span>
                    </span>
                    {item.url && <ArrowUpRight size={18} className="shrink-0 text-ds-red" />}
                  </span>
                </>
              );
              return (
                <li key={item.id}>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block">
                      {content}
                    </a>
                  ) : (
                    <div className="opacity-70">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <blockquote className="mt-14 border-l-2 border-ds-red pl-5 font-display text-2xl font-bold uppercase leading-tight text-white/85 md:text-4xl">
            “{FORMATS.quote.replace(/^"|"$/g, "")}”
          </blockquote>
        </div>
      </div>
    </section>
  );
}
