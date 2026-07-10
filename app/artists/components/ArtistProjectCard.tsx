"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaSpotify,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa";

import type { Project } from "../../data/artists";

type Props = {
  project: Project;
};

export default function ArtistProjectCard({ project }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#101010]
        hover:border-[#E50914]/50
        transition-all
      "
    >
      {/* ===========================
              Imagen
      =========================== */}

      <div className="relative h-64 bg-black">

        {project.image ? (

          <Image
            src={project.image}
            alt={project.name}
            fill
            className="
              object-cover
              grayscale
              hover:grayscale-0
              hover:scale-105
              transition-all
              duration-700
            "
          />

        ) : (

          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Imagen próximamente
          </div>

        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      </div>

      {/* ===========================
            Información
      =========================== */}

      <div className="p-6">

        <h3 className="text-2xl font-bold uppercase mb-3">
          {project.name}
        </h3>

        {(project.genre || project.country) && (

          <p className="text-sm text-gray-400 mb-5">

            {[project.genre, project.country]
              .filter(Boolean)
              .join(" • ")}

          </p>

        )}

        {project.description && (

          <p className="text-gray-300 leading-7 mb-6">
            {project.description}
          </p>

        )}

        <div className="flex flex-wrap gap-3">

          {project.instagram && (
            <a
              href={project.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#E1306C] transition"
            >
              <FaInstagram />
            </a>
          )}

          {project.spotify && (
            <a
              href={project.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#1DB954] transition"
            >
              <FaSpotify />
            </a>
          )}

          {project.youtube && (
            <a
              href={project.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-600 transition"
            >
              <FaYoutube />
            </a>
          )}

          {project.facebook && (
            <a
              href={project.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 transition"
            >
              <FaFacebookF />
            </a>
          )}

        </div>

      </div>

    </motion.div>
  );
}