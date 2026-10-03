import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { CONTACT } from "../data/home";

/* ═══════════════════════════════════════════════════════════════
   CONTACTO + PIE
   Dos caminos (sponsors e instituciones / artistas) y los accesos
   directos para escribir.
   ═══════════════════════════════════════════════════════════════ */

export default function Contacto() {
  return (
    <>
      <section id="contacto" className="relative px-5 pt-24 md:px-10 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">Contacto</p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">Hablemos</h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { title: "Para sponsors e instituciones", text: CONTACT.sponsors },
              { title: "Para artistas", text: CONTACT.artists },
            ].map((block) => (
              <article key={block.title} className="rounded-3xl border border-white/10 bg-ds-ink p-6">
                <p className="font-display text-lg font-bold uppercase">{block.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/65">{block.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={CONTACT.emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl bg-ds-red px-6 font-display text-sm font-bold uppercase tracking-[0.14em] active:scale-[0.98] sm:flex-none md:hover:brightness-110"
            >
              <Mail size={17} /> {CONTACT.email}
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 font-display text-sm font-bold uppercase tracking-[0.14em] active:scale-[0.98] sm:flex-none md:hover:border-ds-red"
            >
              <FaInstagram size={18} /> @darkside.uy
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-24 border-t border-white/10 px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Image src="/Darksideuy.png" alt="Darkside UY" width={1817} height={394} className="h-6 w-auto" />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Productora cultural independiente — Mercedes, Uruguay — 2026
            </p>
          </div>
          <nav aria-label="Pie" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-white/60 sm:flex sm:gap-6">
            <a href="#artists" className="md:hover:text-white">Artistas</a>
            <a href="#darkside-pick" className="md:hover:text-white">Música</a>
            <a href="#llamado-artistas" className="md:hover:text-white">Llamado</a>
            <a href="#underfest" className="md:hover:text-white">Underfest</a>
            <a href="#producciones" className="md:hover:text-white">Producciones</a>
            <Link href="/tu-semana-como-artista" className="inline-flex items-center gap-1 text-ds-red-soft md:hover:text-white">
              Tu semana <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
