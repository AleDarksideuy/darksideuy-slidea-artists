"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { useMusic } from "./MusicProvider";
import Player from "./Player";

/* El reproductor a pantalla completa, como en las apps de música.
   Se abre tocando el mini reproductor; se cierra con la flecha o Esc. */
export default function PlayerSheet() {
  const { sheetOpen, setSheetOpen } = useMusic();

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen, setSheetOpen]);

  return (
    <AnimatePresence>
      {sheetOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Reproductor"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-black"
        >
          <div className="mx-auto max-w-xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="Cerrar reproductor"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 active:scale-95"
              >
                <ChevronDown size={22} />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Sonando ahora</p>
              <span className="w-11" />
            </div>
            <Player mode="sheet" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
