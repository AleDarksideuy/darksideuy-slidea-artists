"use client";

import { useEffect, useRef } from "react";
import { Space_Grotesk } from "next/font/google";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";

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

// 🔥 agrupar de a 3
const chunkArray = (arr: number[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function Works() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const nazVizRef = useRef<HTMLDivElement>(null);
  const cimVizRef = useRef<HTMLDivElement>(null);

  // 🔥 slider principal
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let index = 0;

    const interval = setInterval(() => {
      const children = container.children.length;
      index = (index + 1) % children;

      container.scrollTo({
        left: container.clientWidth * index,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 slider visualizers (más lento)
  const autoScroll = (ref: any) => {
    let index = 0;
    const container = ref.current;
    if (!container) return;

    return setInterval(() => {
      const children = container.children.length;
      index = (index + 1) % children;

      container.scrollTo({
        left: container.clientWidth * index,
        behavior: "smooth",
      });
    }, 6000); // 👈 antes 3000
  };

  useEffect(() => {
    const i1 = autoScroll(nazVizRef);
    const i2 = autoScroll(cimVizRef);

    return () => {
      clearInterval(i1);
      clearInterval(i2);
    };
  }, []);

  const nazGroups = chunkArray(Array.from({ length: 7 }, (_, i) => i + 1), 3);
  const cimGroups = chunkArray(Array.from({ length: 9 }, (_, i) => i + 1), 3);

  return (
    <section className="relative w-full min-h-screen flex items-center px-4 md:px-10 text-white overflow-hidden">

      <div className="absolute inset-0 bg-black/30" />

      <motion.div className="relative z-10 w-full mx-auto">

        <h2 className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-[100px] font-bold mb-6`}>
          PRODUCCIONES
        </h2>

        <p className="text-[10px] md:text-xs tracking-[0.35em] text-gray-400 uppercase mb-10">
          Producciones / Dirección creativa / Sistema aplicado
        </p>

        {/* 🔥 SLIDER GENERAL */}
        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">

          {/* ================= NAZ ================= */}
          <div className="min-w-full snap-center">

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

              <div className="relative w-full aspect-square">
                <Image
                  src="/releases/naz-cover.jpeg"
                  alt="Naz"
                  fill
                  className="object-coover"
                />
              </div>

              <div className="flex flex-col gap-6">

                <div>
                  <h3 className={`${spaceGrotesk.className} text-3xl md:text-5xl font-bold`}>
                    NAZ
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Fundirme de nuevo en un Abrazo
                  </p>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                  Desarrollo completo del universo visual y musical del álbum.
                </p>

                <div className="flex gap-4">
                  <a
                    href="https://open.spotify.com/intl-es/album/5OoZMtkcph4FzXOgyTQcom?si=dPj8_7NGSymYqeoqIe2SKA"
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase"
                  >
                    <ExternalLink size={16} />
                    Spotify
                  </a>

                  <a
                    href="https://youtube.com/playlist?list=PLGXkX-oM2avJABfYZvlaN28KT4AaBAyZg&si=ujrEOFQ0MDeIv0qz"
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 border border-white/60 text-xs font-bold uppercase"
                  >
                    <Play size={16} />
                    Videoclips
                  </a>
                </div>

              </div>

            </div>

            <div ref={nazVizRef} className="flex overflow-x-auto snap-x snap-mandatory mt-10 no-scrollbar">
              {nazGroups.map((group, i) => (
                <div key={i} className="min-w-full grid grid-cols-3 gap-4">
                  {group.map((img) => (
                    <div key={img} className="relative aspect-video">
                      <Image
                        src={`/releases/visualizer-${img}.jpeg`}
                        alt="viz"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>

          {/* ================= CIMARRONES ================= */}
          <div className="min-w-full snap-center">

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

              <div className="relative w-full aspect-square">
                <Image
                  src="/releases/porfiao-cover2.jpeg"
                  alt="Cimarrones"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-6">

                <div>
                  <h3 className={`${spaceGrotesk.className} text-3xl md:text-5xl font-bold`}>
                    CIMARRONES
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Porfiao
                  </p>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                  Desarrollo audiovisual y musical completo del proyecto.
                </p>

                <div className="flex gap-4">
                  <a
                    href="https://open.spotify.com/intl-es/album/07t08qgwKvLTwTl9TKgAuF?si=5ORcxOB9S3G3ylk5IZMl1A"
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase"
                  >
                    <ExternalLink size={16} />
                    Spotify
                  </a>

                  <a
                    href="https://youtube.com/playlist?list=PLirZ0CJi5fSXAogL1Q8AH9QW8_lXZ8C5d&si=YL4qa9d8Q7wKTKVQ"
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 border border-white/60 text-xs font-bold uppercase"
                  >
                    <Play size={16} />
                    Visualizers
                  </a>
                </div>

              </div>

            </div>

            <div ref={cimVizRef} className="flex overflow-x-auto snap-x snap-mandatory mt-10 no-scrollbar">
              {cimGroups.map((group, i) => (
                <div key={i} className="min-w-full grid grid-cols-3 gap-4">
                  {group.map((img) => (
                    <div key={img} className="relative aspect-video">
                      <Image
                        src={`/releases/porfiao-${img}.png`}
                        alt="viz"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>

        </div>

      </motion.div>
    </section>
  );
}