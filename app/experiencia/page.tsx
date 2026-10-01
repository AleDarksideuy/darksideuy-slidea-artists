import type { Metadata } from "next";

import { artists } from "../(site)/data/artists";
import Experiencia from "./Experiencia";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/* Link directo: /experiencia?artista=zonno abre la ficha de ese artista
   dentro del mundo. Acá armamos el título y la imagen para compartir. */
function findArtist(param: string | string[] | undefined) {
  const slug = Array.isArray(param) ? param[0] : param;
  return artists.find((artist) => artist.slug === slug) ?? null;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const artist = findArtist((await searchParams).artista);

  if (!artist) return {};

  return {
    title: `${artist.name} — Darkside UY`,
    description: `${artist.category} · ${artist.city}, ${artist.country}`,
    openGraph: { images: [encodeURI(artist.image)] },
  };
}

export default async function ExperienciaPage({ searchParams }: PageProps) {
  const artist = findArtist((await searchParams).artista);

  return <Experiencia initialSlug={artist?.slug ?? null} />;
}
