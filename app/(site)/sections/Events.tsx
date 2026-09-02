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

export default function Events() {
  return (
    <section className="relative min-h-screen w-full text-white flex items-center justify-center px-4 md:px-6 py-20">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-6xl w-full">

        {/* TITULO */}
        <motion.h2
          className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[90px] font-bold text-center md:text-left leading-none mb-6`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          TEATRO 28 DE <br /> FEBRERO
        </motion.h2>

        {/* SUB */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          className="text-[10px] md:text-xs tracking-[0.3em] text-gray-400 uppercase mb-10 md:mb-12 text-center md:text-left"
        >
          Programación anual 2026
        </motion.p>

        {/* 🔥 GRID CONTENIDO (CLAVE) */}
        <div className="mx-auto w-full max-w-xs sm:max-w-md md:max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-white/30">

            {[
              {
                title: "DARKSIDE ARENA",
                subtitle: "Batallas de Freestyle",
                date: "08/05/2026",
                logo: "/logos/A.png",
              },
              {
                title: "DARKSIDE MUSICAL",
                subtitle: "Concurso de Talentos Musicales",
                date: "07/05/2026",
                logo: "/logos/M.png",
              },
              {
                title: "CICLO DE MÚSICA",
                subtitle: "Artistas del Litoral • Segmento de Música Experimental",
                date: "22/05/2026",
                logo: "/logos/C.png",
              },
            ].map((event, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="border-t md:border-t-0 md:border-l border-white/30 flex flex-col justify-between"
              >

                {/* CONTENIDO */}
                <div className="p-6 md:p-8 flex flex-col items-center text-center gap-4">

                  {/* LOGO */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
                    <Image
                      src={event.logo}
                      alt={event.title}
                      fill
                      className="object-contain opacity-80 hover:opacity-100 transition"
                    />
                  </div>

                  {/* TITULO */}
                  <h3 className={`${spaceGrotesk.className} text-sm md:text-base font-bold tracking-wide`}>
                    {event.title}
                  </h3>

                  {/* SUB */}
                  <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed max-w-xs">
                    {event.subtitle}
                  </p>

                </div>

                {/* FOOTER */}
                <div className="border-t border-white/30 px-6 md:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">
                  
                  <span className="hover:text-white cursor-pointer transition">
                    Ver más
                  </span>
                </div>

              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}