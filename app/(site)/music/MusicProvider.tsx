"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { undergroundTracks, type Track } from "../data/discover";

/* ═══════════════════════════════════════════════════════════════
   REPRODUCTOR COMPARTIDO
   Un solo <audio> para todo el sitio: la música sigue sonando al
   bajar por la home o al abrir la ficha de un artista.
   Link directo a un tema: /?tema=<id>
   ═══════════════════════════════════════════════════════════════ */

type MusicContextValue = {
  tracks: Track[];
  current: Track | null;
  isPlaying: boolean;
  audio: React.RefObject<HTMLAudioElement | null>;
  toggle: (id?: string) => void;
  close: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic debe usarse dentro de MusicProvider");
  return ctx;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const current = useMemo(() => undergroundTracks.find((t) => t.id === currentId) ?? null, [currentId]);

  /* Link compartido: deja el tema listo (los navegadores no permiten
     que suene solo; la persona toca play) */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("tema");
    if (id && undergroundTracks.some((t) => t.id === id)) {
      const frame = requestAnimationFrame(() => setCurrentId(id));
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const toggle = useCallback(
    (id?: string) => {
      const el = audio.current;
      if (!el) return;
      const target = id ?? currentId;
      if (!target) return;
      const track = undergroundTracks.find((t) => t.id === target);
      if (!track) return;

      if (target === currentId && el.src) {
        if (el.paused) el.play().catch(() => {});
        else el.pause();
        return;
      }
      el.src = encodeURI(track.preview);
      el.play().catch(() => {});
      setCurrentId(target);
    },
    [currentId]
  );

  const close = useCallback(() => {
    audio.current?.pause();
    setCurrentId(null);
  }, []);

  /* Al terminar un tema pasa al siguiente de la selección */
  const next = useCallback(() => {
    const index = undergroundTracks.findIndex((t) => t.id === currentId);
    const following = undergroundTracks[(index + 1) % undergroundTracks.length];
    if (following) toggle(following.id);
  }, [currentId, toggle]);

  /* Controles en la pantalla de bloqueo del celular */
  useEffect(() => {
    if (!current || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist,
      album: "Darkside's Pick",
      artwork: [{ src: current.cover, sizes: "512x512" }],
    });
    navigator.mediaSession.setActionHandler("play", () => audio.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.current?.pause());
    navigator.mediaSession.setActionHandler("nexttrack", next);
  }, [current, next]);

  const value = useMemo(
    () => ({ tracks: undergroundTracks, current, isPlaying, audio, toggle, close }),
    [current, isPlaying, toggle, close]
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audio}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={next}
      />
    </MusicContext.Provider>
  );
}
