"use client";

import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const letter: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden text-white">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 md:px-6">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center items-center"
        >
          <Image
            src="/Darksideuy.png" 
            alt="Darkside"
            width={600}
            height={200}
            priority
            className="w-[220px] sm:w-[300px] md:w-[500px] h-auto"
          />
        </motion.div>

        {/* SUBTEXTO */}
        <motion.p
          className={`${spaceGrotesk.className} mt-4 md:mt-6 text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.35em] text-gray-400 uppercase max-w-xs sm:max-w-md md:max-w-none`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Productora cultural independiente — Mercedes, Uruguay — 2026
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 md:bottom-12"
        >
          <div className="w-[1px] h-12 md:h-16 bg-white/30 animate-pulse" />
        </motion.div>

      </div>
    </section>
  );
}