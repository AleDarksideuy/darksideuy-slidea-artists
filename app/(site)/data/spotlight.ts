/* ═══════════════════════════════════════════════════════════════
   SPOTLIGHT — ÚLTIMOS LANZAMIENTOS
   Para sumar uno nuevo, agregalo a la lista con su fecha ("date",
   año-mes): la sección los ordena sola, del más nuevo al más viejo.
   ═══════════════════════════════════════════════════════════════ */

export type SpotlightRelease = {
  id: number;
  artist: string;
  release: string;
  type: string;
  year: string;
  /* Fecha de lanzamiento "AAAA-MM" o "AAAA-MM-DD", para ordenar */
  date: string;
  genre?: string;
  image: string;
  spotify?: string;
  youtube?: string;
};

const releases: SpotlightRelease[] = [
  {
    id: 5,
    artist: "Zonno",
    release: "Otra Vez En La Luna",
    type: "Album",
    year: "2026",
    date: "2026-10",
    genre: "Soul / Funk",
    image: "/releases/otra vez en la luna.webp",
    spotify: "https://open.spotify.com/intl-es/album/4h0wRnIF4f49OemwwCOgnD",
  },
  {
    id: 6,
    artist: "Cimarrones",
    release: "Porfiao",
    type: "Album",
    year: "2026",
    date: "2026-01-03",
    genre: "Rap / Hip-Hop",
    image: "/releases/porfiao-cover2.webp",
    spotify: "https://open.spotify.com/intl-es/album/07t08qgwKvLTwTl9TKgAuF?si=5ORcxOB9S3G3ylk5IZMl1A",
    youtube: "https://youtube.com/playlist?list=PLirZ0CJi5fSXAogL1Q8AH9QW8_lXZ8C5d&si=YL4qa9d8Q7wKTKVQ",
  },
  {
    id: 7,
    artist: "NAZ",
    release: "Fundirme de nuevo en un Abrazo",
    type: "Album",
    year: "2026",
    date: "2026-04-12",
    image: "/releases/naz-cover.webp",
    spotify: "https://open.spotify.com/intl-es/album/5OoZMtkcph4FzXOgyTQcom?si=dPj8_7NGSymYqeoqIe2SKA",
    youtube: "https://youtube.com/playlist?list=PLGXkX-oM2avJABfYZvlaN28KT4AaBAyZg&si=ujrEOFQ0MDeIv0qz",
  },
  {
    id: 4,
    artist: "Lupretinia",
    release: "202X",
    type: "Album",
    year: "2026",
    date: "2026-06",
    genre: "Dreampop",
    image: "/artists/lupretinia.jpeg",
    spotify: "https://open.spotify.com/intl-es/album/2K0WBdwP9MfmNdWYNMzWmd?si=SY8rXus3ROCpQw2vYhkJaA",
    youtube: "https://www.youtube.com/watch?v=JZ956cujxHA&list=PLXg3yFiZVnJXgLuFb2Vo5ldmN4h_Fr-ST",
  },
];

/* Del más nuevo al más viejo */
export const spotlightArtists = [...releases].sort((a, b) => b.date.localeCompare(a.date));
