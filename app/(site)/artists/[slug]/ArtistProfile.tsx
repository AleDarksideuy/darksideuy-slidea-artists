"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronDown, MapPin, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { FaApple, FaFacebookF, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from "react-icons/fa";

import { artists, type Artist, type Project, type Release } from "../../data/artists";
import { shareLink } from "../../lib/share";

/* ═══════════════════════════════════════════════════════════════
   FICHA DEL ARTISTA
   Foto (y clip al tocar), datos, redes, biografía, fechas,
   lanzamientos, playlist, proyectos y más artistas para seguir
   explorando.
   ═══════════════════════════════════════════════════════════════ */

const BIO_FALLBACK =
  "Próximamente encontrarás aquí la biografía completa del artista, su recorrido, influencias, trayectoria y el trabajo desarrollado junto a Darkside.";

type Social = { href?: string; label: string; icon: React.ComponentType<{ size?: number }> };

function socialsOf(a: { instagram?: string; spotify?: string; youtube?: string; facebook?: string }): Social[] {
  return [
    { href: a.spotify, label: "Spotify", icon: FaSpotify },
    { href: a.instagram, label: "Instagram", icon: FaInstagram },
    { href: a.youtube, label: "YouTube", icon: FaYoutube },
    { href: a.facebook, label: "Facebook", icon: FaFacebookF },
  ].filter((s) => s.href);
}

export default function ArtistProfile({ artist }: { artist: Artist }) {
  const index = artists.findIndex((a) => a.slug === artist.slug);
  const others = artists.filter((a) => a.slug !== artist.slug);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const result = await shareLink({
      title: `${artist.name} — Darkside UY`,
      text: `${artist.category} · ${artist.city}, ${artist.country}`,
      path: `/artists/${artist.slug}`,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <main className="relative">
      {/* Volver / compartir */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:top-24 md:px-10">
        <Link
          href="/#artists"
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 font-display text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-xl"
        >
          <ArrowLeft size={16} /> Artistas
        </Link>
        <button
          onClick={share}
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 font-display text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-xl"
        >
          {copied ? "Link copiado" : <><Share2 size={16} /> Compartir</>}
        </button>
      </div>

      {/* Portada */}
      <section className="relative md:mx-auto md:grid md:max-w-7xl md:grid-cols-[1fr_1fr] md:items-end md:gap-12 md:px-10 md:pt-40">
        <HeroMedia artist={artist} />

        <div className="relative z-10 -mt-24 px-5 md:mt-0 md:px-0 md:pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">
            DS-{String(index + 1).padStart(2, "0")} · Artista Darkside
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.8rem,13vw,7rem)] font-bold uppercase leading-[0.88]">{artist.name}</h1>
          {artist.legalName && artist.legalName.trim().toLowerCase() !== artist.name.trim().toLowerCase() && (
            <p className="mt-2 text-sm text-white/50">{artist.legalName.trim()}</p>
          )}

          <ul className="mt-5 flex flex-wrap gap-2">
            <li className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm">
              <Image src={`/flags/${artist.countryCode}.svg`} alt="" width={18} height={13} className="rounded-sm" />
              {artist.country}
            </li>
            <li className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm">
              <MapPin size={14} className="text-ds-red" /> {artist.city}
            </li>
            <li className="rounded-full border border-white/15 px-3 py-1.5 text-sm">{artist.category}</li>
          </ul>

          {socialsOf(artist).length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socialsOf(artist).map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${artist.name} en ${label}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] md:hover:bg-ds-red text-white"
                  >
                    <Icon size={19} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 md:px-10">
        {/* Biografía */}
        <Block kicker="Biografía">
          <p className="max-w-2xl text-[15px] leading-7 text-white/75 md:text-base">
            {artist.description?.trim() || BIO_FALLBACK}
          </p>
        </Block>

        {/* Últimas fechas */}
        {artist.latestDates && artist.latestDates.length > 0 && (
          <Block kicker="Últimas fechas">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {artist.latestDates.map((event) => (
                <li key={`${event.date}-${event.title}`} className="grid gap-1 py-5 md:grid-cols-[10rem_1fr] md:gap-6">
                  <span className="font-mono text-sm uppercase text-ds-red-soft">{event.date}</span>
                  <span>
                    <span className="block font-display text-xl font-bold uppercase">{event.title}</span>
                    <span className="block text-sm text-white/55">{event.location}</span>
                    {event.description && <span className="mt-2 block text-sm text-white/65">{event.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {/* Lanzamientos */}
        {artist.releases && artist.releases.length > 0 && (
          <Block kicker="Lanzamientos">
            <div className="grid gap-4 md:grid-cols-2">
              {artist.releases.map((release) => (
                <ReleaseCard key={release.title} release={release} artistName={artist.name} />
              ))}
            </div>
          </Block>
        )}

        {/* Playlist de YouTube (se carga al tocar) */}
        {artist.youtubePlaylist && (
          <Block kicker="Videos">
            <LazyPlaylist url={artist.youtubePlaylist} name={artist.name} poster={artist.image} />
          </Block>
        )}

        {/* Proyectos */}
        {artist.projects && artist.projects.length > 0 && (
          <Block kicker="Proyectos">
            <ul className="grid gap-3 md:grid-cols-2">
              {artist.projects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </ul>
          </Block>
        )}
      </div>

      {/* Más artistas: seguir explorando */}
      <section className="mt-20 border-t border-white/10 pt-12">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">Seguí explorando</p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase">Más artistas</h2>
        </div>
        <ul className="no-scrollbar mx-auto mt-6 flex max-w-7xl snap-x gap-3 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-4 md:overflow-visible md:px-10 lg:grid-cols-7">
          {others.map((a) => (
            <li key={a.slug} className="w-[44vw] max-w-[15rem] shrink-0 snap-start md:w-auto md:max-w-none">
              <Link href={`/artists/${a.slug}`} className="group block">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
                  <Image src={a.image} alt="" fill sizes="(max-width: 768px) 44vw, (max-width: 1024px) 25vw, 14vw" className="object-cover grayscale transition duration-500 md:group-hover:grayscale-0" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 font-display text-lg font-bold uppercase leading-tight">{a.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-7xl px-5 pb-10 md:px-10">
          <Link
            href="/#llamado-artistas"
            className="flex items-center justify-between gap-4 rounded-3xl bg-ds-red text-white p-6 md:p-8"
          >
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white">¿Hacés música o arte?</span>
              <span className="mt-1 block font-display text-2xl font-bold uppercase leading-tight">Sumate al llamado de artistas</span>
            </span>
            <ArrowUpRight size={28} className="shrink-0" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Block({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 md:mt-24">
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{kicker}</h2>
      {children}
    </section>
  );
}

/* Foto del artista; el clip se carga y suena recién al tocar */
function HeroMedia({ artist }: { artist: Artist }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const el = video.current;
    if (!el || !artist.heroVideo) return;
    /* el clip se descarga recién acá, en el mismo toque que lo reproduce */
    if (!el.getAttribute("src")) el.src = encodeURI(artist.heroVideo);
    setStarted(true);
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-[68svh] md:rounded-3xl md:border md:border-white/10">
      <Image src={artist.image} alt={artist.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      {artist.heroVideo && (
        <video
          ref={video}
          playsInline
          muted={muted}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setStarted(false);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${started ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40" />

      {artist.heroVideo && (
        <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 md:bottom-6 md:top-auto md:translate-y-0">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pausar clip" : "Ver clip"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-ds-red text-white shadow-[0_0_30px_rgba(229,9,20,0.5)] active:scale-95"
          >
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          {started && (
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/60"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ReleaseCard({ release, artistName }: { release: Release; artistName: string }) {
  const [showTracks, setShowTracks] = useState(false);
  const links = [
    { href: release.spotify, label: "Spotify", icon: FaSpotify },
    { href: release.youtube, label: "YouTube", icon: FaYoutube },
    { href: release.appleMusic, label: "Apple Music", icon: FaApple },
    { href: release.soundcloud, label: "SoundCloud", icon: FaSoundcloud },
  ].filter((l) => l.href);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-ds-ink">
      <div className="flex gap-4 p-4">
        {release.cover && (
          <span className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10">
            <Image src={release.cover} alt={`${release.title} — ${artistName}`} fill sizes="112px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            {release.type}
            <span className={`rounded-full px-2 py-0.5 ${release.status === "Lanzado" ? "bg-white/10 text-white/70" : "bg-ds-red/20 text-ds-red-soft"}`}>
              {release.status}
            </span>
          </p>
          <h3 className="mt-1 font-display text-xl font-bold uppercase leading-tight">{release.title}</h3>
          {release.releaseDate && <p className="mt-1 text-xs text-white/45">{release.releaseDate}</p>}
          {release.description && <p className="mt-2 text-sm leading-6 text-white/65">{release.description}</p>}
        </div>
      </div>

      {(links.length > 0 || release.presave) && (
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {release.presave && (
            <a href={release.presave} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-1 rounded-xl bg-ds-red text-white px-4 font-display text-xs font-bold uppercase tracking-[0.14em]">
              Pre-save <ArrowUpRight size={14} />
            </a>
          )}
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${release.title} en ${label}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/75 md:hover:border-ds-red"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      )}

      {release.tracks && release.tracks.length > 0 && (
        <div className="border-t border-white/10">
          <button
            onClick={() => setShowTracks((s) => !s)}
            aria-expanded={showTracks}
            className="flex w-full items-center justify-between px-4 py-3 text-sm text-white/70"
          >
            Lista de temas ({release.tracks.length})
            <ChevronDown size={16} className={`transition-transform ${showTracks ? "rotate-180" : ""}`} />
          </button>
          {showTracks && (
            <ol className="px-4 pb-4 text-sm text-white/65">
              {release.tracks.map((track, i) => (
                <li key={track} className="flex gap-3 py-1.5">
                  <span className="w-5 font-mono text-xs text-white/35">{String(i + 1).padStart(2, "0")}</span>
                  {track}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </article>
  );
}

/* El reproductor de YouTube pesa mucho: se carga recién al tocar */
function LazyPlaylist({ url, name, poster }: { url: string; name: string; poster: string }) {
  const [load, setLoad] = useState(false);
  const embed = url.replace("https://www.youtube.com/playlist?list=", "https://www.youtube.com/embed/videoseries?list=");

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-ds-ink">
      {load ? (
        <iframe
          src={`${embed}&autoplay=1`}
          title={`Playlist de YouTube de ${name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button onClick={() => setLoad(true)} className="group absolute inset-0" aria-label={`Ver la playlist de ${name}`}>
          <Image src={poster} alt="" fill sizes="(max-width: 768px) 100vw, 960px" className="object-cover opacity-50" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ds-red text-white">
              <FaYoutube size={26} />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.18em]">Ver playlist</span>
          </span>
        </button>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const socials = socialsOf(project);
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ds-ink p-4">
      <span className="min-w-0">
        <span className="block font-display text-lg font-bold uppercase leading-tight">{project.name}</span>
        {(project.genre || project.city) && (
          <span className="block text-xs text-white/45">{[project.genre, project.city, project.year].filter(Boolean).join(" · ")}</span>
        )}
      </span>
      <span className="flex shrink-0 gap-1.5">
        {socials.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} en ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] md:hover:bg-ds-red text-white"
          >
            <Icon size={15} />
          </a>
        ))}
      </span>
    </li>
  );
}
