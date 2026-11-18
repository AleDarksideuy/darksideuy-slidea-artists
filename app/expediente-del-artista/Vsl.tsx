"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./expediente-del-artista.module.css";

/* Video servido desde el propio sitio (sin YouTube ni Vimeo).
   Hasta que tocan "play" solo se baja la portada: el mp4 no se pide
   antes, así la landing carga igual de rápido. Los subtítulos ya vienen
   dentro del video. Por defecto es el VSL de arriba; el Loom pasa los suyos. */
type Props = {
  video?: string;
  portada?: string;
  etiqueta?: string;
  descripcion?: string;
  prioridad?: boolean;
};

export default function Vsl({
  video = "/expediente/vsl.mp4",
  portada = "/expediente/vsl-portada.webp",
  etiqueta = "Mirá el video · 1 min",
  descripcion = "Ver el video del Expediente del Artista (1 minuto)",
  prioridad = true,
}: Props) {
  const [play, setPlay] = useState(false);

  return (
    <div className={styles.vsl}>
      {play ? (
        <video
          className={styles.vslVideo}
          src={video}
          poster={portada}
          controls
          autoPlay
          playsInline
          preload="auto"
        >
          Tu navegador no puede reproducir este video.
        </video>
      ) : (
        <button
          type="button"
          className={styles.vslFacade}
          onClick={() => setPlay(true)}
          aria-label={descripcion}
        >
          <Image
            src={portada}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 860px"
            className={styles.vslImg}
            priority={prioridad}
          />
          <span className={styles.vslPlay} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.vslTag}>{etiqueta}</span>
        </button>
      )}
    </div>
  );
}
