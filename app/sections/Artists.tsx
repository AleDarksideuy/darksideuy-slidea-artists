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

const artists = [

    {
  name: "MARTIN ARBELO",
  legalName: "Martin Arbelo",
  country: "Uruguay",
  city: "Paysandú",
  category: "Rock pop",
  description: "",
  image: "/artists/martinarbelo.jpeg",
  avatar: "/artists/martinavatar.jpg",
 projects: [
  {
    name: "ANTAGÓNICA",
    instagram: "https://www.instagram.com/antagonica.oficial/",
    youtube: "https://www.youtube.com/@antagonica.oficial",
    spotify: "https://open.spotify.com/artist/6YOfMfQCuI65SY2aM8YN6b?si=T7a-LPeHTHGOu3WVxZQvpw",
    facebook: "https://www.facebook.com/profile.php?id=100047391682890",
  },
  {
    name: "LA CRISIS URUGUAYA",
    instagram: "https://www.instagram.com/la_crisis_uruguaya/",
    youtube: "https://www.youtube.com/@LaCrisisUruguaya",
    spotify: "https://open.spotify.com/artist/03iaw5bKJhdF0xNPSX7dt0?si=vaeiykZgSEW6gzVjn9dwhQ",
    facebook: "https://www.facebook.com/profile.php?id=61559026508674",
  },
  {
    name: "LA CASA DEL DINOSAURIO",
    instagram: "https://www.instagram.com/lacasadeldinosaurio/",
    youtube: "https://www.youtube.com/@lacasadeldinosaurio8375/videos",
    spotify: "https://open.spotify.com/artist/1HaOLPqqdeaBqSc97k3WhF?si=Os8EjOdnQzy1d-YMKU-PGg",
    facebook: "https://www.facebook.com/profile.php?id=100063124245171",
  },
],
},
{
    name: "B'RESHITH",
    legalName: "B'reshith Burstens Santome",
    country: "Perú",
    city: "Lima",
    category: "Rock Andino Fusión",
    description: "",
    image: "/artists/bereshith.jpg",
    avatar: "/artists/bereshitavatar.jpg",
    instagram: "https://www.instagram.com/BRESHITHB/",
    youtube: "https://www.youtube.com/@BreshithB",
    spotify: "https://open.spotify.com/intl-es/artist/1WtMR7arixVIgC9ckyhyOE",
    facebook: "https://www.facebook.com/BreshithB/",
  },
   {
    name: "EL ASTURIANO",
    legalName: "Manuel Alvarez",
    country: "Uruguay",
    city: "Montevideo",
    category: "Folklore / Rock / Murga",
    description: "",
    image: "/artists/elasturiano.jpeg",
    avatar: "/artists/elasturianoavatar.jpg",
    instagram: "https://www.instagram.com/manuel_el_asturiano/",
    youtube: "https://www.youtube.com/@Elasturiano-i2w",
    spotify: "",
    facebook: "",
  },
  {
    name: "ARIAN MW",
    legalName: "Representante: Christian Chandía y Nelson Turra",
    country: "Chile",
    city: "Santiago de Chile",
    category: "Rock Alternativo",
    description:
      "",
    image: "/artists/arian.jpeg",
    avatar: "/artists/arianavatar.jpg",
    instagram: "https://www.instagram.com/arian.worldmusic/?hl=es",
    youtube: "https://www.youtube.com/@arianworldmusicband",
    spotify: "",
    facebook: "",
  },

  {
    name: "ZONNO",
    legalName: " Representante: Juan Francisco Saralegui",
    country: "Uruguay",
    city: "Tacuarembó",
    category: "Soul / Musica Disco / Funk",
    description: "",
    image: "/artists/zonno.jpeg",
    avatar: "/artists/zonnoavatar.jpg",
    instagram: "https://www.instagram.com/zonnobanda/",
    youtube: "https://www.youtube.com/@zonnobanda",
    spotify: "https://open.spotify.com/intl-es/artist/1xamWQ8W4EaJKACaFKtwEl?si=SP0NTWHnSROBFzgmkQsmdA",
    facebook: "",
  },

  {
    name: "LUPRETINIA",
    legalName: "Agustina Scelzi",
    country: "Argentina",
    city: "Entre Ríos",
    category: "Indie / Dreampop",
    description:
      "",
    image: "/artists/lupretinia.jpeg",
    avatar: "/artists/lupretiniaavatar.jpg",
    instagram: "https://www.instagram.com/lupretinia/ ",
    youtube: "https://www.youtube.com/@lupretinia ",
    spotify: "https://open.spotify.com/intl-es/artist/6960ZeP0HXwRLo81fBpAlW?si=jy_tH49xQyKtc5ACjbgATg",
  },

   {
    name: "LOS ESPEJOS",
    legalName: "Nicolás Rapetti",
    country: "Uruguay",
    city: "Montevideo",
    category: "Rock",
    description: "",
    image: "/artists/losespejos.jpeg",
    avatar: "/artists/losespejosavatar.jpg",
    instagram: "https://www.instagram.com/losespejosuy/",
    youtube: "https://www.youtube.com/@losespejosuy",
    spotify: "https://open.spotify.com/intl-es/artist/5P08EnfFwAuPjUGX6ZMR2w?si=1jPw7mTGRWOHjVA2sKp97g",
    facebook: "",
  },

 

  {
    name: "TEO ÁVILA",
    legalName: "Teo Ávila",
    country: "Argentina",
    city: "Buenos Aires",
    category: "Rock",
    description: "",
    image: "/artists/teoavila.jpeg",
    avatar: "/artists/teoavatar.jpg",
    instagram: "https://www.instagram.com/teoavila_guitar?igsh=a3RvZnZscXZwcmt2",
    youtube: "https://youtube.com/@teoavila_?si=pEUyJzsT5qzK81uu",
    spotify: "https://open.spotify.com/artist/42tN9bb1iRlIkPX7fUN58h?si=mQfczjLGSHO6sMg9iyg75g",
    facebook: "",
  },

  {
    name: "SOFI CARRIQUE",
    legalName: "Sofia Carrique",
    country: "ESTADOS UNIDOS / URUGUAY",
    city: "MIAMI",
    category: "Pop Latino",
    description: "",
    image: "/artists/soficarrique.jpeg",
    avatar: "/artists/sofiavatar.jpg",
    instagram: "https://www.instagram.com/sofi.carrique/",
    youtube: "https://youtu.be/64LCJ-PppFI?si=oxh3yF1XG0jN-Xfh",
    spotify: "https://open.spotify.com/track/12F0ivCgOcFKBON42Qkft2?si=6WJRUak6Tv2gMMgtUPNnGg",
    facebook: "",
  },

  

  {
    name: "CARLÍN LEVRATTO",
    legalName: "Carlín Levratto",
    country: "Uruguay",
    city: "Tacuarembó",
    category: "Música Popular Uruguaya",
    description: "",
    image: "/artists/carlin levratto.jpeg",
    avatar: "/artists/carlinavatar.jpg",
    instagram: "https://www.instagram.com/carlin.levratto/",
    youtube: "https://www.youtube.com/@carlevai",
    spotify: "https://open.spotify.com/intl-es/artist/7Lq6Vty6qBho4kbSmhnckh",
    facebook: "",
  },

  {
    name: "JOHAN HEYSS",
    legalName: "Alexandre Gomes Soares",
    country: "BRASIL",
    city: "Rio de Janeiro",
    category: "Electrónico / Pop",
    description: "",
    image: "/artists/johann heyss.jpeg",
    avatar: "/artists/johanavatar.jpg",
    instagram: "https://www.instagram.com/johannheyss/",
    youtube: "https://www.youtube.com/@JohannHeyssVideos",
    spotify: "https://open.spotify.com/intl-pt/artist/1iQU6w9tV52V9ElHIhqxlS?si=44E3GuG0S3C1nx0QeEQddg",
    facebook: "https://www.facebook.com/HeyssJohann",
  },

 

  {
  name: "AMY'S BAND",
  legalName: "Amy Valeria Vázquez",
  country: "Uruguay",
  city: "Montevideo",
  category: "Música Popular Uruguaya",
  description: "",
  image: "/artists/amysband.jpeg",
  avatar: "/artists/amyavatar.jpg",
  instagram: "https://www.instagram.com/amy_sbandstudio/",
  facebook: "",
  youtube: "https://www.youtube.com/channel/UCxxOUibNVeQUC4zCT1H3duA",
  spotify: "",
},


];

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

    <AnimatePresence>

      {selectedArtist && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedArtist(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[999] flex items-center justify-center p-4"
        >

          <motion.div
            initial={{ scale: .95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: .95, opacity: 0 }}
            transition={{ duration: .35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl rounded-3xl overflow-hidden bg-[#0d0d0d] border border-white/10 grid md:grid-cols-2"
          >

            <button
              onClick={() => setSelectedArtist(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-[#E50914] transition flex items-center justify-center"
            >
              <X />
            </button>

            {/* Imagen */}

            <div className="relative h-[350px] md:h-full">

              <Image
                src={selectedArtist.image}
                alt={selectedArtist.name}
                fill
                className="object-contain bg-black"
              />

            </div>

            {/* Información */}

            <div className="p-8 md:p-12 flex flex-col justify-center">

              <p className="uppercase tracking-[0.35em] text-xs text-gray-500 mb-3">
                {selectedArtist.country} · {selectedArtist.city}
              </p>

              <h2 className={`${spaceGrotesk.className} text-5xl font-bold mb-2`}>
                {selectedArtist.name}
              </h2>

              <h3 className="text-gray-400 mb-8">
                {selectedArtist.legalName}
              </h3>

              <p className="leading-relaxed text-gray-300 mb-8">
                {selectedArtist.description}
              </p>

              <div className="flex items-center gap-4">

                {selectedArtist.projects ? (

  <div className="space-y-6 overflow-y-auto max-h-[180px] md:max-h-[260px] pr-2">

    {selectedArtist.projects.map((project, index) => (

      <div key={index}>

        <h4 className="text-[#E50914] uppercase tracking-[0.25em] text-xs font-bold mb-3">
          {project.name}
        </h4>

        <div className="flex items-center gap-4">

          {project.instagram && (
            <a
              href={project.instagram}
              target="_blank"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#ec003f] transition"
            >
              <FaInstagram />
            </a>
          )}

          {project.facebook && (
            <a
              href={project.facebook}
              target="_blank"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#155dfc] transition"
            >
              <FaFacebookF />
            </a>
          )}

          {project.youtube && (
            <a
              href={project.youtube}
              target="_blank"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#E50914] transition"
            >
              <FaYoutube />
            </a>
          )}

          {project.spotify && (
            <a
              href={project.spotify}
              target="_blank"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#05df72] transition"
            >
              <FaSpotify />
            </a>
          )}

        </div>

      </div>

    ))}

  </div>

) : (

  <div className="flex items-center gap-4">

    {selectedArtist.instagram && (
      <a
        href={selectedArtist.instagram}
        target="_blank"
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#ec003f] transition"
      >
        <FaInstagram />
      </a>
    )}

    {selectedArtist.facebook && (
      <a
        href={selectedArtist.facebook}
        target="_blank"
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#155dfc] transition"
      >
        <FaFacebookF />
      </a>
    )}

    {selectedArtist.youtube && (
      <a
        href={selectedArtist.youtube}
        target="_blank"
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#E50914] transition"
      >
        <FaYoutube />
      </a>
    )}

    {selectedArtist.spotify && (
      <a
        href={selectedArtist.spotify}
        target="_blank"
        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#05df72] transition"
      >
        <FaSpotify />
      </a>
    )}

  </div>

)}
              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  </>
);
}