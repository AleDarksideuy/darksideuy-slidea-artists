"use client";

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

export default function Contact() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between px-4 md:px-10 text-white">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        className="relative z-10 max-w-7xl w-full mx-auto pt-20 md:pt-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >

        {/* TITULO */}
        <h2
          className={`${spaceGrotesk.className} text-5xl sm:text-6xl md:text-[100px] font-bold leading-none mb-12 md:mb-20 text-center`}
        >
          TRABAJEMOS
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 text-center md:text-left">

          {/* COL 1 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={1}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">
              Para sponsors e instituciones:
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              El proyecto tiene track record, FIC ganado y metodología documentada.
              Si tu organización quiere estar donde la cultura ocurre antes de que
              sea mainstream, hablemos.
            </p>
          </motion.div>

          {/* COL 2 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={2}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">
              Para artistas:
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Desarrollamos proyectos integrales. Producción audiovisual,
              desarrollo de carrera, sello. No buscamos servicios. Buscamos
              colaboraciones reales.
            </p>
          </motion.div>

          
        </div>

        {/* CONTACTO CENTRAL */}
        <motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="show"
  custom={4}
  viewport={{ once: true }}
  className="mt-16 md:mt-24 flex flex-col items-center text-center"
>

  {/* EMAIL */}
  <a
   href="https://mail.google.com/mail/?view=cm&fs=1&to=productora@darksideuy.com"
   target="_blank"
   className="relative text-2xl md:text-3xl font-semibold tracking-wide group"
  >
    productora@darksideuy.com

    {/* underline animado */}
    <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:left-0" />
  </a>

  <div className="w-40 h-[1px] bg-white/40 my-4" />

  {/* INSTAGRAM */}
  <a
    href="https://www.instagram.com/darkside.uy"
    target="_blank"
    className="relative text-lg text-gray-300 group"
  >
    @darksideuy

    {/* underline animado */}
    <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:left-0" />
  </a>

</motion.div>

      </motion.div>

      {/* FOOTER */}
      <div className="relative z-10 w-full border-t border-white/20 mt-16 md:mt-24 py-6 text-[10px] md:text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">

        <span>DARKSIDE UY © 2026</span>

        <span>Mercedes — Uruguay</span>

        

      </div>

    </section>
  );
}