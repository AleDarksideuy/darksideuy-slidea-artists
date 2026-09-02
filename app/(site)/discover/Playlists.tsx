

"use client";

import { motion } from "framer-motion";

export default function Playlists() {

  return (

    <motion.section
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: .6,
        delay: .2,
      }}
      className="
        lg:col-span-12

        rounded-[32px]

        border
        border-white/10

        bg-[#0b0b0b]

        p-6
        md:p-8
        xl:p-10
      "
    >

      {/* =======================================================
                            HEADER
      ======================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row

          lg:items-center
          lg:justify-between

          gap-8
        "
      >

        <div>

          <h2
            className="
              text-4xl
              md:text-5xl
              xl:text-6xl

              font-bold
              uppercase
            "
          >
            Playlists
          </h2>

          <p
            className="
              mt-6

              max-w-2xl

              text-gray-400
              leading-8
            "
          >
            Curated collections designed for every mood, every moment and every journey.
          </p>

        </div>

        <div
          className="
            self-start

            rounded-full

            border
            border-[#E50914]/30

            bg-[#E50914]/10

            px-5
            py-2

            text-xs
            font-semibold

            uppercase
            tracking-[0.25em]

            text-[#ff5b63]
          "
        >
          Coming Soon
        </div>

      </div>

      {/* =======================================================
                  CONTINÚA EN LA PARTE 2
      ======================================================= */}
      {/* =======================================================
                  PLAYLIST PREVIEW
======================================================= */}

<div className="mt-16">

  {[
    {
      name: "Dark Techno",
      subtitle: "Curated by Darkside",
    },
    {
      name: "After Hours",
      subtitle: "Late night selections",
    },
    {
      name: "Peak Time",
      subtitle: "Festival energy",
    },
  ].map((playlist, index) => (

    <motion.div
  key={playlist.name}
  initial={{
    opacity: 0,
    y: 16,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  viewport={{
    once: true,
    amount: 0.2,
  }}
  whileHover={{
    x: 6,
  }}
  transition={{
    duration: .35,
    delay: index * .08,
    ease: "easeOut",
  }}
  className="
    group

    rounded-2xl

    px-5
    py-1

    -mx-5

    border
    border-transparent

    transition-all
    duration-300

    hover:bg-white/[0.025]
    hover:border-white/10
  "
>

  <div
    className="
      flex
      items-center
      justify-between

      py-6
    "
  >

    <div
      className="
        flex
        items-center
        gap-5
      "
    >

      <div
        className="
          w-4
          h-4

          rounded-sm

          bg-[#E50914]

          shadow-[0_0_14px_rgba(229,9,20,.45)]

          transition-transform
          duration-300

          group-hover:rotate-45
          group-hover:scale-110
        "
      />

      <div>

        <h3
          className="
            text-xl
            font-semibold
          "
        >
          {playlist.name}
        </h3>

        <p
          className="
            mt-1
            text-gray-500
          "
        >
          {playlist.subtitle}
        </p>

      </div>

    </div>

    <div
      className="
        flex
        items-center
        gap-2

        text-sm

        uppercase
        tracking-[0.25em]

        text-[#E50914]

        transition-transform
        duration-300

        group-hover:translate-x-1
      "
    >

      <span>Coming Soon</span>

      <span>→</span>

    </div>

  </div>

  {index !== 2 && (

    <div
      className="
        border-b
        border-white/10
      "
    />

  )}

</motion.div>
  ))}

</div>
{/* =======================================================
                    FOOTER
======================================================= */}

<div
  className="
    mt-14

    pt-8

    border-t
    border-white/10
  "
>

  <div
    className="
      flex
      flex-col
      md:flex-row

      items-start
      md:items-center

      justify-between

      gap-6
    "
  >

    <div>

      <p
        className="
          text-sm
          uppercase
          tracking-[0.3em]

          text-[#E50914]
        "
      >
        En desarrollo
      </p>

      <p
        className="
          mt-3

          max-w-xl

          text-gray-400
          leading-7
        "
      >
       Estamos preparando y curando una selección de playlists de artistas por descubrir para cualquier momento o mood del día.
      </p>

    </div>

    <div
      className="
        shrink-0

        rounded-full

        border
        border-white/10

        bg-white/[0.03]

        px-5
        py-3

        text-xs
        uppercase
        tracking-[0.25em]

        text-gray-500
      "
    >
      Mantengase Alerta
    </div>

  </div>

</div>

    </motion.section>

  );

}