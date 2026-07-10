"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  FaInstagram,
  FaYoutube,
  FaSpotify,
  FaFacebookF,
} from "react-icons/fa";
import { Space_Grotesk } from "next/font/google";
import ArtistOverlay from "../artists/ArtistOverlay";
import { artists } from "../data/artists";



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
      delay: i * 0.08,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};



export default function Artists() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const [selectedArtist, setSelectedArtist] = useState<
    (typeof artists)[number] | null
  >(null);

  useEffect(() => {
    const resize = () => {
     if (window.innerWidth < 768) {

  setCardsPerView(1);

} else if (window.innerWidth < 1200) {

  setCardsPerView(2);

} else {

  setCardsPerView(3);

}
    };

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const maxIndex = artists.length - cardsPerView;

  const next = () => {
    if (!sliderRef.current) return;
    if (current >= maxIndex) return;

    const card =
      sliderRef.current.querySelector<HTMLElement>(".artist-card");

    if (!card) return;
const distance = card.offsetWidth + 32;

const remaining =
  sliderRef.current.scrollWidth -
  sliderRef.current.clientWidth -
  sliderRef.current.scrollLeft;

sliderRef.current.scrollBy({
  left: Math.min(distance, remaining),
  behavior: "smooth",
});

    setCurrent((prev) => prev + 1);
  };

  const prev = () => {
    if (!sliderRef.current) return;
    if (current <= 0) return;

    const card =
      sliderRef.current.querySelector<HTMLElement>(".artist-card");

    if (!card) return;

    sliderRef.current.scrollBy({
      left: -(card.offsetWidth + 32),
      behavior: "smooth",
    });

    setCurrent((prev) => prev - 1);
  };

  return (
  <>
    <section className="relative py-32 overflow-hidden">

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">

        <motion.h2
          className={`${spaceGrotesk.className} text-5xl md:text-7xl font-bold mb-4`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          NUESTROS ARTISTAS
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          className="text-gray-400 mb-16 max-w-xl"
        >
          Conoce a los artistas que actualmente forman parte del ecosistema
          Darkside.
        </motion.p>

        <div className="relative">

          {/* Flecha izquierda */}

          <button
            onClick={prev}
            disabled={current === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center transition-all
            ${
              current === 0
                ? "opacity-25 cursor-not-allowed"
                : "hover:bg-[#E50914] hover:border-[#E50914]"
            }`}
          >
            <ChevronLeft size={30} />
          </button>

          {/* Flecha derecha */}

          <button
            onClick={next}
            disabled={current >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center transition-all
            ${
              current >= maxIndex
                ? "opacity-25 cursor-not-allowed"
                : "hover:bg-[#E50914] hover:border-[#E50914]"
            }`}
          >
            <ChevronRight size={30} />
          </button>

          {/* Carrusel */}

          <div
            ref={sliderRef}
            className="flex gap-8 overflow-hidden scroll-smooth"
          >

            {artists.map((artist, index) => (

              <motion.div
                key={artist.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={index}
                onClick={() => setSelectedArtist(artist)}
                className="artist-card relative min-w-[320px] md:min-w-[340px] h-[560px] rounded-3xl overflow-hidden flex-shrink-0 group cursor-pointer"
              >

                <div className="absolute inset-0 overflow-hidden">

                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  />

                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-0 rounded-3xl border border-white/10 transition-all duration-500 group-hover:border-[#E50914] group-hover:shadow-[0_0_60px_rgba(229,9,20,.35)]" />

                <div className="absolute top-8 left-8 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">

                  <Image
                    src={artist.avatar}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">

                  <p className="uppercase tracking-[0.35em] text-xs text-gray-300 mb-2">
                    {artist.country}
                  </p>

                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold mb-3`}>
                    {artist.name}
                  </h3>

                  <p className="text-gray-300 mb-6">
                    {artist.category}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[#E50914] px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase"
                  >
                    Ver perfil
                  </motion.button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

    </section>

    {/* ===========================
          OVERLAY DEL ARTISTA
    ============================ */}

    <ArtistOverlay
  artist={selectedArtist}
  onClose={() => setSelectedArtist(null)}
/>

  </>
);
}