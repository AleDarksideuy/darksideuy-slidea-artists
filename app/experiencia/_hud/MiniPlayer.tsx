"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { FaSpotify, FaYoutube } from "react-icons/fa";

import type { Track } from "../../(site)/data/discover";

type MiniPlayerProps = {
  track: Track;
  isPlaying: boolean;
  onToggle: () => void;
  onStop: () => void;
};

/* Lo que está sonando en la zona de música */
export default function MiniPlayer({ track, isPlaying, onToggle, onStop }: MiniPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute right-4 top-28 z-20 flex w-[min(20rem,calc(100vw-2rem))] items-center gap-3 rounded-2xl border border-white/10 bg-black/80 p-2 pr-3 md:right-8 md:top-24"
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
        <Image src={track.cover} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{track.title}</span>
        <span className="block truncate text-xs text-white/50">{track.artist}</span>
      </span>
      {track.spotify && (
        <a href={track.spotify} target="_blank" rel="noopener noreferrer" aria-label="Escuchar en Spotify" className="text-white/60 hover:text-[#1DB954]">
          <FaSpotify size={18} />
        </a>
      )}
      {track.youtube && (
        <a href={track.youtube} target="_blank" rel="noopener noreferrer" aria-label="Ver en YouTube" className="text-white/60 hover:text-[#E50914]">
          <FaYoutube size={18} />
        </a>
      )}
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button onClick={onStop} aria-label="Cerrar reproductor" className="text-white/50 hover:text-white">
        <X size={16} />
      </button>
    </motion.div>
  );
}
