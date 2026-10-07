import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { CONTACT, TU_SEMANA } from "../data/home";
import { TEASER } from "../data/proximamente";
import ContactForm from "./ContactForm";

/* ═══════════════════════════════════════════════════════════════
   CONTACTO + PIE
   Dos caminos (sponsors e instituciones / artistas) y el formulario
   que manda el mensaje directo al correo de la productora.
   ═══════════════════════════════════════════════════════════════ */

export default function Contacto() {
  return (
    <>
      <section id="contacto" className="relative px-5 pt-24 md:px-10 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">Contacto</p>
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

          <ContactForm />

          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[48px] items-center gap-2 text-sm text-white/60 md:hover:text-white"
          >
            <FaInstagram size={17} /> O escribinos por Instagram: @darkside.uy
          </a>
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
            {TU_SEMANA.launched ? (
              <Link href={TU_SEMANA.href} className="inline-flex items-center gap-1 text-ds-red-soft md:hover:text-white">
                Tu semana <ArrowUpRight size={14} />
              </Link>
            ) : (
              <a href={`#${TEASER.id}`} className="inline-flex items-center gap-1 text-ds-red-soft md:hover:text-white">
                Próximamente <Lock size={13} />
              </a>
            )}
          </nav>
        </div>
      </footer>
    </>
  );
}
