"use client";

import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";

import LinternaStage from "../components/linterna/LinternaStage";
import { useIsTouch } from "../components/linterna/device";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const letter: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  const isTouch = useIsTouch();

  return (

    <section
      className="
        relative

        w-full

        overflow-hidden

        text-white
      "
    >

      {/* =======================================================
                            OVERLAY
      ======================================================= */}

      <div className="absolute inset-0 bg-black/30" />

      {/* =======================================================
                  EL LADO OSCURO — LA LINTERNA
          El monograma D en 3D, a oscuras. El cursor (o el dedo)
          es una linterna roja que lo ilumina y revela la frase
          del manifiesto escondida detrás.
      ======================================================= */}

      <LinternaStage
        hiddenPhrase="El vacío cultural no es una condición permanente. Es una oportunidad."
        className="h-[88svh] min-h-[540px] w-full md:h-[100svh] md:min-h-[640px]"
      >

        <div
          className="
            flex
            h-full
            flex-col

            items-center
            justify-end
            text-center

            px-4
            pb-6
            md:pb-14
          "
        >

          {/* LOGO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <h1>
              <Image
                src="/Darksideuy.png"
                alt="Darkside UY"
                width={600}
                height={200}
                priority
                className="
                  w-[200px]
                  sm:w-[260px]
                  md:w-[380px]

                  h-auto
                "
              />
            </h1>

          </motion.div>

          {/* SUBTITLE */}

          <motion.p
            className={`
              ${spaceGrotesk.className}

              mt-4

              text-[9px]
              sm:text-[10px]
              md:text-xs

              tracking-[0.25em]
              md:tracking-[0.35em]

              uppercase

              text-gray-400

              max-w-xs
              sm:max-w-md
              md:max-w-none
            `}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.2,
              duration: .8,
            }}
          >

            Productora cultural independiente — Mercedes, Uruguay — 2026

          </motion.p>

          {/* ACCESOS DIRECTOS: los dos pasos principales, al alcance del pulgar */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
          >

            <a
              href="#artists"
              className={`${spaceGrotesk.className} flex min-h-[52px] flex-1 items-center justify-center whitespace-nowrap rounded-2xl bg-[#E50914] px-6 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(229,9,20,0.35)] transition active:scale-[0.98] md:hover:brightness-110`}
            >
              Conocé a los artistas
            </a>

            <a
              href="#llamado-artistas"
              className={`${spaceGrotesk.className} flex min-h-[52px] flex-1 items-center justify-center whitespace-nowrap rounded-2xl border border-white/20 bg-black/40 px-6 text-sm font-bold uppercase tracking-[0.18em] text-white transition active:scale-[0.98] md:hover:border-[#E50914]`}
            >
              Sumate al llamado
            </a>

          </motion.div>

          {/* CÓMO SE USA LA LINTERNA */}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className={`
              ${spaceGrotesk.className}

              mt-5

              text-[10px]
              uppercase
              tracking-[0.3em]

              text-[#E50914]

              motion-reduce:hidden
            `}
          >
            {isTouch ? "Tocá la oscuridad" : "Mové la luz"}
          </motion.p>

        </div>

      </LinternaStage>

      <div
        className="
          relative
          z-10

          max-w-6xl
          mx-auto

          flex
          flex-col
          items-center

          px-4
          md:px-6

          pb-24
        "
      >

{/* =======================================================
                        ABOUT
======================================================= */}

<motion.div
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
    duration: .8,
    delay: .2,
  }}
  className="
    mt-20

    w-full

    max-w-5xl
  "
>

  <div
    className="
      grid

      grid-cols-1
      md:grid-cols-2

      gap-8
      md:gap-12

      text-center
      md:text-left
    "
  >

    <p
      className="
        text-sm
        md:text-base

        leading-8

        text-gray-300
      "
    >
      Antes de que llegáramos, nadie lo concebía posible.
      Llegamos a una ciudad del interior profundo de Uruguay
      sin red, sin capital, sin historia ahí.
      Con tres personas y una convicción:
      que el vacío cultural no es una condición permanente.
      Es una oportunidad.
    </p>

    <p
      className="
        text-sm
        md:text-base

        leading-8

        text-gray-300
      "
    >
      Construimos un ecosistema desde cero.
      Eventos, artistas, contenido audiovisual,
      relaciones institucionales.
      No como servicios.
      Como sistema.

      <br />
      <br />

      Darkside UY no es una productora de eventos.
      Es una metodología aplicada al territorio.
      Y el territorio cambió.
    </p>

  </div>

</motion.div>

{/* =======================================================
                        METRICS
======================================================= */}

<motion.div
  initial={{
    opacity: 0,
    y: 30,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  viewport={{
    once: true,
  }}
  transition={{
    duration: .8,
    delay: .35,
  }}
  className="
    mt-20

    w-full

    grid
    grid-cols-3

    gap-4

    text-center
  "
>

  <div>

    <h3
      className={`
        ${spaceGrotesk.className}

        text-4xl
        sm:text-5xl
        md:text-7xl

        font-bold
      `}
    >
      33
    </h3>

    <p
      className="
        mt-2

        text-[10px]
        md:text-xs

        uppercase
        tracking-[0.2em]

        text-gray-500
      "
    >
      Eventos en vivo
    </p>

  </div>

  <div>

    <h3
      className={`
        ${spaceGrotesk.className}

        text-4xl
        sm:text-5xl
        md:text-7xl

        font-bold
      `}
    >
      10
    </h3>

    <p
      className="
        mt-2

        text-[10px]
        md:text-xs

        uppercase
        tracking-[0.2em]

        text-gray-500
      "
    >
      Formatos digitales
    </p>

  </div>

  <div>

    <h3
      className={`
        ${spaceGrotesk.className}

        text-4xl
        sm:text-5xl
        md:text-7xl

        font-bold
      `}
    >
      15
    </h3>

    <p
      className="
        mt-2

        text-[10px]
        md:text-xs

        uppercase
        tracking-[0.2em]

        text-gray-500
      "
    >
      Meses de experimento
    </p>

  </div>

</motion.div>

      </div>

    </section>

  );

}
