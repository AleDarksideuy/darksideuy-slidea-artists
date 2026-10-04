"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Share2 } from "lucide-react";

import { artists, type Artist } from "../data/artists";
import { shareLink } from "../lib/share";

/* Lo último que publicó (o lo próximo que viene) */
export function latestRelease(artist: Artist) {
  const releases = artist.releases ?? [];
  const release = releases.find((r) => r.status === "Lanzado") ?? releases[0];
  if (!release) return null;
  return release.status === "Lanzado"
    ? { label: "Último lanzamiento", value: `${release.title} · ${release.type}` }
    : { label: release.status, value: release.title };
}

/* ═══════════════════════════════════════════════════════════════
   NUESTROS ARTISTAS — EL LINEUP
   Los nombres en grande, como en un afiche de festival. Al bajar, el
   nombre que pasa por la franja de lectura se enciende y su foto
   aparece en el cuadro fijo, con su último lanzamiento y accesos.
   ═══════════════════════════════════════════════════════════════ */

export default function Lineup() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const names = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      /* franja de lectura: debajo del cuadro en celular, al centro en escritorio */
      { rootMargin: window.matchMedia("(min-width: 768px)").matches ? "-48% 0px -48% 0px" : "-66% 0px -26% 0px" }
    );
    names.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const artist = artists[active];
  const release = latestRelease(artist);

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
    <section id="artists" className="relative px-5 pt-20 md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-end justify-between gap-4 md:mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">
              Lineup · {String(artists.length).padStart(2, "0")} artistas
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">
              Nuestros
              <br />
              artistas
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-white/55 md:block">
            Conocé a los artistas que actualmente forman parte del ecosistema Darkside.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] md:gap-12">
          {/* ── El cuadro fijo con el artista encendido ── */}
          <div className="sticky top-[calc(3.25rem+env(safe-area-inset-top))] z-10 h-[52svh] md:top-24 md:h-[78svh] md:self-start">
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ds-ink">
              {artists.map((a, i) => (
                <Image
                  key={a.slug}
                  src={a.image}
                  alt={i === active ? a.name : ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover transition-[opacity,transform] duration-700 motion-reduce:transition-none ${
                    i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
                  DS-{String(active + 1).padStart(2, "0")} · {artist.city}, {artist.country}
                </p>
                <p className="mt-1 font-display text-3xl font-bold uppercase leading-none md:text-5xl">{artist.name}</p>
                <p className="mt-2 text-sm text-white/70">{artist.category}</p>
                {release && (
                  <p className="mt-3 text-xs text-white/60 md:text-sm">
                    <span className="text-ds-red-soft">{release.label}:</span> {release.value}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-ds-red text-white px-5 font-display text-xs font-bold uppercase tracking-[0.16em] active:scale-[0.98] md:flex-none md:hover:brightness-110"
                  >
                    Ver artista <ArrowUpRight size={16} />
                  </Link>
                  <button
                    onClick={share}
                    aria-label={`Compartir a ${artist.name}`}
                    className="flex min-h-[46px] min-w-[46px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/40 px-4 font-display text-xs font-bold uppercase tracking-[0.16em] active:scale-[0.98]"
                  >
                    {copied ? "Link copiado" : <Share2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Los nombres ── */}
          <ol className="relative pb-[30svh] pt-6 md:py-[30svh]">
            {artists.map((a, i) => {
              const on = i === active;
              return (
                <li
                  key={a.slug}
                  ref={(el) => {
                    names.current[i] = el;
                  }}
                  data-index={i}
                  className="border-b border-white/10"
                >
                  <button
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="flex w-full items-baseline gap-3 py-5 text-left md:py-7"
                  >
                    <span className={`font-mono text-[11px] transition-colors ${on ? "text-ds-red-soft" : "text-white/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[clamp(2rem,9.5vw,4.5rem)] font-bold uppercase leading-none transition-all duration-300 motion-reduce:transition-none ${
                        on ? "translate-x-1 text-white" : "text-outline"
                      }`}
                    >
                      {a.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
