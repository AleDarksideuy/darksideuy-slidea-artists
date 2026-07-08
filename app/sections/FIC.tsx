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

export default function FIC() {
  return (
    <section className="relative h-screen w-full text-white flex items-center justify-center px-4 md:px-6">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-center text-center md:text-left">

        {/* IZQUIERDA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center md:justify-start"
        >
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center">

            <div className="absolute inset-0 rounded-full border border-white/20" />
            <div className="absolute inset-4 md:inset-6 rounded-full border-2 border-white/60" />

            <div className="relative text-center">
              <span className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-7xl font-bold`}>
                2026
              </span>
              <p className="text-[10px] sm:text-xs md:text-sm tracking-widest mt-2 md:mt-3 text-gray-400 uppercase">
                Seleccionado
              </p>
            </div>

          </div>
        </motion.div>

        {/* CENTRO */}
        <div>

          {/* LOGO FIC */}
          <motion.div
            className="flex items-center justify-center md:justify-start mb-6 md:mb-8 w-full"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
          >
            <div className="relative w-40 h-20 sm:w-52 sm:h-24 md:w-72 md:h-32 mx-auto md:mx-0">
              <Image
                src="/logos/fic.png"
                alt="FIC"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* SUBTITULO */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] text-gray-400 uppercase mb-4 md:mb-6"
          >
            Ministerio de Educación y Cultura
          </motion.p>

          {/* TEXTO */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-sm md:max-w-lg mx-auto md:mx-0"
          >
           El Fondo de Incentivo Cultural (FIC) del Ministerio de Educación y Cultura (MEC) de Uruguay es un mecanismo de financiamiento que permite la captación de recursos privados para proyectos artístico-culturales declarados de fomento.
            <br /><br />
            En este marco, Darkside fue seleccionado como proyecto cultural sostenible, validando su impacto en el desarrollo artístico, la generación de audiencias y la construcción de un ecosistema cultural en el territorio.
          </motion.p>

        </div>

        {/* DERECHA */}
        <div className="flex flex-col items-center md:items-end gap-6 md:gap-12">

          {/* LINEA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="w-full h-[1px] bg-white/30"
          />

        

        </div>

      </div>
    </section>
  );
}