"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play, Share2, SkipBack, SkipForward } from "lucide-react";
import { FaSpotify, FaYoutube } from "react-icons/fa";

import { shareLink } from "../lib/share";
import { useMusic } from "./MusicProvider";
import Visualizer from "./Visualizer";

/* ═══════════════════════════════════════════════════════════════
   DARKSIDE PLAYER
   Reproductor con estilo de app: la portada como un disco que gira,
   el anillo que reacciona a la música, barra de progreso arrastrable,
   anterior / play / siguiente y la lista de Darkside's Pick.
   Deslizar el disco a los costados cambia de tema.
   Se usa en la sección Música y a pantalla completa (desde el mini
   reproductor).
   ═══════════════════════════════════════════════════════════════ */

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* "2:19" → 139 (duración conocida antes de cargar el audio) */
function parseDuration(text: string) {
  const [m, s] = text.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

export default function Player({ mode = "inline" }: { mode?: "inline" | "sheet" }) {
  const { tracks, current, isPlaying, toggle, next, prev } = useMusic();
  const track = current ?? tracks[0];
  const index = tracks.findIndex((t) => t.id === track.id);
  const loaded = current !== null;
  const playing = isPlaying && loaded;
  const [copied, setCopied] = useState(false);

  /* Deslizar el disco: izquierda = siguiente, derecha = anterior */
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);

  const share = async () => {
    const result = await shareLink({
      title: `${track.title} — ${track.artist}`,
      text: "Escuchalo en Darkside's Pick",
      path: `/?tema=${track.id}#darkside-pick`,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const isSheet = mode === "sheet";

  return (
    <div className={`grid gap-6 ${isSheet ? "" : "md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-8"}`}>
      {/* ── El reproductor ── */}
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-ds-ink">
        {/* Fondo: la portada difuminada, como en las apps */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image key={track.id} src={track.cover} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="scale-150 object-cover opacity-80 blur-2xl saturate-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-black/85" />
        </div>

        <div className="flex flex-col items-center px-5 pb-6 pt-5 md:px-8 md:pb-8">
          {/* Cabecera */}
          <div className="flex w-full items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
              Darkside&apos;s Pick · {String(index + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}
            </p>
            <button
              onClick={share}
              aria-label="Compartir tema"
              className="flex h-10 min-w-10 items-center justify-center rounded-full bg-white/10 px-3 text-white/80 active:scale-95 md:hover:bg-white/20"
            >
              {copied ? <span className="text-[10px] font-bold uppercase">Copiado</span> : <Share2 size={16} />}
            </button>
          </div>

          {/* El disco con el anillo */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`${playing ? "Pausar" : "Reproducir"} ${track.title}. Deslizá para cambiar de tema`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(track.id);
              } else if (e.key === "ArrowRight") next();
              else if (e.key === "ArrowLeft") prev();
            }}
            className="relative mt-4 aspect-square w-[min(78vw,22rem)] cursor-pointer touch-pan-y select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ds-red"
            onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
            onPointerMove={(e) => {
              if (!swipe.current) return;
              const dx = e.clientX - swipe.current.x;
              if (Math.abs(dx) > Math.abs(e.clientY - swipe.current.y)) setDragX(Math.max(-90, Math.min(90, dx)));
            }}
            onPointerUp={(e) => {
              const start = swipe.current;
              if (dragX < -50) next();
              else if (dragX > 50) prev();
              /* toque sin arrastrar: play / pausa */
              else if (start && Math.abs(e.clientX - start.x) < 6 && Math.abs(e.clientY - start.y) < 6) toggle(track.id);
              swipe.current = null;
              setDragX(0);
            }}
            onPointerCancel={() => {
              swipe.current = null;
              setDragX(0);
            }}
          >
            <Visualizer innerRatio={0.62} />
            <div
              className="absolute inset-[19%] transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${dragX}px) rotate(${dragX / 6}deg)` }}
            >
              <div
                key={track.id}
                className={`relative h-full w-full overflow-hidden rounded-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] motion-safe:animate-[spin_18s_linear_infinite] ${
                  playing ? "" : "[animation-play-state:paused]"
                }`}
              >
                <Image src={track.cover} alt={`${track.title} — ${track.artist}`} fill sizes="(max-width: 768px) 62vw, 22rem" className="object-cover" />
                {/* surcos y agujero de vinilo sobre la portada */}
                <span aria-hidden className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,transparent_0_6px,rgba(0,0,0,0.12)_6px_7px)]" />
                <span aria-hidden className="absolute left-1/2 top-1/2 h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black" />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="mt-4 w-full text-center" aria-live="polite">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ds-red-soft">
              {track.genre} · {track.duration}
            </p>
            <p className="mt-1 truncate font-display text-[clamp(1.6rem,7vw,2.4rem)] font-bold uppercase leading-tight">{track.title}</p>
            <p className="truncate text-sm text-white/65">{track.artist}</p>
          </div>

          {/* Progreso */}
          <SeekBar fallbackDuration={parseDuration(track.duration)} enabled={loaded} />

          {/* Controles */}
          <div className="mt-2 flex items-center justify-center gap-6">
            <button onClick={prev} aria-label="Tema anterior" className="flex h-14 w-14 items-center justify-center rounded-full text-white/85 active:scale-90 md:hover:bg-white/10">
              <SkipBack size={26} fill="currentColor" />
            </button>
            <button
              onClick={() => toggle(track.id)}
              aria-label={playing ? "Pausar" : "Reproducir"}
              className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-ds-red text-white shadow-[0_0_40px_rgba(229,9,20,0.55)] transition active:scale-95 md:hover:brightness-110"
            >
              {playing ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={next} aria-label="Tema siguiente" className="flex h-14 w-14 items-center justify-center rounded-full text-white/85 active:scale-90 md:hover:bg-white/10">
              <SkipForward size={26} fill="currentColor" />
            </button>
          </div>

          {/* Escucharlo completo */}
          {(track.spotify || track.youtube) && (
            <div className="mt-4 flex gap-2">
              {track.spotify && (
                <a
                  href={track.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[40px] items-center gap-2 rounded-full bg-white/10 px-4 text-xs font-semibold md:hover:bg-[#1DB954] md:hover:text-black"
                >
                  <FaSpotify size={15} /> Completo en Spotify
                </a>
              )}
              {track.youtube && (
                <a
                  href={track.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver en YouTube"
                  className="flex min-h-[40px] items-center gap-2 rounded-full bg-white/10 px-4 text-xs font-semibold md:hover:bg-ds-red"
                >
                  <FaYoutube size={15} /> YouTube
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── La lista ── */}
      <Queue />
    </div>
  );
}

/* Barra de progreso: se arrastra con el dedo o el mouse, y con las
   flechas del teclado (±5 s). Se actualiza sin re-renders. */
function SeekBar({ fallbackDuration, enabled }: { fallbackDuration: number; enabled: boolean }) {
  const { audio, seek } = useMusic();
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const elapsed = useRef<HTMLSpanElement>(null);
  const remaining = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);
  const [, force] = useState(0);

  const paint = (ratio: number, duration: number) => {
    const r = Math.max(0, Math.min(1, ratio));
    if (fill.current) fill.current.style.transform = `scaleX(${r})`;
    if (thumb.current) thumb.current.style.left = `${r * 100}%`;
    if (elapsed.current) elapsed.current.textContent = formatTime(r * duration);
    if (remaining.current) remaining.current.textContent = `-${formatTime(duration - r * duration)}`;
  };

  useEffect(() => {
    const el = audio.current;
    let frame = 0;
    const loop = () => {
      const duration = el?.duration && Number.isFinite(el.duration) ? el.duration : fallbackDuration;
      if (!dragging.current) paint(enabled && el ? el.currentTime / duration : 0, duration);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [audio, enabled, fallbackDuration]);

  const ratioAt = (clientX: number) => {
    const rect = track.current!.getBoundingClientRect();
    return (clientX - rect.left) / rect.width;
  };
  const duration = () => {
    const el = audio.current;
    return el?.duration && Number.isFinite(el.duration) ? el.duration : fallbackDuration;
  };

  return (
    <div className="mt-4 w-full">
      <div
        ref={track}
        role="slider"
        tabIndex={enabled ? 0 : -1}
        aria-label="Progreso del tema"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration())}
        aria-valuenow={Math.round(audio.current?.currentTime ?? 0)}
        aria-disabled={!enabled}
        onKeyDown={(e) => {
          if (!enabled) return;
          const now = audio.current?.currentTime ?? 0;
          if (e.key === "ArrowRight") seek(now + 5);
          if (e.key === "ArrowLeft") seek(now - 5);
          force((n) => n + 1);
        }}
        onPointerDown={(e) => {
          if (!enabled) return;
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          paint(ratioAt(e.clientX), duration());
        }}
        onPointerMove={(e) => dragging.current && paint(ratioAt(e.clientX), duration())}
        onPointerUp={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          seek(Math.max(0, Math.min(1, ratioAt(e.clientX))) * duration());
        }}
        onPointerCancel={() => (dragging.current = false)}
        className={`group relative flex h-6 touch-none items-center outline-none ${enabled ? "cursor-pointer" : "opacity-50"}`}
      >
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div ref={fill} className="absolute inset-0 origin-left scale-x-0 rounded-full bg-gradient-to-r from-ds-red to-ds-red-soft" />
        </div>
        <div
          ref={thumb}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(229,9,20,0.8)] transition-transform group-focus-visible:scale-125 md:scale-0 md:group-hover:scale-100"
          style={{ left: "0%" }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] tabular-nums text-white/55">
        <span ref={elapsed}>0:00</span>
        <span ref={remaining}>-{formatTime(fallbackDuration)}</span>
      </div>
    </div>
  );
}

/* La lista de Darkside's Pick: tocar un tema lo pone */
function Queue() {
  const { tracks, current, isPlaying, toggle } = useMusic();
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-3 md:p-4">
      <p className="px-2 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
        La selección · {tracks.length} temas
      </p>
      <ol>
        {tracks.map((t, i) => {
          const on = current?.id === t.id;
          const sounding = on && isPlaying;
          return (
            <li key={t.id}>
              <button
                onClick={() => toggle(t.id)}
                aria-current={on ? "true" : undefined}
                aria-label={`${sounding ? "Pausar" : "Escuchar"} ${t.title} de ${t.artist}`}
                className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors ${
                  on ? "bg-white/[0.08]" : "active:bg-white/[0.05] md:hover:bg-white/[0.05]"
                }`}
              >
                <span className="flex w-6 shrink-0 justify-center font-mono text-[11px] text-white/40">
                  {sounding ? <Equalizer /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                  <Image src={t.cover} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm font-semibold ${on ? "text-ds-red-soft" : ""}`}>{t.title}</span>
                  <span className="block truncate text-xs text-white/50">{t.artist}</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-white/40">{t.duration}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Equalizer() {
  return (
    <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
      {[0, 0.2, 0.4].map((d) => (
        <span key={d} className="eq-bar block h-full w-[3px] rounded-full bg-ds-red" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}
