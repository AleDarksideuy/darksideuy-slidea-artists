"use client";

import Image from "next/image";
import { Disc3 } from "lucide-react";
import { motion } from "framer-motion";

import type { Artist } from "../data/artists";

type ArtistReleasesProps = {
  artist: Artist;
};

export default function ArtistReleases({
  artist,
}: ArtistReleasesProps) {
  if (!artist.releases?.length) return null;

  return (
    <section className="px-10 lg:px-20 py-14 border-t border-white/10">

      {/* Título */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="uppercase tracking-[0.35em] text-xs text-neutral-500">
            Música
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Releases
          </h2>

        </div>

      </div>

      {/* Carrusel */}

      <div
        className="
          flex
          gap-6
          overflow-x-auto
          pb-4
          scrollbar-hide
        "
      >

        {artist.releases.map((release, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .45 }}
            viewport={{ once: true }}
            className="
              shrink-0
              w-[280px]
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              bg-[#111]
            "
          >

            {/* Cover */}

            <div className="relative aspect-square bg-neutral-900">

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
                    size={60}
                    className="text-white/15"
                  />

                </div>

              )}

            </div>

            {/* Info */}

            <div className="p-6">

              <span
                className="
                  inline-block
                  mb-3
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  text-neutral-500
                "
              >
                {release.type}
              </span>

              <h3 className="text-2xl font-bold leading-tight">

                {release.title}

              </h3>

              {release.description && (

                <p className="mt-4 text-neutral-400 text-sm leading-7">

                  {release.description}

                </p>

              )}

              <div className="mt-6 flex items-center justify-between">

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    text-xs
                  "
                >
                  {release.status}
                </span>

                {release.releaseDate && (

                  <span className="text-xs text-neutral-500">

                    {release.releaseDate}

                  </span>

                )}

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}