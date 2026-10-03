"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Share2, X } from "lucide-react";
import { FaSpotify } from "react-icons/fa";

import { shareLink } from "../lib/share";
import { useMusic } from "./MusicProvider";

/* Lo que está sonando: arriba de la barra del pulgar en celular,
   abajo a la derecha en escritorio. */
export default function MiniPlayer() {
  const { current, isPlaying, audio, toggle, close } = useMusic();
  const bar = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const [heroVisible, setHeroVisible] = useState(false);

  /* En la apertura ya está el control debajo del vinilo: ahí no se duplica */
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) {
      const frame = requestAnimationFrame(() => setHeroVisible(false));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  /* Progreso sin re-render: se escribe directo en la barra */
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const update = () => {
      if (bar.current && el.duration) bar.current.style.transform = `scaleX(${el.currentTime / el.duration})`;
    };
    el.addEventListener("timeupdate", update);
    return () => el.removeEventListener("timeupdate", update);
  }, [audio, current]);

  const share = async () => {
    if (!current) return;
    const result = await shareLink({
      title: `${current.title} — ${current.artist}`,
      text: "Escuchalo en Darkside's Pick",
      path: `/?tema=${current.id}#darkside-pick`,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <AnimatePresence>
      {current && !heroVisible && (
        <motion.div
          role="region"
          aria-label="Reproductor"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 md:inset-x-auto md:bottom-6 md:right-6 md:w-[22rem]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ds-ink/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="flex items-center gap-3 p-2 pr-3">
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                <Image src={current.cover} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{current.title}</span>
                <span className="block truncate text-xs text-white/50">{current.artist}</span>
              </span>

              <button
                onClick={share}
                aria-label="Compartir tema"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 active:bg-white/10 md:hover:text-white"
              >
                {copied ? <span className="text-[10px] font-bold text-ds-red-soft">¡OK!</span> : <Share2 size={17} />}
              </button>
              {current.spotify && (
                <a
                  href={current.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir en Spotify"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 md:hover:text-[#1DB954]"
                >
                  <FaSpotify size={18} />
                </a>
              )}
              <button
                onClick={() => toggle()}
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ds-red active:scale-95"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={close} aria-label="Cerrar reproductor" className="flex h-10 w-8 items-center justify-center text-white/40">
                <X size={16} />
              </button>
            </div>
            <div className="h-0.5 w-full bg-white/10">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-ds-red" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
