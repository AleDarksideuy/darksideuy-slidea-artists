"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play, Share2 } from "lucide-react";
import { FaSpotify, FaYoutube } from "react-icons/fa";

import { spotlightArtists } from "../data/spotlight";
import { PLAYLISTS } from "../data/home";
import { shareLink } from "../lib/share";
import { useReducedMotion } from "../lib/device";
import { useMusic } from "../music/MusicProvider";

/* ═══════════════════════════════════════════════════════════════
   MÚSICA — LA BATEA
   Darkside's Pick como una batea de discos: se pasan con el dedo, la
   funda del centro queda de frente y las de los costados se inclinan.
   Al tocar una, el disco sale de la funda y suena.
   ═══════════════════════════════════════════════════════════════ */

export default function Musica() {
  return (
    <section id="darkside-pick" className="relative overflow-hidden pt-24 md:pt-36">
      <header className="mx-auto max-w-7xl px-5 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">Darkside&apos;s Pick</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">Música</h2>
        <p className="mt-4 max-w-md text-sm text-white/55">
          Descubrí música de artistas emergentes seleccionada por Darkside. Deslizá la batea y tocá un disco.
        </p>
      </header>

      <Batea />

      <div className="mx-auto mt-20 grid max-w-7xl gap-14 px-5 md:mt-28 md:grid-cols-[1.4fr_1fr] md:gap-16 md:px-10">
        <Spotlight />
        <Playlists />
      </div>
    </section>
  );
}

function Batea() {
  const { tracks, current, isPlaying, toggle } = useMusic();
  const reducedMotion = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const sleeves = useRef<(HTMLDivElement | null)[]>([]);
  const [centered, setCentered] = useState(0);
  const [copied, setCopied] = useState(false);

  /* Inclinación según la distancia al centro (solo transform: fluido en celular) */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let best = Infinity;
      sleeves.current.forEach((sleeve, i) => {
        if (!sleeve) return;
        const parent = sleeve.parentElement!;
        const center = parent.offsetLeft + parent.offsetWidth / 2;
        const offset = (center - mid) / parent.offsetWidth;
        if (Math.abs(offset) < best) {
          best = Math.abs(offset);
          closest = i;
        }
        if (reducedMotion) {
          sleeve.style.transform = "";
          return;
        }
        const o = Math.max(-1.5, Math.min(1.5, offset));
        sleeve.style.transform = `rotateY(${o * -22}deg) scale(${1 - Math.abs(o) * 0.1}) translateZ(${-Math.abs(o) * 40}px)`;
        sleeve.style.opacity = String(1 - Math.min(0.4, Math.abs(o) * 0.3));
      });
      setCentered(closest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    /* también al aparecer (la home arranca con las secciones ocultas) */
    const resize = new ResizeObserver(onScroll);
    resize.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  /* Si llega un link compartido (?tema=), la batea va a ese disco */
  useEffect(() => {
    if (!current || !rail.current) return;
    const index = tracks.findIndex((t) => t.id === current.id);
    const item = sleeves.current[index]?.parentElement;
    if (item) rail.current.scrollTo({ left: item.offsetLeft - (rail.current.clientWidth - item.offsetWidth) / 2, behavior: reducedMotion ? "auto" : "smooth" });
  }, [current, tracks, reducedMotion]);

  const info = tracks[centered];
  const infoPlaying = isPlaying && current?.id === info.id;

  const share = async () => {
    const result = await shareLink({
      title: `${info.title} — ${info.artist}`,
      text: "Escuchalo en Darkside's Pick",
      path: `/?tema=${info.id}#darkside-pick`,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="mt-10">
      <div
        ref={rail}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[22vw] py-6 [perspective:1100px] md:px-[38vw]"
      >
        {tracks.map((track, i) => {
          const on = current?.id === track.id;
          return (
            <div key={track.id} className="w-[56vw] max-w-[22rem] shrink-0 snap-center md:w-[24vw]">
              <div
                ref={(el) => {
                  sleeves.current[i] = el;
                }}
                className="relative transition-[opacity] duration-200 [transform-style:preserve-3d]"
              >
                {/* El disco que asoma de la funda */}
                <div
                  aria-hidden
                  className={`absolute inset-[4%] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 motion-reduce:transition-none ${
                    on ? "translate-x-[38%]" : "translate-x-0"
                  }`}
                  style={{ background: "repeating-radial-gradient(circle, #0b0b0b 0 2px, #171717 2px 3px)" }}
                >
                  <div className={`absolute inset-[34%] overflow-hidden rounded-full ${on && isPlaying ? "animate-[spin_1.8s_linear_infinite]" : ""}`}>
                    <Image src={track.cover} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                </div>

                {/* La funda */}
                <button
                  onClick={() => toggle(track.id)}
                  aria-label={`${on && isPlaying ? "Pausar" : "Escuchar"} ${track.title} de ${track.artist}`}
                  className="relative block aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] active:scale-[0.98]"
                >
                  <Image src={track.cover} alt="" fill sizes="(max-width: 768px) 56vw, 24vw" className="object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-ds-red shadow-lg">
                    {on && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </span>
                  <span className="absolute right-3 top-3 font-mono text-[10px] text-white/70">
                    {String(i + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ficha del disco del centro */}
      <div className="mx-auto mt-2 flex max-w-md flex-col items-center px-5 text-center" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
          {info.genre} · {info.duration}
        </p>
        <p className="mt-1 font-display text-2xl font-bold uppercase leading-tight">{info.title}</p>
        <p className="text-sm text-white/60">{info.artist}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => toggle(info.id)}
            className="flex min-h-[46px] items-center gap-2 rounded-xl bg-ds-red px-5 font-display text-xs font-bold uppercase tracking-[0.16em] active:scale-[0.98]"
          >
            {infoPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            {infoPlaying ? "Pausar" : "Escuchar"}
          </button>
          {info.spotify && (
            <a
              href={info.spotify}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escuchar completo en Spotify"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-white/15 text-white/70"
            >
              <FaSpotify size={18} />
            </a>
          )}
          {info.youtube && (
            <a
              href={info.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver en YouTube"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-white/15 text-white/70"
            >
              <FaYoutube size={18} />
            </a>
          )}
          <button
            onClick={share}
            aria-label="Compartir tema"
            className="flex h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-white/15 px-3 text-white/70"
          >
            {copied ? <span className="text-[10px] font-bold uppercase">Copiado</span> : <Share2 size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Spotlight() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">Spotlight</p>
      <h3 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">Últimos lanzamientos</h3>
      <p className="mt-2 text-sm text-white/55">Descubrí a artistas y sus últimos lanzamientos en distintas plataformas.</p>

      <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
        {spotlightArtists.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <Image src={item.image} alt={`${item.release} — ${item.artist}`} fill sizes="80px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                {item.type} · {item.year} · {item.genre}
              </span>
              <span className="block truncate font-display text-lg font-bold uppercase">{item.release}</span>
              <span className="block truncate text-sm text-white/60">{item.artist}</span>
            </span>
            <span className="flex shrink-0 gap-2">
              {item.spotify && (
                <a
                  href={item.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.release} en Spotify`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 md:hover:text-[#1DB954]"
                >
                  <FaSpotify size={18} />
                </a>
              )}
              {"youtube" in item && item.youtube && (
                <a
                  href={item.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.release} en YouTube`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 md:hover:text-ds-red"
                >
                  <FaYoutube size={18} />
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Playlists() {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">Playlists · En desarrollo</p>
      <h3 className="mt-2 font-display text-3xl font-bold uppercase">Playlists</h3>
      <p className="mt-2 text-sm text-white/55">{PLAYLISTS.text}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {PLAYLISTS.items.map((p) => (
          <li key={p.name} className="rounded-full border border-white/10 px-4 py-2 text-sm">
            {p.name} <span className="text-white/40">· {p.subtitle}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 font-display text-xs font-bold uppercase tracking-[0.2em] text-ds-red">Mantenete alerta</p>
    </div>
  );
}
