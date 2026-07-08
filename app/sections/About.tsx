"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { useEffect, useState } from "react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Animación base
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

export default function About() {

  const [metrics, setMetrics] = useState([0, 0, 0]);

  useEffect(() => {
    const targets = [33, 10, 15];

    targets.forEach((target, index) => {
      let current = 0;

      const interval = setInterval(() => {
        current++;

        setMetrics((prev) => {
          const updated = [...prev];
          updated[index] = current;
          return updated;
        });

        if (current >= target) {
          clearInterval(interval);
        }
      }, 50);
    });
  }, []);

  return (
    <section className="relative h-screen w-full text-white flex items-center justify-center px-4 md:px-6">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl w-full mx-auto">

        {/* TITULO */}
        <motion.h2
          className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[100px] font-bold mb-8 md:mb-10 text-center overflow-hidden`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          EL LADO OSCURO
        </motion.h2>

        {/* TEXTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed text-center md:text-left">

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mx-auto md:mx-0 max-w-md"
          >
            Antes de que llegáramos, nadie lo concebía posible. Llegamos a una
            ciudad del interior profundo de Uruguay sin red, sin capital, sin
            historia ahí. Con tres personas y una convicción: que el vacío
            cultural no es una condición permanente. Es una oportunidad.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="mx-auto md:mx-0 max-w-md"
          >
            Construimos un ecosistema desde cero. Eventos, artistas, contenido
            audiovisual, relaciones institucionales. No como servicios. Como
            sistema.
            <br /><br />
            Darkside UY no es una productora de eventos. Es una metodología
            aplicada al territorio. Y el territorio cambió.
          </motion.p>

        </div>

        {/* METRICAS */}
        <div className="grid grid-cols-3 mt-10 md:mt-16 text-center gap-2 md:gap-0">

          {metrics.map((num, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i + 3}
            >
              <h3 className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-7xl font-bold`}>
                {num}
              </h3>

              <p className="text-[9px] sm:text-[10px] tracking-wider text-gray-400 uppercase">
                {i === 0
                  ? "Eventos en vivo"
                  : i === 1
                  ? "Formatos digitales"
                  : "Meses de experimento"}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}