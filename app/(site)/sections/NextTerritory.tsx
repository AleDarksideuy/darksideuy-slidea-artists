"use client";

import { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const departamentos = [
  "MALDONADO",
  "SORIANO",
  "RIO NEGRO",
  "PAYSANDÚ",
  "SALTO",
  "DURAZNO",
  "SAN JOSÉ",
  "COLONIA",
];

export default function NextTerritory() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(departamentos[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % departamentos.length;
      animateTextChange(displayText, departamentos[nextIndex]);
      setIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [index, displayText]);

  // 🔥 FIX REAL
  const animateTextChange = (from: string, to: string) => {
    const maxLength = Math.max(from.length, to.length);

    let step = 0;

    const interval = setInterval(() => {
      const result = [];

      for (let i = 0; i < maxLength; i++) {
        if (i <= step) {
          result[i] = to[i] || "";
        } else {
          result[i] = from[i] || "";
        }
      }

      setDisplayText(result.join(""));
      step++;

      if (step >= maxLength) clearInterval(interval);
    }, 60);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center px-4 md:px-10 text-white text-center md:text-left">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      <motion.div
        className="max-w-7xl w-full mx-auto"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
      >

        <p className="text-xs md:text-sm tracking-[0.3em] text-gray-400 uppercase mb-4">
          Próximo territorio:
        </p>

        <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-4 md:gap-10">
          <h1
            className={`${spaceGrotesk.className} text-[clamp(48px,10vw,220px)] font-bold leading-none tracking-tight whitespace-nowrap`}
          >
            {displayText}
          </h1>

          <div className="flex-1 h-[1px] bg-white/30 hidden md:block" />
        </div>

        <p className="mt-6 max-w-md mx-auto md:mx-0 text-xs md:text-sm text-gray-400 leading-relaxed">
          El experimento continúa. El sistema es transferible. La condición de
          extraño vuelve a activarse.
        </p>

        <p className="mt-4 text-[10px] tracking-[0.3em] text-gray-500 uppercase">
          Est. 2026
        </p>
      </motion.div>
    </section>
  );
}