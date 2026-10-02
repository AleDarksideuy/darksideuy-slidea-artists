import type { Metadata } from "next";

import { artists } from "../(site)/data/artists";
import { isZoneId, zones } from "./_game/zones";
import Experiencia from "./Experiencia";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/* Links directos:
   /experiencia?artista=zonno  → ficha de ese artista dentro del mundo
   /experiencia?zona=musica    → entra directo a esa zona */
function first(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}

async function resolve(searchParams: PageProps["searchParams"]) {
  const params = await searchParams;
  const slug = first(params.artista);
  const zona = first(params.zona);
  return {
    artist: artists.find((a) => a.slug === slug) ?? null,
    zone: isZoneId(zona) ? zona : null,
  };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { artist, zone } = await resolve(searchParams);

  if (artist) {
    return {
      title: `${artist.name} — Darkside UY`,
      description: `${artist.category} · ${artist.city}, ${artist.country}`,
      openGraph: { images: [encodeURI(artist.image)] },
    };
  }
  if (zone && zone !== "lobby") {
    return {
      title: `${zones[zone].title} — Darkside UY`,
      description: zones[zone].description,
    };
  }
  return {};
}

export default async function ExperienciaPage({ searchParams }: PageProps) {
  const { artist, zone } = await resolve(searchParams);

  return <Experiencia initialZone={zone} initialArtist={artist?.slug ?? null} />;
}
