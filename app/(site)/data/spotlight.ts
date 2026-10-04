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
  /* Fecha de lanzamiento "AAAA-MM", para ordenar */
  date: string;
  genre: string;
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
    id: 1,
    artist: "Los Espejos",
    release: "No La Mires Mas",
    type: "Album",
    year: "2025",
    date: "2025-07",
    genre: "Rock",
    image: "/artists/releases/No_La_Mires_Mas_Cover.jpg",
    spotify: "https://open.spotify.com/intl-es/album/6mFX6M5lqDCX8uDC2nGuy9?si=N3NihFvrQUCHzim80uHGWQ",
  },
  {
    id: 3,
    artist: "Carlín Levratto",
    release: "El Viaje",
    type: "EP",
    year: "2025",
    date: "2025-12",
    genre: "Música Popular",
    image: "/artists/carlin levratto.webp",
    spotify: "https://open.spotify.com/intl-es/album/4cE85eWxivS3nw7NC5sxZU?si=I4U2Xei3SMOJhlJpCr3-kg",
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
