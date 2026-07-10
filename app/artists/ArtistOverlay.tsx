"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import ArtistHero from "./ArtistHero";

import type { Artist } from "../data/artists";

type ArtistOverlayProps = {
  artist: Artist | null;
  onClose?: () => void;
};

export default function ArtistOverlay({
  artist,
  onClose,
}: ArtistOverlayProps) {
  if (!artist) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => onClose?.()}
        className="
          fixed
          inset-0
          z-[9999]
          bg-black/90
          backdrop-blur-md
          flex
          items-center
          justify-center
          p-3
          md:p-6
        "
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            w-full
            max-w-[1500px]
            h-[94vh]
            rounded-[32px]
            overflow-hidden
            border
            border-white/10
            bg-[#0b0b0b]
            shadow-2xl
          "
        >
          <button
            onClick={() => onClose?.()}
            className="
              absolute
              top-5
              right-5
              z-50
              w-12
              h-12
              rounded-full
              bg-black/60
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-[#E50914]
              transition
            "
          >
            <X size={22} />
          </button>

          <div className="h-full overflow-y-auto">

            <ArtistHero artist={artist} />

           

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}