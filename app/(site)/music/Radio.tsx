"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, Power, Share2, Shuffle } from "lucide-react";
import { FaSpotify } from "react-icons/fa";

import { shareLink } from "../lib/share";
import { useReducedMotion } from "../lib/device";
import { useMusic } from "./MusicProvider";
import Visualizer from "./Visualizer";

/* ═══════════════════════════════════════════════════════════════
   DARKSIDE RADIO
   Darkside's Pick como una radio: cada tema es una estación del dial
   FM. Se sintoniza arrastrando el dial; entre estaciones suena estática
   (Web Audio) y la portada se ve con ruido. Al acercarse a una
   estación, la estática baja y el tema aparece, cada vez más nítido,
   desde un buen momento de la canción.
   ═══════════════════════════════════════════════════════════════ */

const MIN_FREQ = 87.5;
const MAX_FREQ = 107.9;
const PX_PER_MHZ = 56;
const RULER_WIDTH = (MAX_FREQ - MIN_FREQ) * PX_PER_MHZ;
const LOCK_PX = 8; // sintonía perfecta
const RANGE_PX = 70; // hasta acá se escucha algo de la estación

const stationFreq = (i: number) => 89.1 + i * 2.3;
const freqToX = (f: number) => (f - MIN_FREQ) * PX_PER_MHZ;

export default function Radio() {
  const { tracks, current, isPlaying, getAudioContext, setTrackVolume, tune, toggle, setSheetOpen } = useMusic();
  const reducedMotion = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  const [powered, setPowered] = useState(false);
  const [nearest, setNearest] = useState(0);
  const [dialFreq, setDialFreq] = useState(stationFreq(0));
  const [signal, setSignal] = useState(1);
  const [copied, setCopied] = useState(false);

  /* Estado que se lee en cada cuadro sin re-render */
  const live = useRef({ powered: false, loaded: null as string | null, visible: true, lastUser: 0 });
  const noise = useRef<{ source: AudioBufferSourceNode; gain: GainNode; ctx: AudioContext } | null>(null);

  const stations = useMemo(
    () => tracks.map((track, i) => ({ track, freq: stationFreq(i), x: freqToX(stationFreq(i)) })),
    [tracks]
  );

  /* ── El motor: lee la posición del dial y mezcla estática / tema ── */
  const update = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const x = el.scrollLeft;
    const freq = MIN_FREQ + x / PX_PER_MHZ;
    setDialFreq(Math.round(freq * 10) / 10);

    let index = 0;
    let dist = Infinity;
    stations.forEach((s, i) => {
      const d = Math.abs(s.x - x);
      if (d < dist) {
        dist = d;
        index = i;
      }
    });
    const raw = dist <= LOCK_PX ? 1 : dist >= RANGE_PX ? 0 : 1 - (dist - LOCK_PX) / (RANGE_PX - LOCK_PX);
    const strength = raw * raw * (3 - 2 * raw); // curva suave

    const state = live.current;
    if (state.powered && state.visible) {
      if (strength > 0.3 && state.loaded !== stations[index].track.id) {
        state.loaded = stations[index].track.id;
        tune(state.loaded);
      }
      setTrackVolume(strength);
      if (noise.current) {
        noise.current.gain.gain.setTargetAtTime((1 - strength) * 0.16, noise.current.ctx.currentTime, 0.03);
      }
    }

    setNearest(index);
    setSignal(Math.round(strength * 20) / 20);
  }, [stations, tune, setTrackVolume]);

  /* Posición inicial: la estación del tema actual (o la primera).
     La sección arranca oculta, así que espera a tener ancho. */
  const placed = useRef(false);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (placed.current || !el.clientWidth) return;
      placed.current = true;
      const i = Math.max(0, tracks.findIndex((t) => t.id === current?.id));
      el.scrollLeft = stations[i].x;
      update();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [current?.id, stations, tracks, update]);

  /* Scroll del dial → motor (una vez por cuadro) */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [update]);

  /* Fuera de pantalla: sin estática y el tema a volumen normal (sigue
     sonando con el mini reproductor) */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      live.current.visible = entry.isIntersecting;
      if (!entry.isIntersecting) {
        if (noise.current) noise.current.gain.gain.setTargetAtTime(0, noise.current.ctx.currentTime, 0.05);
        setTrackVolume(1);
      } else update();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [setTrackVolume, update]);

  /* Al salir de la página: apagar la estática y dejar el volumen normal */
  useEffect(
    () => () => {
      noise.current?.source.stop();
      noise.current = null;
      setTrackVolume(1);
    },
    [setTrackVolume]
  );

  /* Si el tema cambia desde afuera (mini reproductor, fin del tema), el
     dial gira solo hasta esa estación */
  useEffect(() => {
    const el = rail.current;
    if (!el || !current || !live.current.powered) return;
    if (performance.now() - live.current.lastUser < 1500) return;
    const s = stations.find((st) => st.track.id === current.id);
    if (s && Math.abs(el.scrollLeft - s.x) > 2) {
      live.current.loaded = current.id;
      el.scrollTo({ left: s.x, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }, [current, stations, reducedMotion]);

  /* ── Encender: arranca el audio y la estática (necesita un toque) ── */
  const powerOn = useCallback(() => {
    if (live.current.powered) return;
    live.current.powered = true;
    setPowered(true);
    const ctx = getAudioContext();
    if (ctx && !noise.current) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.6;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start();
      noise.current = { source, gain, ctx };
    }
    live.current.loaded = null;
    update();
  }, [getAudioContext, update]);

  const powerToggle = () => {
    if (!live.current.powered) return powerOn();
    /* ya encendida: play / pausa del tema sintonizado */
    toggle(stations[nearest].track.id);
  };

  const goTo = (i: number) => {
    const el = rail.current;
    if (!el) return;
    powerOn();
    live.current.lastUser = performance.now();
    const target = (i + stations.length) % stations.length;
    el.scrollTo({ left: stations[target].x, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const surprise = () => {
    let i = nearest;
    while (i === nearest && stations.length > 1) i = Math.floor(Math.random() * stations.length);
    goTo(i);
  };

  /* Arrastrar el dial con el mouse (en celular se desliza con el dedo) */
  const drag = useRef<{ x: number; left: number } | null>(null);

  const station = stations[nearest];
  const tuned = signal > 0.3;
  const onAir = powered && signal >= 0.95 && isPlaying && current?.id === station.track.id;

  const share = async () => {
    const result = await shareLink({
      title: `${station.track.title} — ${station.track.artist}`,
      text: `Sintonizalo en Darkside Radio · ${station.freq.toFixed(1)} FM`,
      path: `/?tema=${station.track.id}#darkside-pick`,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      ref={root}
      onPointerDown={powerOn}
      className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#16161a] to-ds-ink shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
    >
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-10 md:p-8">
        {/* ── La estación: disco con anillo, y estática encima ── */}
        <div className="relative mx-auto aspect-square w-[min(72vw,20rem)] md:order-1">
          {/* el anillo sigue a la señal: sin sintonía, bajo y tembloroso */}
          <Visualizer innerRatio={0.62} level={powered ? signal : 1} />
          <div className="absolute inset-[19%] overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <Image
              key={station.track.id}
              src={station.track.cover}
              alt={tuned ? `${station.track.title} — ${station.track.artist}` : ""}
              fill
              sizes="(max-width: 768px) 46vw, 13rem"
              className={`object-cover transition-opacity duration-300 motion-safe:animate-[spin_18s_linear_infinite] ${onAir ? "" : "[animation-play-state:paused]"}`}
              style={{ filter: `blur(${(1 - signal) * 10}px) grayscale(${1 - signal})`, opacity: 0.25 + signal * 0.75 }}
            />
            {/* Estática visual: ruido que se mueve, más fuerte cuanto peor la señal */}
            <span
              aria-hidden
              className="radio-static absolute inset-0"
              style={{ opacity: powered ? (1 - signal) * 0.9 : 0.35 }}
            />
            <span aria-hidden className="absolute left-1/2 top-1/2 h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black" />
          </div>
        </div>

        {/* ── Pantalla y controles ── */}
        <div className="md:order-2">
          {/* Pantalla tipo radio */}
          <div className="rounded-2xl border border-ds-red/25 bg-black/70 p-4 shadow-[inset_0_0_30px_rgba(229,9,20,0.12)]">
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-baseline gap-2 font-mono text-ds-red-soft [text-shadow:0_0_14px_rgba(229,9,20,0.7)]">
                <span className="text-[clamp(2.6rem,12vw,3.6rem)] font-bold leading-none tabular-nums">
                  {dialFreq.toFixed(1)}
                </span>
                <span className="text-sm">FM</span>
              </p>
              <span
                className={`mt-1 flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  onAir ? "border-ds-red text-white" : "border-white/15 text-white/45"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${onAir ? "bg-ds-red motion-safe:animate-pulse shadow-[0_0_10px_#E50914]" : "bg-white/25"}`} />
                {onAir ? "En vivo" : powered ? (tuned ? "Sintonizando" : "Sin señal") : "Apagada"}
              </span>
            </div>
            <div className="mt-3 min-h-[3.25rem]" aria-live="polite">
              {tuned ? (
                <>
                  <p className="truncate font-display text-xl font-bold uppercase leading-tight">{station.track.title}</p>
                  <p className="truncate text-sm text-white/60">
                    {station.track.artist} · {station.track.genre}
                  </p>
                </>
              ) : (
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Buscando señal…</p>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <button onClick={() => goTo(nearest - 1)} aria-label="Estación anterior" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] active:scale-90 md:hover:bg-white/15">
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={powerToggle}
              aria-label={!powered ? "Encender la radio" : onAir ? "Pausar" : "Reproducir"}
              className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-ds-red text-white shadow-[0_0_40px_rgba(229,9,20,0.55)] transition active:scale-95 md:hover:brightness-110"
            >
              {!powered ? <Power size={28} /> : isPlaying && current?.id === station.track.id ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={() => goTo(nearest + 1)} aria-label="Estación siguiente" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] active:scale-90 md:hover:bg-white/15">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={surprise}
              className="flex min-h-[40px] items-center gap-2 rounded-full border border-ds-red/50 bg-ds-red/10 px-4 font-display text-xs font-bold uppercase tracking-[0.14em] active:scale-95 md:hover:bg-ds-red/25"
            >
              <Shuffle size={14} /> Sorprendeme
            </button>
            <button onClick={share} aria-label="Compartir estación" className="flex h-10 min-w-10 items-center justify-center rounded-full bg-white/[0.06] px-3 text-white/75 md:hover:bg-white/15">
              {copied ? <span className="text-[10px] font-bold uppercase">Copiado</span> : <Share2 size={15} />}
            </button>
            {station.track.spotify && (
              <a
                href={station.track.spotify}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escuchar completo en Spotify"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/75 md:hover:bg-[#1DB954] md:hover:text-black"
              >
                <FaSpotify size={15} />
              </a>
            )}
            <button
              onClick={() => {
                if (current) setSheetOpen(true);
                else toggle(station.track.id);
              }}
              aria-label="Abrir el reproductor completo"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/75 md:hover:bg-white/15"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── El dial ── */}
      <div className="relative border-t border-white/10 bg-black/50 pb-3 pt-2">
        {/* aguja */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[2px] -translate-x-1/2 bg-ds-red shadow-[0_0_12px_#E50914]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[8px] border-x-transparent border-t-ds-red" />
        {/* bordes que se funden */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent" />

        <div
          ref={rail}
          role="slider"
          tabIndex={0}
          aria-label="Dial de la radio: deslizá para sintonizar"
          aria-valuemin={MIN_FREQ}
          aria-valuemax={MAX_FREQ}
          aria-valuenow={Number(station.freq.toFixed(1))}
          aria-valuetext={tuned ? `${station.freq.toFixed(1)} FM, ${station.track.title}` : "Sin señal"}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(nearest + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(nearest - 1);
            }
          }}
          onTouchStart={() => (live.current.lastUser = performance.now())}
          onPointerDown={(e) => {
            live.current.lastUser = performance.now();
            if (e.pointerType === "mouse") {
              drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            live.current.lastUser = performance.now();
            e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
          }}
          onPointerUp={() => (drag.current = null)}
          className="no-scrollbar relative flex cursor-grab snap-x snap-proximity overflow-x-auto outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ds-red/60"
        >
          <span className="w-1/2 shrink-0" />
          <div className="relative h-[5.5rem] shrink-0" style={{ width: RULER_WIDTH }}>
            {/* rayitas cada 0.2 MHz, más largas cada 1 MHz */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-6 h-6"
              style={{
                backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.35) 0 1px, transparent 1px ${PX_PER_MHZ / 5}px)`,
                maskImage: "linear-gradient(to top, #000 40%, transparent)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-6 h-9"
              style={{ backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0 2px, transparent 2px ${PX_PER_MHZ}px)`, backgroundPosition: `${freqToX(88) % PX_PER_MHZ}px 0` }}
            />
            {/* números cada 2 MHz */}
            {Array.from({ length: 11 }, (_, k) => 88 + k * 2).map((f) => (
              <span key={f} aria-hidden className="absolute bottom-0 -translate-x-1/2 font-mono text-[10px] text-white/40" style={{ left: freqToX(f) }}>
                {f}
              </span>
            ))}
            {/* estaciones: la portada sobre el dial */}
            {stations.map((s, i) => (
              <button
                key={s.track.id}
                type="button"
                tabIndex={-1}
                onClick={() => goTo(i)}
                aria-label={`${s.freq.toFixed(1)} FM: ${s.track.title}`}
                className={`absolute top-1 h-9 w-9 -translate-x-1/2 snap-center overflow-hidden rounded-md border transition-transform ${
                  i === nearest && tuned ? "scale-110 border-ds-red" : "border-white/15 opacity-70"
                }`}
                style={{ left: s.x }}
              >
                <Image src={s.track.cover} alt="" fill sizes="36px" className="object-cover" />
              </button>
            ))}
          </div>
          <span className="w-1/2 shrink-0" />
        </div>
        <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          {powered ? "Deslizá el dial para sintonizar" : "Tocá la radio para encenderla"}
        </p>
      </div>
    </div>
  );
}
