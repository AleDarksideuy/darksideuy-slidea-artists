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
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Underfest() {
  return (
    <section className="relative min-h-screen w-full  text-white flex items-center justify-center px-4 md:px-6 py-20">


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-6xl w-full">

        {/* TITULO */}
        <motion.h2
          className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[90px] font-bold leading-none mb-6`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          SKATEPARK <br /> UNDERFEST
          
        </motion.h2>

        {/* SUB */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          className="text-[10px] md:text-xs tracking-[0.3em] text-gray-400 uppercase mb-12"
        >
          Since 2023 <br/>
          Manzana 19 — Plaza de deportes
        </motion.p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {[
            {
              title: "SESIÓN DE SKATE",
              text: "Skaters del litoral. Unión que impulsa el deporte a través de sesiones no competitivas.",
            },
            {
              title: "FERIA DE EMPRENDEDORES",
              text: "Emprendedores locales. Economía circular dentro del evento.",
            },
            {
              title: "SHOW EN VIVO",
              text: "Artistas musicales en vivo. La plaza como escenario.",
            },
            {
              title: "EXPOSICIÓN DE ARTES VISUALES",
              text: "Artistas del departamento. Intervención del espacio público.",
            },
            {
              title: "CONCURSO DE OUTFITS",
              text: "Para la audiencia. La cultura como expresión individual.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="border border-white/30 p-6 md:p-8 flex flex-col justify-start min-h-[140px] md:min-h-[160px] backdrop-blur-[2px]"
            >
              <h3 className={`${spaceGrotesk.className} text-xs md:text-sm font-bold tracking-wide mb-3`}>
                {item.title}
              </h3>

              <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}