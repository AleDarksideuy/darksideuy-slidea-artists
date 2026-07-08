"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { motion, Variants } from "framer-motion";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Magazine() {
  return (
    <section className="relative min-h-screen w-full  text-white flex items-center justify-center px-4 md:px-6 py-20">

      

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-3xl w-full text-center">

        {/* TITULO */}
        <motion.h2
          className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[90px] font-bold leading-none mb-10`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          REVISTA CULTURAL
        </motion.h2>

        {/* NUMERO */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          className="mb-6"
        >
          <span className={`${spaceGrotesk.className} text-[80px] sm:text-[100px] md:text-[140px] font-bold`}>
            02
          </span>
        </motion.div>

        {/* SUB */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={2}
          className="text-[10px] md:text-xs tracking-[0.35em] text-gray-400 uppercase mb-10"
        >
          Edición actual
        </motion.p>

        {/* TEXTO */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={3}
          className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto"
        >
          Plataforma editorial que documenta y amplifica las voces culturales del interior profundo. 
          Cada edición es un corte transversal del ecosistema que estamos construyendo.
        </motion.p>

      </div>
    </section>
  );
}