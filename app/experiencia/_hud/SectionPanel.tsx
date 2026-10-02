"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";
import type { ComponentType } from "react";

import type { SectionId } from "../_game/zones";

/* Las secciones originales de la landing, tal cual. Cada una se descarga
   recién cuando alguien la abre, así la carga inicial del juego no crece. */
const loading = () => (
  <p className="py-32 text-center font-mono text-xs tracking-[0.3em] text-white/40">CARGANDO…</p>
);

const SECTIONS: Record<SectionId, { title: string; Component: ComponentType }> = {
  underfest: {
    title: "Skatepark Underfest",
    Component: dynamic(() => import("../../(site)/sections/Underfest"), { loading }),
  },
  darksidePick: {
    title: "Darkside's Pick",
    Component: dynamic(() => import("../../(site)/discover/TheUnderground"), { loading }),
  },
  spotlight: {
    title: "Spotlight",
    Component: dynamic(() => import("../../(site)/discover/WeeklyTop"), { loading }),
  },
  playlists: {
    title: "Playlists",
    Component: dynamic(() => import("../../(site)/discover/Playlists"), { loading }),
  },
  llamado: {
    title: "Llamado de artistas",
    Component: dynamic(() => import("../../(site)/sections/CallToArtists"), { loading }),
  },
  fic: {
    title: "FIC",
    Component: dynamic(() => import("../../(site)/sections/FIC"), { loading }),
  },
  partners: {
    title: "Partners",
    Component: dynamic(() => import("../../(site)/sections/Partners"), { loading }),
  },
  magazine: {
    title: "Magazine",
    Component: dynamic(() => import("../../(site)/sections/Magazine"), { loading }),
  },
  production: {
    title: "Formatos visuales",
    Component: dynamic(() => import("../../(site)/sections/Production"), { loading }),
  },
  releases: {
    title: "Producciones",
    Component: dynamic(() => import("../../(site)/sections/Releases"), { loading }),
  },
  territorio: {
    title: "Próximo territorio",
    Component: dynamic(() => import("../../(site)/sections/NextTerritory"), { loading }),
  },
  contacto: {
    title: "Contacto",
    Component: dynamic(() => import("../../(site)/sections/Contact"), { loading }),
  },
};

/* Las secciones de música usan una grilla de 12 columnas pensada para
   ir dentro de Discover; acá les damos ese mismo contenedor. */
const GRID_SECTIONS: SectionId[] = ["darksidePick", "spotlight", "playlists"];

export default function SectionPanel({ section, onClose }: { section: SectionId; onClose: () => void }) {
  const { title, Component } = SECTIONS[section];

  return (
    /* Sin transform ni backdrop-filter en este contenedor: algunas secciones
       abren sus propios modales con position: fixed y tienen que verse bien */
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex flex-col bg-[#050505]">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 md:px-8">
        <p className="font-mono text-xs font-bold tracking-[0.3em]">
          <span className="text-[#E50914]">●</span> {title.toUpperCase()}
        </p>
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs tracking-widest hover:border-[#E50914]"
        >
          <X size={14} /> VOLVER AL MUNDO
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {GRID_SECTIONS.includes(section) ? (
          <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
              <Component />
            </div>
          </div>
        ) : (
          <Component />
        )}
      </div>
    </div>
  );
}
