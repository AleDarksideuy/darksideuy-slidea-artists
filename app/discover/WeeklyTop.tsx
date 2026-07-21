"use client";

import { motion } from "framer-motion";
import { spotlightArtists } from "../data/spotlight";
import {
  FaSpotify,
  FaYoutube,
  FaSoundcloud,
} from "react-icons/fa";

export default function WeeklyTop() {

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
      }}
      className="
        lg:col-span-5

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

      <h2
        className="
          text-4xl
          md:text-5xl
          xl:text-6xl

          font-bold
          uppercase
        "
      >
        Spotlight
      </h2>

      <p
        className="
          mt-6

          max-w-md

          text-gray-400
          leading-8
        "
      >
        Descubre a artistas y sus últimos lanzamientos en distintas plataformas. 
      </p>

      {/* =======================================================
                    ARTIST LIST
======================================================= */}

<div className="mt-14">

  {spotlightArtists.map((artist, index) => (

    <motion.div
  key={artist.id}

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
    scale: 1.01,
  }}

  transition={{
    duration: 0.35,
    delay: index * 0.08,
    ease: "easeOut",
  }}

  className="
    group

    rounded-2xl

    px-4
    py-4

    -mx-4

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
          gap-5
        "
      >

        {/* =======================================================
                            ARTIST PHOTO
        ======================================================= */}

        <img
  src={artist.image}
  alt={artist.artist}
  className="
    w-16
    h-16

    rounded-full

    object-cover

    shrink-0

    border
    border-white/10

    shadow-[0_0_20px_rgba(0,0,0,0.35)]

    transition-all
    duration-300

    group-hover:scale-105
    group-hover:border-white/20
"
 />

        {/* =======================================================
                              INFO
        ======================================================= */}

        <div className="flex-1">

  <h3
    className="
      text-xl
      font-semibold
    "
  >
    {artist.artist}
  </h3>

  <p
    className="
      mt-1

      text-gray-300
    "
  >
    {artist.release}
  </p>

  <p
    className="
      mt-2

      text-sm
      text-gray-500
    "
  >
    {artist.genre}
    {" • "}
    {artist.year}
  </p>

  {/* =======================================================
                    PLATFORM LINKS
  ======================================================= */}

  <div
    className="
      mt-5

      flex
      flex-wrap
      gap-3
    "
  >

    {artist.spotify && (

  <a
    href={artist.spotify}
    target="_blank"
    rel="noopener noreferrer"
    className="
  inline-flex
  items-center
  gap-2

  rounded-full

  border
  border-white/10

  bg-white/[0.02]

  px-3.5
  py-1.5

  text-[11px]
  font-medium

  transition-all
  duration-300

  hover:bg-white/[0.05]

  hover:border-[#1DB954]
  hover:text-[#1DB954]
"
  >

    <FaSpotify size={14} />

    <span>Spotify</span>

  </a>

)}
{artist.youtube && (

  <a
    href={artist.youtube}
    target="_blank"
    rel="noopener noreferrer"
    className="
  inline-flex
  items-center
  gap-2

  rounded-full

  border
  border-white/10

  bg-white/[0.02]

  px-3.5
  py-1.5

  text-[11px]
  font-medium

  transition-all
  duration-300

  hover:bg-white/[0.05]

  hover:border-[#FF0000]
  hover:text-[#FF0000]
"
  >

    <FaYoutube size={14} />

    <span>YouTube</span>

  </a>

)}

    {artist.soundcloud && (

  <a
    href={artist.soundcloud}
    target="_blank"
    rel="noopener noreferrer"
    className="
  inline-flex
  items-center
  gap-2

  rounded-full

  border
  border-white/10

  bg-white/[0.02]

  px-3.5
  py-1.5

  text-[11px]
  font-medium

  transition-all
  duration-300

  hover:bg-white/[0.05]

  hover:border-[#FF5500]
  hover:text-[#FF5500]
"
  >

    <FaSoundcloud size={14} />

    <span>SoundCloud</span>

  </a>

)}

  </div>

</div>
      </div>

      {index !== spotlightArtists.length - 1 && (

        <div
          className="
            mt-6
            mb-6

            border-b
            border-white/10
          "
        />

      )}

    </motion.div>

  ))}

</div>

    </motion.section>

  );

}