"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

import type { Card, SectionId } from "../_game/zones";

type InfoCardProps = {
  card: Card;
  onClose: () => void;
  onOpenSection: (section: SectionId) => void;
};

/* Ficha compacta: abajo como hoja en el celular, a la derecha en desktop */
export default function InfoCard({ card, onClose, onOpenSection }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 md:items-center md:justify-end md:p-6"
    >
      <motion.article
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#0b0b0b] p-6 md:max-w-md md:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/80 hover:bg-[#E50914]"
        >
          <X size={16} />
        </button>

        {card.image && (
          <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <Image src={card.image} alt="" fill sizes="(max-width: 768px) 100vw, 448px" className="object-contain" />
          </div>
        )}

        <p className="pr-10 font-mono text-[10px] tracking-[0.3em] text-[#E50914]">{card.kicker.toUpperCase()}</p>
        <h2 className="mt-2 text-2xl font-black leading-tight">{card.title}</h2>

        {card.body?.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-sm leading-7 text-white/70">
            {paragraph}
          </p>
        ))}

        {(card.links?.length || card.section) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {card.links?.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1 rounded-full bg-[#E50914] px-4 py-2 text-sm font-bold hover:brightness-110"
                >
                  {link.label} <ArrowUpRight size={14} />
                </a>
              );
            })}
            {card.section && (
              <button
                onClick={() => onOpenSection(card.section!.id)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-[#E50914]"
              >
                {card.section.label}
              </button>
            )}
          </div>
        )}
      </motion.article>
    </motion.div>
  );
}
