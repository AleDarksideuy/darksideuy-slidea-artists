"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { artists } from "../../data/artists";
import ArtistOverlay from "../ArtistOverlay";

type ArtistPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ArtistPage({
  params,
}: ArtistPageProps) {
  const { slug } = use(params);

  const router = useRouter();

  const artist = artists.find(
    (artist) => artist.slug === slug
  );

  if (!artist) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">
          Artista no encontrado
        </h1>
      </main>
    );
  }

  return (
    <ArtistOverlay
      artist={artist}
      onClose={() => router.push("/")}
    />
  );
}