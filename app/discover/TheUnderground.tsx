"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

import { undergroundTracks } from "../data/discover";

function PlayingBars() {

  return (

    <div
      className="
        flex
        items-end
        gap-[3px]
        h-5
      "
    >

      {[
        [6, 16, 9, 18, 6],
        [14, 8, 17, 10, 14],
        [10, 18, 7, 15, 10],
        [18, 9, 15, 6, 18],
      ].map((frames, index) => (

        <motion.div
          key={index}
          animate={{
            height: frames,
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: index * 0.15,
          }}
          className="
            w-[3px]
            rounded-full
            bg-gradient-to-t
            from-[#E50914]
            via-red-500
            to-white
          "
        />

      ))}

    </div>

  );

}

export default function TheUnderground() {

  /* =======================================================
                          STATES
  ======================================================= */

  const [currentTrack, setCurrentTrack] = useState(
    undergroundTracks[0]
  );

 const [isPlaying, setIsPlaying] = useState(false);

const [currentTime, setCurrentTime] = useState(0);

const [duration, setDuration] = useState(0);

const audioRef = useRef<HTMLAudioElement>(null);
  /* =======================================================
                      PLAY / PAUSE
  ======================================================= */

  const togglePreview = () => {

    if (!audioRef.current) return;

    if (isPlaying) {

      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      setIsPlaying(false);

    } else {

      audioRef.current.play();

      setIsPlaying(true);

    }

  };

  /* =======================================================
                      CHANGE TRACK
  ======================================================= */

  const changeTrack = (
    track: typeof undergroundTracks[number]
  ) => {

    if (!audioRef.current) return;

    const wasPlaying = isPlaying;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setCurrentTrack(track);

    setIsPlaying(false);

    requestAnimationFrame(() => {

      if (!audioRef.current) return;

      audioRef.current.load();

      if (wasPlaying) {

        audioRef.current.play();

        setIsPlaying(true);

      }

    });

  };

  /* =======================================================
                          COMPONENT
  ======================================================= */

  return (

    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .6 }}
      className="
        relative
        
        lg:col-span-7
        
        overflow-hidden
        
        rounded-[32px]

        border
        border-white/10

        bg-[#0b0b0b]

        p-6
        md:p-8
        xl:p-10
      "
    >
<audio
  ref={audioRef}
  src={currentTrack.preview}

  onLoadedMetadata={() => {

    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);

  }}

  onTimeUpdate={() => {

    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);

  }}

  onEnded={() => {

    setIsPlaying(false);

    setCurrentTime(0);

  }}
/>
      {/* =======================================================
                    DYNAMIC BACKGROUND
      ======================================================= */}

      <motion.div
        key={currentTrack.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="
          absolute
          inset-0
          pointer-events-none
        "
      >

        <Image
          src={currentTrack.cover}
          alt={currentTrack.title}
          fill
          priority
          className="
            object-cover

            scale-125

            blur-[80px]

            opacity-20
          "
        />

      </motion.div>
      

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
        Darkside's Pick
      </h2>

      <p
        className="
          mt-6
          max-w-xl

          text-gray-400
          leading-8
        "
      >
        Descubre música de artistas emergentes seleccionado por Darkside.
      </p>

     
           {/* =======================================================
                        FEATURED TRACK
      ======================================================= */}

      <div
        className="
          mt-18

          flex
          flex-col
          lg:flex-row

          items-center
          lg:items-center

          gap-10
        "
      >

        {/* COVER */}

        <div
          onClick={togglePreview}
          className="
            relative

            w-44
            h-44

            rounded-3xl
            overflow-hidden

            bg-neutral-900

            shrink-0

            cursor-pointer
            group
          "
        >

          <Image
            src={currentTrack.cover}
            alt={currentTrack.title}
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-110
            "
          />

          <div
            className="
              absolute
              inset-0

              bg-black/45

              opacity-0
              group-hover:opacity-100

              transition-opacity

              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                w-16
                h-16

                rounded-full

                bg-white

                flex
                items-center
                justify-center
              "
            >

              {isPlaying ? (

                <Pause
                  size={28}
                  className="text-black"
                  fill="currentColor"
                />

              ) : (

                <Play
                  size={28}
                  className="text-black ml-[3px]"
                  fill="currentColor"
                />

              )}

            </div>

          </div>

        </div>

        {/* INFO */}

        <div
          className="
             w-full
              lg:flex-1

              flex
               flex-col

               items-center
               lg:items-start

               text-center
              lg:text-left
          "
        >

          <p
            className="
              uppercase
              tracking-[0.25em]
              text-xs
              text-gray-500
            "
          >
            Now Featured
          </p>

          <h3
            className="
              mt-4

              text-4xl
              xl:text-5xl

              font-bold
              leading-tight
            "
          >
            {currentTrack.title}
          </h3>

          <p
            className="
              mt-3

              text-xl

              text-gray-300
            "
          >
            {currentTrack.artist}
          </p>

          <div
  className="
    flex
    items-center
    gap-3

    mt-5

    text-sm
    text-gray-500
  "
>

  <span>{currentTrack.genre}</span>

  <span>•</span>

  <span>{currentTrack.duration}</span>

</div>

{/* =======================================================
                    PROGRESS BAR
======================================================= */}

<div className="mt-7 w-full">

  <div
    className="
      w-full
      h-[5px]
      rounded-full
      bg-white/10
      overflow-hidden
    "
  >

    <div
      className="
        h-full
        bg-[#E50914]
        transition-[width]
        duration-150
      "
      style={{
        width:
          duration > 0
            ? `${(currentTime / duration) * 100}%`
            : "0%",
      }}
    />

  </div>

  <div
    className="
      mt-3

      flex
      justify-between

      text-xs
      text-gray-500
    "
  >

    <span>
      {Math.floor(currentTime / 60)}:
      {String(Math.floor(currentTime % 60)).padStart(2, "0")}
    </span>

    <span>
      {Math.floor(duration / 60)}:
      {String(Math.floor(duration % 60)).padStart(2, "0")}
    </span>

  </div>

</div>

          <button
            onClick={togglePreview}
            className="
              mt-8

              inline-flex
              items-center
              gap-3

              px-6
              py-3

              rounded-full

              bg-[#E50914]

              hover:bg-[#ff1f2d]

              transition
            "
          >

            {isPlaying ? (

  <PlayingBars />

) : (

  <Play
    size={18}
    fill="currentColor"
  />

)}

            <span className="font-semibold">

              {isPlaying
                ? "Stop Preview"
                : "Play Preview"}

            </span>

          </button>

        </div>

      </div>
              {/* =======================================================
                    SONG CAROUSEL
      ======================================================= */}

      <div className="mt-30">

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <h4
            className="
              uppercase
              tracking-[0.25em]
              text-sm
              text-gray-500
            "
          >
            More Discoveries
          </h4>

          <span className="text-sm text-gray-500">
            {undergroundTracks.length} Tracks
          </span>

        </div>

        <div
          className="
            flex
            gap-5
            overflow-x-auto
            pb-3
            pr-2
            scrollbar-hide
          "
        >

          {undergroundTracks.map((track) => (

            <button
              key={track.id}
              onClick={() => changeTrack(track)}
              className="
                shrink-0
                w-[120px]
                text-left
                group
              "
            >

              <div
                className={`
                  rounded-2xl
                  p-[2px]
                  transition-all
                  duration-300

                  ${
                    currentTrack.id === track.id
                      ? "bg-[#E50914]"
                      : "bg-transparent"
                  }
                `}
              >

                <div
                  className="
                    relative

                    w-[116px]
                    h-[116px]

                    rounded-[14px]
                    overflow-hidden

                    bg-neutral-900
                  "
                >

                  <Image
                    src={track.cover}
                    alt={track.title}
                    fill
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                </div>

              </div>

              <h5
                className="
                  mt-3
                  text-sm
                  font-semibold
                  truncate
                "
              >
                {track.title}
              </h5>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  truncate
                "
              >
                {track.artist}
              </p>

            </button>

          ))}

        </div>

      </div>

    </motion.section>

  );

}