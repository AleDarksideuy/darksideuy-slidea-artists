"use client";

import { useRouter } from "next/navigation";

import { artists } from "../../data/artists";
import ArtistOverlay from "../ArtistOverlay";

/* La ficha del artista a pantalla completa (la misma que se abre desde la home) */
export default function ArtistPageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const artist = artists.find((a) => a.slug === slug);

  if (!artist) {
    return (
      <main className="min-h-dvh bg-black flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">Artista no encontrado</h1>
      </main>
    );
  }

  return <ArtistOverlay artist={artist} onClose={() => router.push("/")} />;
}
