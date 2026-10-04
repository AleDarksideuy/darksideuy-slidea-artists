"use client";

import Image from "next/image";
import { FaSpotify, FaYoutube } from "react-icons/fa";

import { spotlightArtists } from "../data/spotlight";
import { PLAYLISTS } from "../data/home";
import Player from "../music/Player";

/* ═══════════════════════════════════════════════════════════════
   MÚSICA
   Darkside's Pick en el Darkside Player (music/Player.tsx), más el
   Spotlight de lanzamientos y las playlists.
   ═══════════════════════════════════════════════════════════════ */

export default function Musica() {
  return (
    <section id="darkside-pick" className="relative overflow-hidden pt-24 md:pt-36">
      <header className="mx-auto max-w-7xl px-5 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">Darkside&apos;s Pick</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">Música</h2>
        <p className="mt-4 max-w-md text-sm text-white/55">
          Descubrí música de artistas emergentes seleccionada por Darkside. Tocá el disco para escuchar y deslizalo para cambiar de tema.
        </p>
      </header>

      {/* El Darkside Player (en celular, el mini reproductor de abajo se
          oculta mientras este está en pantalla) */}
      <div id="darkside-player" className="mx-auto mt-10 max-w-6xl px-4 md:px-10">
        <Player />
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-14 px-5 md:mt-28 md:grid-cols-[1.4fr_1fr] md:gap-16 md:px-10">
        <Spotlight />
        <Playlists />
      </div>
    </section>
  );
}

function Spotlight() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">Spotlight</p>
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
