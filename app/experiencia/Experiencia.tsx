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
import { Users, X } from "lucide-react";

import { artists } from "../(site)/data/artists";
import ArtistOverlay from "../(site)/artists/ArtistOverlay";
import { input, isMoveKey, player } from "./_game/input";
import { slotFor, START_Z } from "./_game/gallery";

/* El mundo 3D solo existe en el navegador */
const World = dynamic(() => import("./_game/World"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-sm tracking-[0.3em] text-white/50">
      CARGANDO MUNDO…
    </div>
  ),
});

const BASE_PATH = "/experiencia";

function placePlayer(slug: string | null) {
  const slot = slug ? slotFor(slug) : null;
  player.x = slot ? slot.spot[0] : 0;
  player.z = slot ? slot.spot[1] + 1.2 : START_Z;
}

/* Pantallas táctiles: joystick en lugar de la ayuda de teclado */
const TOUCH_QUERY = "(pointer: coarse)";

function useIsTouch() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(TOUCH_QUERY);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(TOUCH_QUERY).matches,
    () => false
  );
}

export default function Experiencia({ initialSlug }: { initialSlug: string | null }) {
  /* Con link directo se entra sin pantalla de inicio, frente al artista */
  const [started, setStarted] = useState(initialSlug !== null);
  const [nearSlug, setNearSlug] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(initialSlug);
  const [showDirectory, setShowDirectory] = useState(false);
  const isTouch = useIsTouch();

  const nearRef = useRef(nearSlug);
  const openRef = useRef(openSlug);

  useEffect(() => {
    nearRef.current = nearSlug;
    openRef.current = openSlug;
  }, [nearSlug, openSlug]);

  /* Posición inicial (antes de que arranque el loop del juego) */
  useLayoutEffect(() => {
    placePlayer(initialSlug);
  }, [initialSlug]);

  useEffect(() => {
    input.frozen = !started || openSlug !== null || showDirectory;
  }, [started, openSlug, showDirectory]);

  /* La URL siempre refleja al artista abierto, para poder compartirla */
  const openArtist = useCallback((slug: string) => {
    setOpenSlug(slug);
    setShowDirectory(false);
    window.history.replaceState(null, "", `${BASE_PATH}?artista=${slug}`);
  }, []);

  const closeArtist = useCallback(() => {
    setOpenSlug(null);
    window.history.replaceState(null, "", BASE_PATH);
  }, []);

  const travelTo = useCallback(
    (slug: string) => {
      placePlayer(slug);
      setStarted(true);
      openArtist(slug);
    },
    [openArtist]
  );

  /* Teclado */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        if (openRef.current) closeArtist();
        setShowDirectory(false);
        return;
      }
      if (openRef.current) return;

      if (isMoveKey(e.code)) {
        e.preventDefault();
        input.keys.add(e.code);
      }
      if (["KeyE", "Enter", "Space"].includes(e.code) && nearRef.current) {
        e.preventDefault();
        openArtist(nearRef.current);
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
  }, [openArtist, closeArtist]);

  const nearArtist = artists.find((a) => a.slug === nearSlug) ?? null;
  const openedArtist = artists.find((a) => a.slug === openSlug) ?? null;

  return (
    <main className="relative h-dvh w-full select-none overflow-hidden bg-black">
      <div className="absolute inset-0">
        <World activeSlug={nearSlug} onNear={setNearSlug} onSelect={openArtist} />
      </div>

      {/* Viñeta y grano para unir el 3D con la estética del sitio */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />

      {/* ─────────── Barra superior ─────────── */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 py-4 md:px-8">
        <Link href="/" aria-label="Darkside UY — inicio">
          <Image
            src="/Darksideuy.png"
            alt="Darkside UY"
            width={1817}
            height={394}
            className="h-6 w-auto md:h-8"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDirectory(true)}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 font-mono text-xs tracking-widest backdrop-blur hover:border-[#E50914]"
          >
            <Users size={14} /> ARTISTAS
          </button>
          <Link
            href="/"
            className="hidden rounded-full border border-white/15 bg-black/60 px-4 py-2 font-mono text-xs tracking-widest text-white/70 backdrop-blur hover:text-white sm:block"
          >
            VERSIÓN CLÁSICA
          </Link>
        </div>
      </header>

      {/* Zona actual */}
      {started && (
        <div className="pointer-events-none absolute left-4 top-16 z-10 font-mono md:left-8 md:top-20">
          <p className="text-[10px] tracking-[0.35em] text-[#E50914]">ZONA 01</p>
          <p className="text-sm font-bold tracking-[0.2em]">GALERÍA DE ARTISTAS</p>
        </div>
      )}

      {/* Ayuda de controles */}
      {started && !isTouch && (
        <p className="pointer-events-none absolute bottom-5 left-8 z-10 font-mono text-[11px] tracking-widest text-white/40">
          WASD / FLECHAS PARA MOVERTE · E PARA VER · CLIC EN UN CARTEL
        </p>
      )}

      {/* ─────────── Aviso de artista cercano ─────────── */}
      <AnimatePresence>
        {started && nearArtist && !openSlug && (
          <motion.button
            key={nearArtist.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => openArtist(nearArtist.slug)}
            className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-[#E50914]/60 bg-black/80 py-3 pl-3 pr-5 text-left shadow-[0_0_40px_rgba(229,9,20,0.35)] backdrop-blur md:bottom-12"
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              <Image src={nearArtist.avatar || nearArtist.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span>
              <span className="block font-mono text-[10px] tracking-[0.3em] text-white/50">
                {nearArtist.category.toUpperCase()}
              </span>
              <span className="block text-lg font-bold leading-tight">{nearArtist.name}</span>
            </span>
            <span className="ml-2 flex items-center gap-2 font-mono text-xs tracking-widest text-[#E50914]">
              {isTouch ? "TOCAR" : <kbd className="rounded border border-[#E50914] px-2 py-0.5">E</kbd>}
              VER
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Joystick táctil */}
      {started && isTouch && !openSlug && <Joystick />}

      {/* ─────────── Pantalla de inicio ─────────── */}
      <AnimatePresence>
        {!started && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-black/70 px-6 text-center backdrop-blur-sm"
          >
            <p className="font-mono text-xs tracking-[0.5em] text-[#E50914]">DARKSIDE UY PRESENTA</p>
            <h1 className="text-4xl font-black tracking-tight md:text-7xl">
              EL LADO OSCURO
              <span className="block text-[#E50914]">SE RECORRE</span>
            </h1>
            <p className="max-w-md text-sm text-white/60">
              Caminá por la galería, acercate a cada artista y descubrí su música.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="rounded-full bg-[#E50914] px-10 py-4 font-mono text-sm font-bold tracking-[0.3em] shadow-[0_0_40px_rgba(229,9,20,0.6)] transition hover:scale-105"
            >
              ENTRAR
            </button>
            <Link href="/" className="font-mono text-xs tracking-widest text-white/40 hover:text-white">
              PREFIERO LA VERSIÓN CLÁSICA
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────── Directorio de artistas ─────────── */}
      <AnimatePresence>
        {showDirectory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDirectory(false)}
            className="absolute inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm"
          >
            <motion.aside
              initial={{ x: 40 }}
              animate={{ x: 0 }}
              exit={{ x: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#0b0b0b] p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-mono text-sm font-bold tracking-[0.3em]">ARTISTAS</p>
                <button onClick={() => setShowDirectory(false)} aria-label="Cerrar">
                  <X size={20} />
                </button>
              </div>
              <ul className="-mr-2 flex-1 space-y-2 overflow-y-auto pr-2">
                {artists.map((artist) => (
                  <li key={artist.slug}>
                    <button
                      onClick={() => travelTo(artist.slug)}
                      className="flex w-full items-center gap-3 rounded-xl border border-white/5 p-2 text-left transition hover:border-[#E50914]/60 hover:bg-white/5"
                    >
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                        <Image src={artist.avatar || artist.image} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{artist.name}</span>
                        <span className="block text-xs text-white/50">
                          {artist.category} · {artist.city}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ficha del artista: el mismo componente que usa el sitio */}
      <ArtistOverlay artist={openedArtist} onClose={closeArtist} />
    </main>
  );
}

/* ───────────────────────── Joystick ───────────────────────── */

const JOY_RADIUS = 48;

function Joystick() {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const center = useRef<{ x: number; y: number } | null>(null);

  const release = () => {
    center.current = null;
    input.joyX = 0;
    input.joyY = 0;
    setKnob({ x: 0, y: 0 });
  };

  useEffect(() => release, []);

  const move = (clientX: number, clientY: number) => {
    if (!center.current) return;
    let dx = clientX - center.current.x;
    let dy = clientY - center.current.y;
    const len = Math.hypot(dx, dy);
    if (len > JOY_RADIUS) {
      dx = (dx / len) * JOY_RADIUS;
      dy = (dy / len) * JOY_RADIUS;
    }
    input.joyX = dx / JOY_RADIUS;
    input.joyY = dy / JOY_RADIUS;
    setKnob({ x: dx, y: dy });
  };

  return (
    <div
      className="absolute bottom-8 left-8 z-20 h-32 w-32 touch-none rounded-full border border-white/15 bg-black/40 backdrop-blur"
      onPointerDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => move(e.clientX, e.clientY)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full bg-[#E50914]/80 shadow-[0_0_20px_rgba(229,9,20,0.6)]"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}
