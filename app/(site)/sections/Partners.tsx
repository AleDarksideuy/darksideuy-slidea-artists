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

export default function Partners() {
  return (
    <section className="relative min-h-screen w-full text-white flex items-center justify-center px-4 md:px-6 py-20">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-6xl w-full">

        {/* TITULO */}
        <motion.h2
          className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[90px] font-bold text-center mb-12 md:mb-20 leading-none`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          NUESTROS <br /> COLABORADORES
        </motion.h2>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mb-12 md:mb-16">

          {[
            {
              title: "SORIANO FÉRTIL",
              subtitle: "Intendencia de Soriano",
              logo: "/logos/soriano-fertil.png",
            },
            {
              title: "INJU",
              subtitle: "Instituto Nacional de la Juventud",
              logo: "/logos/INJU BLANCO SIN FONDO.png",
            },
            {
              title: "ABITAB",
              subtitle: "Red de Cobranza de Uruguay",
              logo: "/logos/abitab (2).png",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="border border-white/30 p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-white/60 transition-all duration-300"
            >
              {/* LOGO */}
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src={item.logo}
                  alt={item.title}
                  fill
                  className="object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>

              <h3 className={`${spaceGrotesk.className} text-sm md:text-base font-bold tracking-wide`}>
                {item.title}
              </h3>

              <p className="text-[10px] md:text-xs text-gray-500">
                {item.subtitle}
              </p>
            </motion.div>
          ))}

        </div>

        {/* CTA + TEXTO */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-10">

          {/* BOTON */}
          <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=productora@darksideuy.com"
  className="w-full md:w-auto border-2 border-white/60 px-8 md:px-10 py-4 md:py-5 text-xs md:text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-white hover:text-black transition-all duration-300 text-center block"
>
  Quiero colaborar
</a>

          {/* TEXTO */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={4}
            className="text-xs md:text-sm text-gray-400 max-w-md md:max-w-lg text-center md:text-left leading-relaxed"
          >
             Darkside articula con instituciones públicas y privadas para desarrollar proyectos culturales con impacto real en el territorio. 
            
            Nuestros colaboradores forman parte activa de un ecosistema que impulsa el crecimiento artístico, la generación de audiencias y la profesionalización de la escena local.
          </motion.p>

        </div>

      </div>
    </section>
  );
}