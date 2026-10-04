"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { undergroundTracks, type Track } from "../data/discover";

/* ═══════════════════════════════════════════════════════════════
   REPRODUCTOR COMPARTIDO
   Un solo <audio> para todo el sitio: la música sigue sonando al
   bajar por la home o al abrir la ficha de un artista.
   Además analiza el audio (Web Audio) para las barras que reaccionan
   a la música en el Darkside Player.
   Link directo a un tema: /?tema=<id>
   ═══════════════════════════════════════════════════════════════ */

type MusicContextValue = {
  tracks: Track[];
  current: Track | null;
  isPlaying: boolean;
  audio: React.RefObject<HTMLAudioElement | null>;
  /* Analizador de frecuencias (null hasta el primer play, o si el navegador no lo permite) */
  analyser: React.RefObject<AnalyserNode | null>;
  /* Para Darkside Radio: contexto de audio (estática), volumen del tema
     y sintonizar un tema desde un buen momento (no desde la intro) */
  getAudioContext: () => AudioContext | null;
  setTrackVolume: (volume: number) => void;
  tune: (id: string) => void;
  /* Reproductor a pantalla completa (desde el mini reproductor) */
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  toggle: (id?: string) => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
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
  const analyser = useRef<AnalyserNode | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const trackGain = useRef<GainNode | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  /* El análisis de audio se arma en el primer toque (los navegadores lo
     exigen). Si falla, la música suena igual y las barras se simulan. */
  const ensureAnalyser = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    try {
      if (!audioCtx.current) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(el);
        const gain = ctx.createGain();
        const node = ctx.createAnalyser();
        node.fftSize = 256;
        node.smoothingTimeConstant = 0.78;
        source.connect(gain);
        gain.connect(node);
        node.connect(ctx.destination);
        audioCtx.current = ctx;
        analyser.current = node;
        trackGain.current = gain;
      }
      if (audioCtx.current.state === "suspended") audioCtx.current.resume().catch(() => {});
    } catch {
      analyser.current = null;
    }
  }, []);

  const toggle = useCallback(
    (id?: string) => {
      const el = audio.current;
      if (!el) return;
      const target = id ?? currentId ?? undergroundTracks[0]?.id;
      if (!target) return;
      const track = undergroundTracks.find((t) => t.id === target);
      if (!track) return;
      ensureAnalyser();

      if (target === currentId && el.src) {
        if (el.paused) el.play().catch(() => {});
        else el.pause();
        return;
      }
      el.src = encodeURI(track.preview);
      el.play().catch(() => {});
      setCurrentId(target);
    },
    [currentId, ensureAnalyser]
  );

  /* Cambiar de tema: si ya sonaba algo, el nuevo arranca solo */
  const step = useCallback(
    (dir: number) => {
      const index = undergroundTracks.findIndex((t) => t.id === currentId);
      const target = undergroundTracks[(index + dir + undergroundTracks.length) % undergroundTracks.length];
      if (!target) return;
      const el = audio.current;
      if (!currentId || !el?.src) {
        setCurrentId(target.id);
        return;
      }
      ensureAnalyser();
      el.src = encodeURI(target.preview);
      el.play().catch(() => {});
      setCurrentId(target.id);
    },
    [currentId, ensureAnalyser]
  );

  const next = useCallback(() => step(1), [step]);

  /* Anterior: si ya pasaron unos segundos, vuelve al principio del tema */
  const prev = useCallback(() => {
    const el = audio.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    step(-1);
  }, [step]);

  const seek = useCallback((seconds: number) => {
    const el = audio.current;
    if (el && Number.isFinite(seconds)) el.currentTime = Math.max(0, Math.min(seconds, el.duration || seconds));
  }, []);

  const getAudioContext = useCallback(() => {
    ensureAnalyser();
    return audioCtx.current;
  }, [ensureAnalyser]);

  /* Volumen del tema (la radio lo mezcla con la estática). En iPhone el
     volumen del <audio> no se puede cambiar, por eso va por el contexto. */
  const setTrackVolume = useCallback((volume: number) => {
    const v = Math.max(0, Math.min(1, volume));
    const gain = trackGain.current;
    if (gain && audioCtx.current) gain.gain.setTargetAtTime(v, audioCtx.current.currentTime, 0.04);
    else if (audio.current) audio.current.volume = v;
  }, []);

  /* Sintonizar: el tema arranca en un buen momento (no en la intro) */
  const tune = useCallback(
    (id: string) => {
      const el = audio.current;
      const track = undergroundTracks.find((t) => t.id === id);
      if (!el || !track) return;
      ensureAnalyser();
      if (id === currentId && el.src) {
        if (el.paused) el.play().catch(() => {});
        return;
      }
      el.src = encodeURI(track.preview);
      el.addEventListener(
        "loadedmetadata",
        () => {
          if (Number.isFinite(el.duration)) el.currentTime = Math.min(45, el.duration * 0.3);
        },
        { once: true }
      );
      el.play().catch(() => {});
      setCurrentId(id);
    },
    [currentId, ensureAnalyser]
  );

  const close = useCallback(() => {
    audio.current?.pause();
    setSheetOpen(false);
    setCurrentId(null);
  }, []);

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
    navigator.mediaSession.setActionHandler("previoustrack", prev);
  }, [current, next, prev]);

  const value = useMemo(
    () => ({
      tracks: undergroundTracks,
      current,
      isPlaying,
      audio,
      analyser,
      sheetOpen,
      setSheetOpen,
      getAudioContext,
      setTrackVolume,
      tune,
      toggle,
      next,
      prev,
      seek,
      close,
    }),
    [current, isPlaying, sheetOpen, getAudioContext, setTrackVolume, tune, toggle, next, prev, seek, close]
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
