"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";

import { artists } from "../(site)/data/artists";
import { undergroundTracks } from "../(site)/data/discover";
import ArtistOverlay from "../(site)/artists/ArtistOverlay";
import { input, isMoveKey, player } from "./_game/input";
import { hasWebGL } from "./_game/quality";
import {
  findStation,
  spawnPoint,
  stationSpot,
  zones,
  type Card,
  type SectionId,
  type Station,
  type ZoneId,
} from "./_game/zones";
import InfoCard from "./_hud/InfoCard";
import Joystick from "./_hud/Joystick";
import MapPanel from "./_hud/MapPanel";
import MiniPlayer from "./_hud/MiniPlayer";
import SectionPanel from "./_hud/SectionPanel";

/* El mundo 3D solo existe en el navegador y se descarga aparte */
const World = dynamic(() => import("./_game/World"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-sm tracking-[0.3em] text-white/50">
      CARGANDO MUNDO…
    </div>
  ),
});

const BASE_PATH = "/experiencia";
const FADE_MS = 280;

type Overlay =
  | { type: "artist"; slug: string }
  | { type: "card"; card: Card }
  | { type: "section"; section: SectionId }
  | { type: "map" }
  | null;

/* La URL siempre refleja dónde estás, para poder compartirla */
function urlFor(zone: ZoneId, artist?: string) {
  if (artist) return `${BASE_PATH}?artista=${artist}`;
  return zone === "lobby" ? BASE_PATH : `${BASE_PATH}?zona=${zone}`;
}

function placeAt(zone: ZoneId, stationId: string | null, from: ZoneId | null) {
  const station = stationId ? findStation(zone, stationId) : null;
  const [x, z] = station ? stationSpot(station) : spawnPoint(zone, from);
  player.x = x;
  player.z = z;
  input.target = null;
}

const noopSubscribe = () => () => {};

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

type ExperienciaProps = {
  initialZone: ZoneId | null;
  initialArtist: string | null;
};

export default function Experiencia({ initialZone, initialArtist }: ExperienciaProps) {
  const startZone: ZoneId = initialArtist ? "artistas" : (initialZone ?? "lobby");

  /* Con link directo se entra sin pantalla de inicio */
  const [started, setStarted] = useState(initialZone !== null || initialArtist !== null);
  const [zone, setZone] = useState<ZoneId>(startZone);
  const [nearId, setNearId] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(
    initialArtist ? { type: "artist", slug: initialArtist } : null
  );
  const [fading, setFading] = useState(false);

  const isTouch = useMedia("(pointer: coarse)");
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => true);

  /* ───────── Música ───────── */
  const audio = useRef<HTMLAudioElement | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pauseMusic = useCallback(() => {
    audio.current?.pause();
  }, []);

  const toggleTrack = useCallback((id: string) => {
    const track = undergroundTracks.find((t) => t.id === id);
    if (!track) return;

    if (!audio.current) {
      audio.current = new Audio();
      audio.current.preload = "none";
      audio.current.addEventListener("play", () => setIsPlaying(true));
      audio.current.addEventListener("pause", () => setIsPlaying(false));
      audio.current.addEventListener("ended", () => setIsPlaying(false));
    }
    const el = audio.current;

    if (el.dataset.track === id) {
      if (el.paused) el.play().catch(() => {});
      else el.pause();
      return;
    }
    el.dataset.track = id;
    el.src = encodeURI(track.preview);
    el.play().catch(() => {});
    setTrackId(id);
  }, []);

  const stopMusic = useCallback(() => {
    if (audio.current) {
      audio.current.pause();
      audio.current.removeAttribute("src");
      delete audio.current.dataset.track;
    }
    setTrackId(null);
  }, []);

  useEffect(() => {
    const onVisibility = () => document.hidden && pauseMusic();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      audio.current?.pause();
    };
  }, [pauseMusic]);

  /* ───────── Posición inicial ───────── */
  const initialPlacement = useRef({ zone: startZone, artist: initialArtist });
  useLayoutEffect(() => {
    const { zone: z, artist } = initialPlacement.current;
    placeAt(z, artist, null);
  }, []);

  useEffect(() => {
    input.frozen = !started || overlay !== null || fading;
  }, [started, overlay, fading]);

  /* ───────── Viajes entre zonas ───────── */
  const zoneRef = useRef(zone);
  useEffect(() => {
    zoneRef.current = zone;
  }, [zone]);

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  const travel = useCallback((to: ZoneId, stationId: string | null = null, then: Overlay = null) => {
    const from = zoneRef.current;
    const finish = () => {
      setOverlay(then);
      window.history.replaceState(null, "", urlFor(to, then?.type === "artist" ? then.slug : undefined));
    };

    if (from === to) {
      if (stationId) placeAt(to, stationId, from);
      finish();
      return;
    }

    setOverlay(null);
    setFading(true);
    clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      placeAt(to, stationId, from);
      zoneRef.current = to;
      setNearId(null);
      setZone(to);
      finish();
      setFading(false);
    }, FADE_MS);
  }, []);

  /* ───────── Interacción ───────── */
  const openArtist = useCallback((slug: string) => {
    setOverlay({ type: "artist", slug });
    window.history.replaceState(null, "", urlFor("artistas", slug));
  }, []);

  const openSection = useCallback(
    (section: SectionId) => {
      pauseMusic();
      setOverlay({ type: "section", section });
    },
    [pauseMusic]
  );

  const closeOverlay = useCallback(() => {
    setOverlay(null);
    window.history.replaceState(null, "", urlFor(zoneRef.current));
  }, []);

  const interact = useCallback(
    (station: Station) => {
      const { action } = station;
      switch (action.type) {
        case "artist":
          openArtist(action.slug);
          break;
        case "card":
          setOverlay({ type: "card", card: action.card });
          break;
        case "section":
          openSection(action.section);
          break;
        case "track":
          toggleTrack(action.trackId);
          break;
        case "portal":
          travel(action.zone);
          break;
      }
    },
    [openArtist, openSection, toggleTrack, travel]
  );

  /* ───────── Teclado ───────── */
  const nearRef = useRef(nearId);
  const overlayRef = useRef(overlay);
  const startedRef = useRef(started);
  useEffect(() => {
    nearRef.current = nearId;
    overlayRef.current = overlay;
    startedRef.current = started;
  }, [nearId, overlay, started]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        if (overlayRef.current) closeOverlay();
        return;
      }
      if (overlayRef.current || !startedRef.current) return;

      if (isMoveKey(e.code)) {
        e.preventDefault();
        input.keys.add(e.code);
      } else if (e.code === "KeyM") {
        setOverlay({ type: "map" });
      } else if (["KeyE", "Enter", "Space"].includes(e.code) && nearRef.current) {
        e.preventDefault();
        const station = findStation(zoneRef.current, nearRef.current);
        if (station) interact(station);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => input.keys.delete(e.code);
    const onBlur = () => input.keys.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      input.keys.clear();
    };
  }, [closeOverlay, interact]);

  /* ───────── Render ───────── */
  if (!webgl) return <NoWebGL />;

  const currentZone = zones[zone];
  const nearStation = nearId ? findStation(zone, nearId) : null;
  const openedArtist =
    overlay?.type === "artist" ? (artists.find((a) => a.slug === overlay.slug) ?? null) : null;
  const playingTrack = trackId ? (undergroundTracks.find((t) => t.id === trackId) ?? null) : null;
  /* Paneles que tapan la pantalla: el 3D se congela mientras están abiertos */
  const paused = overlay?.type === "section" || overlay?.type === "artist" || overlay?.type === "map";

  return (
    <main className="relative h-dvh w-full select-none overflow-hidden bg-black">
      <World
        zoneId={zone}
        activeId={nearId}
        playingId={isPlaying ? trackId : null}
        paused={paused}
        onNear={setNearId}
        onSelect={interact}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />

      {/* Fundido al cruzar un portal */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-30 bg-black transition-opacity duration-300 ${
          fading ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ─────────── Barra superior ─────────── */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
        <Link href="/" aria-label="Darkside UY — inicio">
          <Image src="/Darksideuy.png" alt="Darkside UY" width={1817} height={394} className="h-6 w-auto md:h-8" priority />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOverlay({ type: "map" })}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 font-mono text-xs tracking-widest hover:border-[#E50914]"
          >
            <MapIcon size={14} /> MAPA
          </button>
          <Link
            href="/"
            className="hidden rounded-full border border-white/15 bg-black/70 px-4 py-2 font-mono text-xs tracking-widest text-white/70 hover:text-white sm:block"
          >
            VERSIÓN CLÁSICA
          </Link>
        </div>
      </header>

      {started && (
        <div className="pointer-events-none absolute left-4 top-16 z-10 font-mono md:left-8 md:top-20">
          <p className="text-[10px] tracking-[0.35em] text-[#E50914]">{currentZone.kicker.toUpperCase()}</p>
          <p className="text-sm font-bold tracking-[0.2em]">{currentZone.title.toUpperCase()}</p>
        </div>
      )}

      {started && !isTouch && (
        <p className="pointer-events-none absolute bottom-5 left-8 z-10 hidden font-mono text-[11px] tracking-widest text-white/40 md:block">
          WASD / FLECHAS · CLIC EN EL PISO PARA IR · E PARA INTERACTUAR · M MAPA
        </p>
      )}

      {/* ─────────── Aviso de estación cercana ─────────── */}
      <AnimatePresence>
        {started && nearStation && !overlay && !fading && (
          <motion.button
            key={nearStation.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            onClick={() => interact(nearStation)}
            className={`absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] z-20 flex items-center gap-3 rounded-2xl border border-[#E50914]/60 bg-black/85 px-4 py-3 text-left shadow-[0_0_40px_rgba(229,9,20,0.35)] md:bottom-12 md:left-1/2 md:max-w-md md:-translate-x-1/2 ${
              isTouch ? "left-40 right-4" : "left-1/2 max-w-[calc(100vw-2rem)] -translate-x-1/2"
            }`}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-[10px] tracking-[0.3em] text-white/50">
                {nearStation.hint.toUpperCase()}
              </span>
              <span className="block truncate font-bold leading-tight">{nearStation.label}</span>
            </span>
            <span className="ml-1 flex shrink-0 items-center gap-2 font-mono text-xs tracking-widest text-[#E50914]">
              {isTouch ? "TOCAR" : <kbd className="rounded border border-[#E50914] px-2 py-0.5">E</kbd>}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {playingTrack && overlay?.type !== "section" && (
          <MiniPlayer
            track={playingTrack}
            isPlaying={isPlaying}
            onToggle={() => toggleTrack(playingTrack.id)}
            onStop={stopMusic}
          />
        )}
      </AnimatePresence>

      {started && isTouch && !overlay && <Joystick />}

      {/* ─────────── Pantalla de inicio ─────────── */}
      <AnimatePresence>
        {!started && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-7 bg-black/70 px-6 text-center"
          >
            <p className="font-mono text-xs tracking-[0.5em] text-[#E50914]">DARKSIDE UY PRESENTA</p>
            <h1 className="text-4xl font-black tracking-tight md:text-7xl">
              EL LADO OSCURO
              <span className="block text-[#E50914]">SE RECORRE</span>
            </h1>
            <p className="max-w-md text-sm text-white/60">
              Artistas, música, Underfest, producciones y más. Caminá por el mundo Darkside y descubrí todo lo
              que hacemos.
            </p>
            <button
              onClick={() => setStarted(true)}
              autoFocus
              className="rounded-full bg-[#E50914] px-10 py-4 font-mono text-sm font-bold tracking-[0.3em] shadow-[0_0_40px_rgba(229,9,20,0.6)] transition hover:scale-105"
            >
              ENTRAR
            </button>
            <p className="font-mono text-[11px] tracking-widest text-white/40">
              {isTouch ? "JOYSTICK O TOCÁ EL PISO PARA MOVERTE" : "WASD / FLECHAS O CLIC EN EL PISO PARA MOVERTE"}
            </p>
            <Link
              href="/"
              className="font-mono text-xs tracking-widest text-white/40 underline-offset-4 hover:text-white hover:underline"
            >
              PREFIERO LA VERSIÓN CLÁSICA
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────── Paneles ─────────── */}
      <AnimatePresence>
        {overlay?.type === "card" && (
          <InfoCard key="card" card={overlay.card} onClose={closeOverlay} onOpenSection={openSection} />
        )}
        {overlay?.type === "map" && (
          <MapPanel
            key="map"
            currentZone={zone}
            onClose={closeOverlay}
            onTravel={(to) => travel(to)}
            onArtist={(slug) => travel("artistas", slug, { type: "artist", slug })}
          />
        )}
      </AnimatePresence>

      {overlay?.type === "section" && <SectionPanel section={overlay.section} onClose={closeOverlay} />}

      {/* Ficha del artista: el mismo componente que usa el sitio */}
      <ArtistOverlay artist={openedArtist} onClose={closeOverlay} />
    </main>
  );
}

/* Navegadores sin WebGL: se ofrece la versión clásica */
function NoWebGL() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-black px-6 text-center">
      <Image src="/Darksideuy.png" alt="Darkside UY" width={1817} height={394} className="h-8 w-auto" priority />
      <p className="max-w-sm text-white/70">
        Tu navegador no puede mostrar la experiencia 3D. Podés recorrer todo el contenido en la versión clásica.
      </p>
      <Link href="/" className="rounded-full bg-[#E50914] px-8 py-3 font-mono text-sm font-bold tracking-[0.2em]">
        IR A LA VERSIÓN CLÁSICA
      </Link>
    </main>
  );
}
