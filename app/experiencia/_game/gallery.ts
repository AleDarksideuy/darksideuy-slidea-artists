import { artists } from "../../(site)/data/artists";

/* Distribución de la Galería de Artistas: un pasillo con carteles a
   ambos lados. Se arma sola a partir de data/artists.ts, así que un
   artista nuevo aparece en el mundo sin tocar nada acá. */

export const SPACING = 4.2; // distancia entre carteles a lo largo del pasillo
export const POSTER_X = 4.4; // distancia del cartel al centro del pasillo
export const WALK_X = 3; // hasta dónde puede caminar el personaje a los lados
export const INTERACT_RADIUS = 2.4;
export const START_Z = 4;

export type PosterSlot = {
  slug: string;
  side: -1 | 1;
  position: [number, number, number];
  rotationY: number;
  /* Punto del pasillo frente al cartel */
  spot: [number, number];
};

export const posterSlots: PosterSlot[] = artists.map((artist, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const z = -Math.floor(i / 2) * SPACING - 2;

  return {
    slug: artist.slug,
    side,
    position: [side * POSTER_X, 0, z],
    /* Girados hacia la cámara para que se lean bien desde arriba */
    rotationY: -side * 0.55,
    spot: [side * (WALK_X - 0.4), z + 0.6],
  };
});

export const END_Z = posterSlots[posterSlots.length - 1].position[2] - 5;

export function slotFor(slug: string) {
  return posterSlots.find((slot) => slot.slug === slug) ?? null;
}
