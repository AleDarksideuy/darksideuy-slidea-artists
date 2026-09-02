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

      {/* =======================================================
                    EDITORIAL GALLERY
======================================================= */}

<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  custom={2}
  className="relative mb-24"
>

  <div className="grid grid-cols-12 gap-5 auto-rows-[120px] md:auto-rows-[150px]">

    {/* FOTO PRINCIPAL */}

    <motion.div
      whileHover={{ scale: 1.015 }}
      className="
        relative
        col-span-12
         md:col-span-7
  row-span-4

        rounded-[30px]
        overflow-hidden

        border
        border-white/10

        shadow-[0_30px_80px_rgba(0,0,0,.45)]
      "
    >

      <Image
        src="/underfest/banner-1 .jpg"
        alt="Underfest"
        fill
        className="
          object-cover
          transition-all
          duration-700
          hover:scale-105
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>

    </motion.div>

    {/* FOTO 2 */}

    <motion.div
      whileHover={{ y:-6 }}
      className="
        relative
        col-span-6
        md:col-span-5
row-span-4

        rounded-[24px]
        overflow-hidden

        border
        border-white/10

        shadow-xl
      "
    >

      <Image
        src="/underfest/banner-2.jpg"
        alt="Underfest"
        fill
        className="object-cover transition duration-700 hover:scale-105"
      />

    </motion.div>

    {/* FOTO 3 */}

    <motion.div
      whileHover={{ y:-6 }}
      className="
        relative
        col-span-6
        md:col-span-2
row-span-2

        rounded-[24px]
        overflow-hidden

        border
        border-white/10

        shadow-xl
      "
    >

      <Image
        src="/underfest/banner-3.jpg"
        alt="Underfest"
        fill
        className="object-cover transition duration-700 hover:scale-105"
      />

    </motion.div>

    {/* FOTO 4 */}

    <motion.div
      whileHover={{ y:-6 }}
      className="
        relative
        col-span-6
        md:col-span-2
row-span-2

        rounded-[22px]
        overflow-hidden

        border
        border-white/10

        shadow-xl
      "
    >

      <Image
        src="/underfest/banner-4.jpg"
        alt="Underfest"
        fill
        className="object-cover transition duration-700 hover:scale-105"
      />

    </motion.div>

    {/* FOTO 5 */}

    <motion.div
      whileHover={{ y:-6 }}
      className="
        relative
        col-span-6
        md:col-span-3
row-span-2

        rounded-[22px]
        overflow-hidden

        border
        border-white/10

        shadow-xl
      "
    >

      <Image
        src="/underfest/banner-6.jpg"
        alt="Underfest"
        fill
        className="object-cover transition duration-700 hover:scale-105"
      />

    </motion.div>

  </div>

</motion.div>


        {/* =======================================================
                    EXPERIENCE GRID
======================================================= */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

  {[
    {
      number: "01",
      title: "SESIÓN DE SKATE",
      text: "Skaters del litoral. Unión que impulsa el deporte a través de sesiones no competitivas.",
    },
    {
      number: "02",
      title: "FERIA DE EMPRENDEDORES",
      text: "Emprendedores locales. Economía circular dentro del evento.",
    },
    {
      number: "03",
      title: "SHOW EN VIVO",
      text: "Artistas musicales en vivo. La plaza como escenario.",
    },
    {
      number: "04",
      title: "EXPOSICIÓN DE ARTES VISUALES",
      text: "Artistas del departamento. Intervención del espacio público.",
    },
    {
      number: "05",
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
      custom={i + 3}
      whileHover={{ y: -8 }}
      className="
        group

        relative

        rounded-[28px]

        border
        border-white/10

        bg-white/[0.03]

        p-8

        overflow-hidden

        transition-all
        duration-500

        hover:border-[#E50914]
        hover:bg-white/[0.05]
      "
    >

      <span
        className="
          absolute
          top-6
          right-6

          text-5xl

          font-black

          text-white/5

          select-none
        "
      >
        {item.number}
      </span>

      <div
        className="
          w-12
          h-[2px]

          bg-[#E50914]

          mb-6
        "
      />

      <h3
        className={`
          ${spaceGrotesk.className}

          text-lg

          uppercase

          leading-tight

          font-bold

          mb-4
        `}
      >
        {item.title}
      </h3>

      <p
        className="
          text-sm

          text-gray-400

          leading-7
        "
      >
        {item.text}
      </p>

    </motion.div>

  ))}

</div>

      </div>
    </section>
  );
}