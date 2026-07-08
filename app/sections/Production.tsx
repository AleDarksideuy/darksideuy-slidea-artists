"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { motion, Variants } from "framer-motion";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Animación
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const items = [
  { id: "01", title: "LIVING SESSIONS", url: "https://youtube.com/playlist?list=PLKYACo2D96OLjeM5eS2j981odUL3hZpZ5&si=DxIZDk50foa63hU6", thumbnail: "/thumbnails/living.png" },
  { id: "02", title: "INTERVENCIÓN MERCEDES", url: "", thumbnail: null },
  { id: "03", title: "LA ISLA SESSIONS", url: "https://youtube.com/playlist?list=PLKYACo2D96OKVr4-x-E5oBngll0YJxtpu&si=Oc-KVIUsELmZxwlh", thumbnail: "/thumbnails/isla.png" },
];

export default function Production() {
  return (
    <section className="relative w-full text-white flex items-center justify-center px-4 md:px-6 py-16 md:py-20">
       
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-7xl w-full">

        {/* TITULO */}
        <motion.h2
          className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[110px] font-bold leading-none mb-6 md:mb-8`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          FORMATOS VISUALES
        </motion.h2>

        {/* SUBTITULO */}
        <motion.p
          className="text-[10px] sm:text-xs tracking-[0.25em] md:tracking-[0.35em] text-gray-400 uppercase mb-10 md:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          Living Sessions / Intervenciones CGI / Visualizers
        </motion.p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">

          {items.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="border border-white/30 p-5 md:p-8 flex flex-col justify-between min-h-[180px] md:min-h-[240px]"
            >

              {/* THUMBNAIL */}
              {item.thumbnail && (
                <div className="relative w-full h-28 sm:h-32 md:h-36 mb-4 overflow-hidden group cursor-pointer rounded-lg">

                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105 group-hover:blur-sm"
                  />

                  {/* OVERLAY (hover + mobile tap feeling) */}
                  <div className="absolute inset-0 bg-black/50 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-lg md:text-xl font-bold">▶</span>
                  </div>

                </div>
              )}

              {/* NUMERO */}
              <span className={`${spaceGrotesk.className} text-xl md:text-3xl font-bold mb-4 md:mb-6`}>
                {item.id}
              </span>

              {/* TITULO */}
              <h3 className="text-xs sm:text-sm md:text-base font-semibold tracking-wide mb-4 md:mb-6">
                {item.title}
              </h3>

              {/* BOTON */}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit flex items-center gap-2 px-3 md:px-4 py-2 text-[10px] md:text-xs uppercase bg-white text-black font-bold hover:opacity-80 transition"
                >
                  ▶ VER
                </a>
              ) : (
                <div className="w-fit px-3 md:px-4 py-2 text-[10px] md:text-xs uppercase border border-white/40 text-gray-400 font-bold">
                  Próximamente
                </div>
              )}

            </motion.div>
          ))}

        </div>

        {/* FRASE FINAL */}
        <motion.p
          className="text-center text-[10px] sm:text-xs md:text-sm text-gray-400 mt-14 md:mt-16 italic px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          "El contenido no fue el objetivo. Fue la evidencia."
        </motion.p>

      </div>
    </section>
  );
}