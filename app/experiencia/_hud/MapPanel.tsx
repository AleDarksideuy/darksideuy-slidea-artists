"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { artists } from "../../(site)/data/artists";
import { ZONE_ORDER, zones, type ZoneId } from "../_game/zones";

type MapPanelProps = {
  currentZone: ZoneId;
  onTravel: (zone: ZoneId) => void;
  onArtist: (slug: string) => void;
  onClose: () => void;
};

/* Mapa: viajar a cualquier zona o artista sin caminar.
   También sirve como navegación accesible con teclado o lector de pantalla. */
export default function MapPanel({ currentZone, onTravel, onArtist, onClose }: MapPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-40 flex justify-end bg-black/60"
    >
      <motion.nav
        aria-label="Mapa"
        initial={{ x: 40 }}
        animate={{ x: 0 }}
        exit={{ x: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#0b0b0b] p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-sm font-bold tracking-[0.3em]">MAPA</p>
          <button onClick={onClose} aria-label="Cerrar mapa">
            <X size={20} />
          </button>
        </div>

        <div className="-mr-2 flex-1 overflow-y-auto overscroll-contain pr-2">
          <ul className="space-y-2">
            {ZONE_ORDER.map((id) => {
              const zone = zones[id];
              const here = id === currentZone;
              return (
                <li key={id}>
                  <button
                    onClick={() => onTravel(id)}
                    aria-current={here ? "location" : undefined}
                    className={`w-full rounded-xl border p-3 text-left transition hover:border-[#E50914]/60 hover:bg-white/5 ${
                      here ? "border-[#E50914]/60 bg-[#E50914]/10" : "border-white/5"
                    }`}
                  >
                    <span className="block font-mono text-[10px] tracking-[0.3em] text-[#E50914]">
                      {zone.kicker.toUpperCase()} {here && "· ESTÁS ACÁ"}
                    </span>
                    <span className="block font-bold">{zone.title}</span>
                    <span className="block text-xs text-white/50">{zone.description}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mb-3 mt-8 font-mono text-xs font-bold tracking-[0.3em] text-white/60">ARTISTAS</p>
          <ul className="space-y-2">
            {artists.map((artist) => (
              <li key={artist.slug}>
                <button
                  onClick={() => onArtist(artist.slug)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/5 p-2 text-left transition hover:border-[#E50914]/60 hover:bg-white/5"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image src={artist.avatar || artist.image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{artist.name}</span>
                    <span className="block text-xs text-white/50">
                      {artist.category} · {artist.city}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.nav>
    </motion.div>
  );
}
