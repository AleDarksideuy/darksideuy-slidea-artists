"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

import ArtistOverlay from "../artists/ArtistOverlay";
import { artists, type Artist } from "../data/artists";
import { useIsTouch, useReducedMotion } from "../components/linterna/device";
import { useFlashlight, type Light } from "../components/linterna/useFlashlight";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* Lo último que publicó (o lo próximo que viene) */
function latestRelease(artist: Artist) {
  const releases = artist.releases ?? [];
  const release = releases.find((r) => r.status === "Lanzado") ?? releases[0];
  if (!release) return null;
  return release.status === "Lanzado"
    ? `Último: ${release.title} · ${release.type}`
    : `${release.status}: ${release.title}`;
}

type Box = { x: number; y: number; w: number; h: number };

/* ═══════════════════════════════════════════════════════════════
   NUESTROS ARTISTAS — EN LA OSCURIDAD
   Los artistas están en penumbra. La linterna (cursor o dedo) los
   va encontrando: donde pega la luz aparece la foto a color, el
   nombre y su último lanzamiento. La tarjeta iluminada abre la ficha.
   ═══════════════════════════════════════════════════════════════ */

export default function Artists() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const wall = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const boxes = useRef<Box[]>([]);
  const litIndex = useRef(-1);
  const wasLit = useRef(false);

  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  /* ¿Qué tarjeta está bajo la luz? Se marca con data-lit (sin re-render) */
  const updateLit = useCallback((light: Light) => {
    const index = boxes.current.findIndex(
      (b) => light.x >= b.x && light.x <= b.x + b.w && light.y >= b.y && light.y <= b.y + b.h
    );
    if (index === litIndex.current) return;
    cards.current[litIndex.current]?.removeAttribute("data-lit");
    cards.current[index]?.setAttribute("data-lit", "");
    litIndex.current = index;
  }, []);

  const { light, moveTo } = useFlashlight(wall, {
    reducedMotion,
    start: [0.12, 0.25],
    onMove: updateLit,
  });

  /* Posición de cada tarjeta dentro del muro */
  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    const measure = () => {
      boxes.current = cards.current.map((card) =>
        card
          ? { x: card.offsetLeft, y: card.offsetTop, w: card.offsetWidth, h: card.offsetHeight }
          : { x: 0, y: 0, w: 0, h: 0 }
      );
      updateLit(light.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [light, updateLit]);

  const lightUp = (index: number) => {
    const b = boxes.current[index];
    if (b) moveTo(b.x + b.w / 2, b.y + b.h / 2, true);
  };

  return (
    <>
      <section id="artists" className="relative py-32 overflow-hidden">

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">

          <motion.h2
            className={`${spaceGrotesk.className} text-5xl md:text-7xl font-bold mb-4`}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
          >
            NUESTROS ARTISTAS
          </motion.h2>

          <p className="text-gray-400 max-w-xl">
            Conoce a los artistas que actualmente forman parte del ecosistema
            Darkside.
          </p>

          <p
            className={`${spaceGrotesk.className} mt-6 mb-12 text-[10px] uppercase tracking-[0.3em] text-[#E50914] motion-reduce:hidden`}
          >
            {isTouch ? "Tocá para encender la luz" : "Mové la luz para encontrarlos"}
          </p>

          {/* El muro en penumbra */}
          <div
            ref={wall}
            className="linterna-stage relative grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4 [--lr:170px] md:[--lr:250px]"
          >

            {artists.map((artist, index) => {
              const release = latestRelease(artist);

              return (
                <button
                  key={artist.slug}
                  ref={(el) => {
                    cards.current[index] = el;
                  }}
                  type="button"
                  aria-label={`Ver a ${artist.name}`}
                  onPointerDownCapture={() => {
                    wasLit.current = litIndex.current === index;
                  }}
                  onFocus={() => lightUp(index)}
                  onClick={(e) => {
                    /* En pantallas táctiles el primer toque enciende la luz;
                       el segundo (o el botón "Ver artista") abre la ficha */
                    const touched = e.detail > 0 && isTouch;
                    if (touched && !wasLit.current) return;
                    setSelectedArtist(artist);
                  }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-3xl text-left outline-none data-[lit]:z-20 focus-visible:z-20"
                >

                  <Image
                    src={artist.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover grayscale transition-[filter,transform] duration-700 group-data-[lit]:grayscale-0 group-data-[lit]:scale-105 group-focus-visible:grayscale-0 motion-reduce:group-hover:grayscale-0"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute inset-0 rounded-3xl border border-white/10 transition-all duration-500 group-data-[lit]:border-[#E50914] group-data-[lit]:shadow-[0_0_60px_rgba(229,9,20,.35)] group-focus-visible:border-[#E50914]" />

                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">

                    <p className="mb-1 text-[9px] uppercase tracking-[0.3em] text-gray-300 md:text-xs">
                      {artist.city} · {artist.country}
                    </p>

                    <h3 className={`${spaceGrotesk.className} text-xl font-bold leading-tight md:text-3xl`}>
                      {artist.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-300 md:text-sm">
                      {artist.category}
                    </p>

                    {/* Lo que revela la luz */}
                    <div className="mt-3 translate-y-2 opacity-0 transition-all duration-500 group-data-[lit]:translate-y-0 group-data-[lit]:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
                      {release && (
                        <p className="mb-3 hidden text-xs text-white/80 sm:block md:text-sm">
                          {release}
                        </p>
                      )}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArtist(artist);
                        }}
                        className="pointer-events-none inline-block rounded-xl bg-[#E50914] group-data-[lit]:pointer-events-auto motion-reduce:pointer-events-auto px-4 py-2 text-[10px] font-bold uppercase tracking-wider md:px-6 md:py-3 md:text-sm"
                      >
                        Ver artista
                      </span>
                    </div>

                  </div>

                </button>
              );
            })}

            {/* La oscuridad, con un agujero donde está la luz */}
            <div aria-hidden className="linterna-dark pointer-events-none absolute z-10" />

          </div>

        </div>

      </section>

      {/* ===========================
            OVERLAY DEL ARTISTA
      ============================ */}

      <ArtistOverlay
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />
    </>
  );
}
