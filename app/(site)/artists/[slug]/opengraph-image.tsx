import { ImageResponse } from "next/og";

import { artists } from "../../data/artists";
import { imageData, monogramData, OG_SIZE, RED, toJpegResponse } from "../../og";

export const alt = "Artista de Darkside UY";
export const size = OG_SIZE;
export const contentType = "image/jpeg";

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

/* Imagen al compartir la ficha: foto del artista, nombre y género */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = artists.find((a) => a.slug === slug) ?? artists[0];
  const [photo, monogram] = await Promise.all([imageData(artist.image, OG_SIZE), monogramData(96)]);

  const image = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#000" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} width={OG_SIZE.width} height={OG_SIZE.height} alt="" style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.1) 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 72, bottom: 72, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 26, color: RED, letterSpacing: 5 }}>
            {`${artist.city} · ${artist.country}`.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{artist.name}</div>
          <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.8)" }}>{artist.category}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={monogram} width={84} height={84} alt="" style={{ position: "absolute", top: 56, right: 64 }} />
      </div>
    ),
    size
  );

  return toJpegResponse(image);
}
