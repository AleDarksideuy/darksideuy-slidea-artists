import type { Metadata } from "next";

import { artists } from "../../data/artists";
import ArtistPageClient from "./ArtistPageClient";

type ArtistPageProps = {
  params: Promise<{ slug: string }>;
};

/* Las fichas se generan de antemano: cargan al instante */
export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

/* Título y descripción al compartir el link del artista.
   La imagen la genera opengraph-image.tsx con la foto del artista. */
export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = artists.find((a) => a.slug === slug);
  if (!artist) return { title: "Artista no encontrado" };

  const description =
    artist.description ||
    `${artist.category} · ${artist.city}, ${artist.country}. Artista del ecosistema Darkside UY.`;

  return {
    title: artist.name,
    description,
    openGraph: { title: `${artist.name} — Darkside UY`, description, type: "profile" },
    twitter: { title: `${artist.name} — Darkside UY`, description },
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  return <ArtistPageClient slug={slug} />;
}
