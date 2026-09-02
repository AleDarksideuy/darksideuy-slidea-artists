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

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-2
    gap-10
    md:gap-16
    text-center
    md:text-left
  "
>

  {/* BLOQUE 1 */}

  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    custom={1}
    className="
      flex
      flex-col
      items-center
      md:items-start
      gap-5
    "
  >

    <p
      className="
        text-[10px]
        sm:text-xs
        tracking-[0.3em]
        uppercase
        text-[#E50914]
      "
    >
      El comienzo
    </p>

    <h3
      className={`
        ${spaceGrotesk.className}
        text-2xl
        sm:text-3xl
        md:text-4xl
        font-bold
        leading-[1.05]
        uppercase
        max-w-md
      `}
    >
      Antes de que llegáramos,
      <br />
      nadie lo concebía
      <br />
      posible.
    </h3>

    <div className="w-12 h-px bg-white/20" />

    <p
      className="
        text-xs
        sm:text-sm
        text-gray-400
        leading-relaxed
        max-w-md
      "
    >
      Llegamos a una ciudad del interior profundo de Uruguay.
      Sin red. Sin capital. Sin historia ahí.
    </p>

    <p
      className="
        text-sm
        sm:text-base
        text-gray-200
        leading-relaxed
        max-w-md
      "
    >
      Con tres personas y una convicción: que el vacío cultural
      no es una condición permanente.
    </p>

    <p
      className={`
        ${spaceGrotesk.className}
        text-lg
        sm:text-xl
        font-bold
        uppercase
        text-white
      `}
    >
      Es una oportunidad.
    </p>

  </motion.div>


  {/* BLOQUE 2 */}

  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    custom={2}
    className="
      flex
      flex-col
      items-center
      md:items-start
      gap-5
    "
  >

    <p
      className="
        text-[10px]
        sm:text-xs
        tracking-[0.3em]
        uppercase
        text-[#E50914]
      "
    >
      El sistema
    </p>

    <h3
      className={`
        ${spaceGrotesk.className}
        text-2xl
        sm:text-3xl
        md:text-4xl
        font-bold
        leading-[1.05]
        uppercase
        max-w-md
      `}
    >
      Construimos un
      <br />
      ecosistema
      <br />
      desde cero.
    </h3>

    <div className="w-12 h-px bg-white/20" />

    <p
      className="
        text-xs
        sm:text-sm
        text-gray-400
        leading-relaxed
        max-w-md
      "
    >
      Eventos. Artistas. Contenido audiovisual.
      Relaciones institucionales.
    </p>

    <p
      className="
        text-sm
        sm:text-base
        text-gray-200
        leading-relaxed
        max-w-md
      "
    >
      No como servicios.
    </p>

    <p
      className={`
        ${spaceGrotesk.className}
        text-lg
        sm:text-xl
        font-bold
        uppercase
        text-white
      `}
    >
      Como sistema.
    </p>

    <div className="pt-2">

      <p
        className="
          text-[10px]
          sm:text-xs
          tracking-[0.22em]
          uppercase
          text-gray-500
          leading-relaxed
        "
      >
        Darkside UY no es una productora.
      </p>

      <p
        className={`
          ${spaceGrotesk.className}
          mt-2
          text-sm
          sm:text-base
          font-bold
          uppercase
          text-white
        `}
      >
        Es una metodología aplicada al territorio.
      </p>

    </div>

  </motion.div>

</div>

      </div>
    </section>
  );
}