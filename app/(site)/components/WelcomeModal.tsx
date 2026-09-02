"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const SHOW_DELAY_MS = 3000;

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Punto de extensión: cuando se agregue "solo una vez por usuario",
    // chequear localStorage acá antes de programar el timer, y marcarlo
    // como visto en close().
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-[#dc2626]/30 bg-gradient-to-b from-[#141417] to-[#0a0a0b] p-7 md:p-9 text-center shadow-2xl"
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[11px] font-extrabold tracking-[0.2em] text-[#dc2626] uppercase mb-3">
              Para artistas nuevos
            </div>

            <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight mb-3">
              ¿Sabés en qué estado está tu carrera hoy?
            </h3>

            <p className="text-sm text-white/60 leading-relaxed mb-7">
              Siete días, tres tareas por día. Un diagnóstico real de lo que
              te falta para dar el próximo paso.
            </p>

            <Link
              href="/tu-semana-como-artista"
              onClick={close}
              className="inline-block w-full bg-[#dc2626] hover:bg-[#ef4444] text-white font-extrabold text-sm tracking-wide uppercase rounded-xl px-6 py-4 transition-colors"
            >
              Quiero verlo
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
