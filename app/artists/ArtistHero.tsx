"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import type { Artist } from "../data/artists";
import { MapPin, Disc3, VolumeX, Volume2  } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type ArtistHeroProps = {
  artist: Artist;
};

export default function ArtistHero({ artist }: ArtistHeroProps) {
  const [showHeroVideo, setShowHeroVideo] = useState(
  Boolean(artist.heroVideo)
  
);
const [isMuted, setIsMuted] = useState(true);
const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
const [videoFinished, setVideoFinished] = useState(false);
const videoRef = useRef<HTMLVideoElement>(null);
const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {

  return () => {

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

  };

}, []);

const stopPreview = () => {

  if (previewTimeoutRef.current) {
    clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = null;
  }

  if (!videoRef.current) return;

  videoRef.current.pause();
  videoRef.current.currentTime = 0;
  videoRef.current.muted = true;

  setShowHeroVideo(false);
  setIsMuted(true);
  setIsPreviewPlaying(false);

};

const startPreview = () => {

  if (!videoRef.current) return;

  if (previewTimeoutRef.current) {
    clearTimeout(previewTimeoutRef.current);
  }

  setShowHeroVideo(true);

  setIsMuted(false);

  setIsPreviewPlaying(true);

  videoRef.current.currentTime = 0;

  videoRef.current.muted = false;

  videoRef.current.play();

  previewTimeoutRef.current = setTimeout(() => {

    stopPreview();

  }, 15000);

};

  return (
    <section
      className="
      grid
      grid-cols-1
      lg:grid-cols-[45%_55%]
      h-full
      bg-[#0b0b0b]
      "
    >
      {/* =======================================================
                            IMAGEN
      ======================================================== */}

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="
        relative
        h-[380px]
        lg:h-full
        overflow-hidden
        bg-black
        "
      >
        <Image
  src={artist.image}
  alt={artist.name}
  fill
  priority
  className="
    object-cover
    transition-all
    duration-700
    hover:scale-105
  "
/>

{artist.heroVideo && (

  <video
  ref={videoRef}
  autoPlay
  muted={isMuted}
  playsInline
  preload="metadata"

onEnded={() => {
  stopPreview();
}}

 className={`
  absolute
  inset-0
  w-full
  h-full
  object-cover
  z-10
  transition-opacity
  duration-700
  ${showHeroVideo ? "opacity-100" : "opacity-0"}
`}
>

    <source
      src={artist.heroVideo}
      type="video/mp4"
    />

  </video>

)}

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
<button
 onClick={() => {

  if (isPreviewPlaying) {

    stopPreview();

  } else {

    startPreview();

  }

}}
  className="
    absolute
    bottom-6
    right-6
    z-30

    w-11
    h-11

    rounded-full

    bg-black/50
    backdrop-blur-md

    border
    border-white/10

    flex
    items-center
    justify-center

    transition-all
    duration-300

    hover:bg-[#E50914]
    hover:scale-105
  "
>
{isPreviewPlaying ? (
  <Volume2 size={18}/>
) : (
  <VolumeX size={18}/>
)}

</button>
      </motion.div>

      {/* =======================================================
                           INFORMACIÓN
      ======================================================== */}

      <div
        className="
           relative
    flex
    flex-col
    justify-start
    px-8
    py-10
    md:px-12
    lg:px-20
    overflow-y-auto
    h-full
    custom-scrollbar
        "
      >
        {/* Badge */}

        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: .15 }}
          className="
          inline-flex
          w-fit
          px-5
          py-2
          rounded-full
          bg-[#E50914]
          uppercase
          tracking-[0.28em]
          text-[11px]
          font-bold
          mb-8
          "
        >
          Darksideuy
        </motion.div>

        {/* Nombre */}

        <motion.h1
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: .25 }}
          className={`
          ${spaceGrotesk.className}
          text-5xl
          xl:text-6xl
          2xl:text-7xl
          font-bold
          leading-[0.9]
          uppercase
          `}
        >
          {artist.name}
        </motion.h1>

        {/* Nombre legal */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .35 }}
          className="
          mt-5
          text-gray-400
          text-lg
          "
        >
          {artist.legalName}
        </motion.p>

        {/* Chips */}

        <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.45 }}
  className="
    flex
    flex-wrap
    items-center
    gap-4
    mt-8
  "
>

  {/* País */}

  <div
    className="
      flex
      items-center
      gap-3
      px-4
      py-2
      rounded-full
      border
      border-white/10
      bg-white/5
    "
  >
    <Image
      src={`/flags/${artist.countryCode}.svg`}
      alt={artist.country}
      width={22}
      height={16}
      className="rounded-sm"
    />

    <span className="text-sm">
      {artist.country}
    </span>
  </div>

  {/* Ciudad */}

  <div
    className="
      flex
      items-center
      gap-2
      px-4
      py-2
      rounded-full
      border
      border-white/10
      bg-white/5
    "
  >
    <MapPin size={16} className="text-gray-400" />

    <span className="text-sm">
      {artist.city}
    </span>
  </div>

  {/* Género */}

  <div
    className="
      flex
      items-center
      gap-2
      px-4
      py-2
      rounded-full
      border
      border-white/10
      bg-white/5
    "
  >
    <Disc3 size={16} className="text-gray-400" />

    <span className="text-sm">
      {artist.category}
    </span>
  </div>

</motion.div>

        {/* =======================================================
                    CONTINÚA EN LA PARTE 2
        ======================================================== */}
        {/* =======================================================
                        ABOUT
======================================================== */}

<motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.55 }}
  className="mt-14"
>
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-px bg-[#E50914]" />

    <h2
      className={`
      ${spaceGrotesk.className}
      uppercase
      tracking-[0.25em]
      text-sm
      text-white
      `}
    >
      About
    </h2>
  </div>

  <p
    className="
    text-gray-300
    leading-8
    text-[15px]
    md:text-base
    max-w-2xl
    "
  >
    {artist.description && artist.description.trim() !== ""
      ? artist.description
      : "Próximamente encontrarás aquí la biografía completa del artista, su recorrido, influencias, trayectoria y el trabajo desarrollado junto a Darkside."}
  </p>
</motion.div>

<div className="my-12 border-t border-white/10" />

{/* =======================================================
                        RELEASES
======================================================== */}

{artist.releases && artist.releases.length > 0 && (

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: .60 }}
>

  <div className="flex items-center gap-4 mb-8">

    <div className="w-12 h-px bg-[#E50914]" />

    <h2
      className={`
        ${spaceGrotesk.className}
        uppercase
        tracking-[0.25em]
        text-sm
      `}
    >
      Releases
    </h2>

  </div>

  <div className="flex
    gap-6
    overflow-x-auto
    
    pb-4
    mb-14">

  {artist.releases.map((release, index) => (

    <motion.div
      key={index}
      whileHover={{ x: 4 }}
      className="
        flex
        items-center
        gap-5
        py-3
      "
    >

      {/* Cover */}

      <div
        className="
          relative
          w-[68px]
          h-[68px]
          rounded-xl
          overflow-hidden
          bg-neutral-900
          shrink-0
        "
      >

        {release.cover ? (

          <Image
            src={release.cover}
            alt={release.title}
            fill
            className="object-cover"
          />

        ) : (

          <div className="absolute inset-0 flex items-center justify-center">

            <Disc3
              size={26}
              className="text-white/20"
            />

          </div>

        )}

      </div>

      {/* Información */}

      <div className="flex-1 min-w-0">

        <h3
          className={`
            ${spaceGrotesk.className}
            text-lg
            font-semibold
          `}
        >
          {release.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">

          {release.type}

        </p>

        <div className="flex items-center gap-3 mt-3">

          <span
            className="
              px-3
              py-1
              rounded-full
              border
              border-white/10
              bg-white/5
              text-[11px]
              uppercase
              tracking-[0.12em]
            "
          >
            {release.status}
          </span>

          {release.releaseDate && (

            <span className="text-xs text-gray-500">

              {release.releaseDate}

            </span>

          )}

        </div>

      </div>

    </motion.div>

  ))}

</div>

</motion.div>

)}


{/* =======================================================
                    PROYECTOS O REDES
======================================================== */}

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.65 }}
>

  <div className="flex items-center gap-4 mb-8">

    <div className="w-12 h-px bg-[#E50914]" />

    <h2
      className={`
        ${spaceGrotesk.className}
        uppercase
        tracking-[0.25em]
        text-sm
      `}
    >
      {artist.projects ? "Projects" : "Connect"}
    </h2>

  </div>

  {artist.projects ? (

    <div className="space-y-5">

      {artist.projects.map((project, index) => (

        <motion.div
          key={index}
          whileHover={{ y: -3 }}
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-5
            transition
          "
        >

          <h3
            className={`
              ${spaceGrotesk.className}
              text-lg
              font-bold
              uppercase
              mb-4
            `}
          >
            {project.name}
          </h3>

          <div className="flex flex-wrap gap-3">

            {project.instagram && (
              <a
                href={project.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-4
                  py-2
                  rounded-full
                  border
                  border-white/10
                  hover:border-[#f6339a]
                  hover:bg-[#f6339a]/10
                  transition
                "
              >
                Instagram
              </a>
            )}

            {project.spotify && (
              <a
                href={project.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-4
                  py-2
                  rounded-full
                  border
                  border-white/10
                  hover:border-[#1DB954]
                  hover:bg-[#1DB954]/10
                  transition
                "
              >
                Spotify
              </a>
            )}

            {project.youtube && (
              <a
                href={project.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-4
                  py-2
                  rounded-full
                  border
                  border-white/10
                  hover:border-red-500
                  hover:bg-red-500/10
                  transition
                "
              >
                YouTube
              </a>
            )}

            {project.facebook && (
              <a
                href={project.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  px-4
                  py-2
                  rounded-full
                  border
                  border-white/10
                  hover:border-blue-500
                  hover:bg-blue-500/10
                  transition
                "
              >
                Facebook
              </a>
            )}

          </div>

        </motion.div>

      ))}

    </div>

  ) : (

    <div className="flex flex-wrap gap-4">

      {artist.instagram && (
        <a
          href={artist.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-full border border-white/10 hover:bg-[#f6339a] transition"
        >
          Instagram
        </a>
      )}

      {artist.spotify && (
        <a
          href={artist.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-full border border-white/10 hover:bg-[#1DB954] transition"
        >
          Spotify
        </a>
      )}

      {artist.youtube && (
        <a
          href={artist.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-full border border-white/10 hover:bg-red-600 transition"
        >
          YouTube
        </a>
      )}

      {artist.facebook && (
        <a
          href={artist.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-full border border-white/10 hover:bg-blue-600 transition"
        >
          Facebook
        </a>
      )}

    </div>

  )}

</motion.div>
{/* =======================================================
                    FOOTER DEL PERFIL
======================================================== */}

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.85 }}
  className="
    mt-16
    pt-8
    border-t
    border-white/10
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-6
  "
>

  <div>

    <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">
      Artist Profile
    </p>

    <h3
      className={`
        ${spaceGrotesk.className}
        text-xl
        font-semibold
      `}
    >
      {artist.name}
    </h3>

  </div>

  <div className="text-sm text-gray-500 text-right">

    <p>{artist.country}</p>

    <p>{artist.category}</p>

  </div>

</motion.div>
      
      
      </div>
      
    </section>
    
  );
}