"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./expediente-del-artista.module.css";

/* VSL del Expediente, servido desde el propio sitio (sin YouTube ni Vimeo).
   Hasta que tocan "play" solo se baja la portada: el mp4 (~MB) no se pide
   antes, así la landing carga igual de rápido. Los subtítulos ya vienen
   dentro del video. */
const VIDEO = "/expediente/vsl.mp4";
const PORTADA = "/expediente/vsl-portada.webp";

export default function Vsl() {
  const [play, setPlay] = useState(false);

  return (
    <div className={styles.vsl}>
      {play ? (
        <video
          className={styles.vslVideo}
          src={VIDEO}
          poster={PORTADA}
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
          aria-label="Ver el video del Expediente del Artista (1 minuto)"
        >
          <Image
            src={PORTADA}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 860px"
            className={styles.vslImg}
            priority
          />
          <span className={styles.vslPlay} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.vslTag}>Mirá el video · 1 min</span>
        </button>
      )}
    </div>
  );
}
