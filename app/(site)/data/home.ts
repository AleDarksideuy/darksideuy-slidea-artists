/* ═══════════════════════════════════════════════════════════════
   CONTENIDO DE LA HOME
   Todos los textos de la página en un solo lugar. Artistas, temas y
   Spotlight siguen en artists.ts, discover.ts y spotlight.ts.
   ═══════════════════════════════════════════════════════════════ */

export const MANIFESTO = {
  lead: "Antes de que llegáramos, nadie lo concebía posible.",
  paragraphs: [
    "Llegamos a una ciudad del interior profundo de Uruguay sin red, sin capital, sin historia ahí. Con tres personas y una convicción: que el vacío cultural no es una condición permanente. Es una oportunidad.",
    "Construimos un ecosistema desde cero. Eventos, artistas, contenido audiovisual, relaciones institucionales. No como servicios. Como sistema.",
  ],
  closing: "Darkside UY no es una productora de eventos. Es una metodología aplicada al territorio. Y el territorio cambió.",
};

export const METRICS = [
  { value: 33, label: "Eventos en vivo" },
  { value: 10, label: "Formatos digitales" },
  { value: 15, label: "Meses de experimento" },
];

/* Lo que hace la productora con cada artista */
export const SERVICES = ["Identidad visual", "Redes", "Difusión", "Eventos", "Contenido audiovisual"];

export const LLAMADO = {
  baseCount: 450,
  storageKey: "artistsCount_v2",
  text: "De todo el mundo. La convocatoria sigue abierta. No buscamos portfolio. Buscamos intención.",
  endpoint:
    "https://script.google.com/macros/s/AKfycbxUElebu6pfhWXBUHUnoB6G7Iyy0sOsN4pjMhOIYFePh5tLIZ39W2bbeHz0ZWI3vdEAOg/exec",
  tipos: ["Musical", "Visual", "Digital"],
};

export const UNDERFEST = {
  title: "Skatepark Underfest",
  since: "Since 2023",
  place: "Manzana 19 — Plaza de deportes",
  /* Foto general del evento: abre las historias */
  cover: "/underfest/banner-6.jpg",
  /* Cada experiencia con la foto que la muestra (sin foto: placa tipográfica) */
  experiences: [
    {
      number: "01",
      title: "Sesión de skate",
      text: "Skaters del litoral. Unión que impulsa el deporte a través de sesiones no competitivas.",
      image: "/underfest/banner-2.jpg",
    },
    {
      number: "02",
      title: "Feria de emprendedores",
      text: "Emprendedores locales. Economía circular dentro del evento.",
      image: "/underfest/banner-1 .jpg",
    },
    {
      number: "03",
      title: "Show en vivo",
      text: "Artistas musicales en vivo. La plaza como escenario.",
      image: "/underfest/banner-3.jpg",
    },
    {
      number: "04",
      title: "Exposición de artes visuales",
      text: "Artistas del departamento. Intervención del espacio público.",
      image: null,
    },
    {
      number: "05",
      title: "Concurso de outfits",
      text: "Para la audiencia. La cultura como expresión individual.",
      image: "/underfest/banner-4.jpg",
    },
  ],
};

export const PRODUCTIONS = [
  {
    id: "naz",
    artist: "NAZ",
    title: "Fundirme de nuevo en un Abrazo",
    text: "Desarrollo completo del universo visual y musical del álbum.",
    cover: "/releases/naz-cover.webp",
    gallery: [1, 2, 3, 4, 5, 6, 7].map((n) => `/releases/visualizer-${n}.webp`),
    links: [
      { label: "Spotify", href: "https://open.spotify.com/intl-es/album/5OoZMtkcph4FzXOgyTQcom?si=dPj8_7NGSymYqeoqIe2SKA" },
      { label: "Videoclips", href: "https://youtube.com/playlist?list=PLGXkX-oM2avJABfYZvlaN28KT4AaBAyZg&si=ujrEOFQ0MDeIv0qz" },
    ],
  },
  {
    id: "cimarrones",
    artist: "Cimarrones",
    title: "Porfiao",
    text: "Desarrollo audiovisual y musical completo del proyecto.",
    cover: "/releases/porfiao-cover2.webp",
    gallery: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `/releases/porfiao-${n}.webp`),
    links: [
      { label: "Spotify", href: "https://open.spotify.com/intl-es/album/07t08qgwKvLTwTl9TKgAuF?si=5ORcxOB9S3G3ylk5IZMl1A" },
      { label: "Visualizers", href: "https://youtube.com/playlist?list=PLirZ0CJi5fSXAogL1Q8AH9QW8_lXZ8C5d&si=YL4qa9d8Q7wKTKVQ" },
    ],
  },
];

export const FORMATS = {
  subtitle: "Living Sessions / Intervenciones CGI / Visualizers",
  quote: "El contenido no fue el objetivo. Fue la evidencia.",
  items: [
    {
      id: "01",
      title: "Living Sessions",
      url: "https://youtube.com/playlist?list=PLKYACo2D96OLjeM5eS2j981odUL3hZpZ5&si=DxIZDk50foa63hU6",
      thumbnail: "/thumbnails/living.webp",
    },
    { id: "02", title: "Intervención Mercedes", url: "", thumbnail: null },
    {
      id: "03",
      title: "La Isla Sessions",
      url: "https://youtube.com/playlist?list=PLKYACo2D96OKVr4-x-E5oBngll0YJxtpu&si=Oc-KVIUsELmZxwlh",
      thumbnail: "/thumbnails/isla.webp",
    },
  ],
};

export const PLAYLISTS = {
  text: "Estamos preparando y curando una selección de playlists de artistas por descubrir para cualquier momento o mood del día.",
  items: [
    { name: "Dark Techno", subtitle: "Curated by Darkside" },
    { name: "After Hours", subtitle: "Late night selections" },
    { name: "Peak Time", subtitle: "Festival energy" },
  ],
};

export const TU_SEMANA = {
  kicker: "Para artistas nuevos",
  title: "¿Sabés en qué estado está tu carrera hoy?",
  text: "Siete días, tres tareas por día. Un diagnóstico real de lo que te falta para dar el próximo paso.",
  blocks: [
    "Tus siete días",
    "Tu material dormido",
    "Tus cuatro pilares",
    "Tu ficha técnica",
    "Tus textos",
    "Tus fechas del año",
    "Dónde estás parado",
  ],
  href: "/tu-semana-como-artista",
};

export const FIC = {
  title: "Fondo de Incentivo Cultural",
  org: "Ministerio de Educación y Cultura",
  year: "2026",
  logo: "/logos/fic.png",
  text: "Darkside fue seleccionado como proyecto cultural sostenible por el FIC del MEC, validando su impacto en el desarrollo artístico, la generación de audiencias y la construcción de un ecosistema cultural en el territorio.",
};

export const PARTNERS = {
  text: "Darkside articula con instituciones públicas y privadas para desarrollar proyectos culturales con impacto real en el territorio.",
  items: [
    { title: "Soriano Fértil", subtitle: "Intendencia de Soriano", logo: "/logos/soriano-fertil.png" },
    { title: "INJU", subtitle: "Instituto Nacional de la Juventud", logo: "/logos/INJU BLANCO SIN FONDO.png" },
    { title: "Abitab", subtitle: "Red de Cobranza de Uruguay", logo: "/logos/abitab (2).png" },
  ],
};

export const MAGAZINE = {
  edition: "02",
  text: "Plataforma editorial que documenta y amplifica las voces culturales del interior profundo. Cada edición es un corte transversal del ecosistema que estamos construyendo.",
};

export const TERRITORIO = {
  departamentos: ["MALDONADO", "SORIANO", "RIO NEGRO", "PAYSANDÚ", "SALTO", "DURAZNO", "SAN JOSÉ", "COLONIA"],
  text: "El experimento continúa. El sistema es transferible. La condición de extraño vuelve a activarse.",
};

export const CONTACT = {
  email: "productora@darksideuy.com",
  emailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=productora@darksideuy.com",
  instagram: "https://www.instagram.com/darkside.uy",
  sponsors:
    "El proyecto tiene track record, FIC ganado y metodología documentada. Si tu organización quiere estar donde la cultura ocurre antes de que sea mainstream, hablemos.",
  artists:
    "Desarrollamos proyectos integrales. Producción audiovisual, desarrollo de carrera, sello. No buscamos servicios. Buscamos colaboraciones reales.",
};
