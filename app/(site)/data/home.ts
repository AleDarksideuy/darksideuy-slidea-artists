import { PRODUCT_LAUNCHED } from "./proximamente";

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
  cover: "/underfest/portada.jpg",
  /* Cada experiencia con la foto que la muestra (sin foto: placa tipográfica) */
  experiences: [
    {
      number: "01",
      title: "Sesión de skate",
      text: "Skaters del litoral. Unión que impulsa el deporte a través de sesiones no competitivas.",
      image: "/underfest/skate.jpg",
    },
    {
      number: "02",
      title: "Feria de emprendedores",
      text: "Emprendedores locales. Economía circular dentro del evento.",
      image: "/underfest/feria.jpg",
    },
    {
      number: "03",
      title: "Show en vivo",
      text: "Artistas musicales en vivo. La plaza como escenario.",
      image: "/underfest/show-musical.jpg",
    },
    {
      number: "04",
      title: "Exposición de artes visuales",
      text: "Artistas del departamento. Intervención del espacio público.",
      image: "/underfest/exposicion-artes-visuales.jpg",
    },
    {
      number: "05",
      title: "Concurso de outfits",
      text: "Para la audiencia. La cultura como expresión individual.",
      image: "/underfest/concurso-outfits.jpg",
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
    /* Sin url: se muestra bloqueada como "Próximamente" */
    { id: "02", title: "El Patio Session", url: "", thumbnail: "/thumbnails/patio.webp" },
    {
      id: "03",
      title: "La Isla Sessions",
      url: "https://youtube.com/playlist?list=PLKYACo2D96OKVr4-x-E5oBngll0YJxtpu&si=Oc-KVIUsELmZxwlh",
      thumbnail: "/thumbnails/isla.webp",
    },
  ],
};

export const JUAN_MAIDANA = {
  id: "juan-maidana",
  /* Título de la sección: la separa de Producciones y Formatos visuales */
  kicker: "Planificación y programación de contenido",
  title: "Juan Maidana",
  name: "Juan Maidana",
  surname: "Maidana",
  role: "Creador de contenido · Mercedes, Soriano",
  text: "Entrevistas de calle, humor y cobertura de eventos. Darkside lleva la planificación y la programación de todo su contenido.",
  photo: "/juan-maidana/juan-maidana.webp",
  /* El caso: la cobertura de la fiesta */
  event: "Fiesta Nacional de la Primavera",
  place: "Dolores · 10 y 11 de octubre de 2026",
  total: 6051935,
  totalLabel: "reproducciones",
  reach: { prefix: "y más de", value: 3795247, label: "cuentas alcanzadas" },
  stats: [
    { value: 788, label: "piezas publicadas", detail: "Reels · Carruseles · Stories" },
    { value: 4, label: "plataformas", detail: "Instagram · TikTok · YouTube · Facebook" },
  ],
  /* Franja de ancho completo debajo de las tarjetas */
  span: { title: "En solo 10 días", detail: "De Dolores a Nueva Palmira" },
  closing: "Una cobertura completa de la fiesta, publicada mientras la fiesta pasaba.",
};

/* Skaters del Interior. Reglas de comunicación de la liga: el nombre es
   "Skaters del Interior" (nunca "nacional"), no se nombran otras
   organizaciones, no se publican montos ni datos de riders, y la final no
   lleva fecha hasta que esté definida. La numeración es la de la liga. */
export const LIGA_SKATERS = {
  id: "skaters-del-interior",
  kicker: "Skaters del Interior · La Liga",
  title: ["Skaters", "del Interior"],
  lead: "La única liga under del skate uruguayo.",
  text: "Cada fecha tiene su propio ganador: no hay puntaje ni clasificación. En diciembre hay una final que premia a todos los que participaron.",
  where: "Tres fechas entre setiembre y diciembre de 2026, en Mercedes, Soriano.",
  backdrop: "Liga",
  why: "En cada fecha aparecen riders de ciudades que están a cientos de kilómetros. Algunos llegan de lugares donde no hay ni una pista donde andar.",
  whyStrong: "Por eso esto existe: para que no haya que irse del departamento para encontrarse con otros que hacen lo mismo.",
  join: {
    label: "Quién puede correr",
    title: "Cualquiera con una tabla",
    text: "La única condición es tener una tabla y ganas de andar. Se viene a compartir con colegas, a mirar de cerca a los que andan bien, y a ganarse un lugar que no lo da nadie más que la pista.",
  },
  /* date: día de la fecha (hora de Uruguay). Sin date, la fecha no está definida.
     El estado (realizada / próxima) se calcula solo con el día de hoy. */
  dates: [
    { name: "Fecha 1", day: "Sábado 19 de setiembre", date: "2026-09-19", place: "Mercedes, Soriano" },
    { name: "Fecha 2", day: "Sábado 31 de octubre", date: "2026-10-31", place: "Mercedes, Soriano", tag: "Halloween" },
    { name: "Final", day: "Diciembre", date: null, place: "Mercedes, Soriano" },
  ],
  /* Tarjeta de la fecha 2: se muestra solo hasta que pasa el 31 */
  next: {
    date: "2026-10-31",
    kicker: "Fecha 2 · Sábado 31 de octubre",
    title: "Vuelve el skate a Mercedes",
    text: "El 31 de octubre vuelve el skate a Mercedes. Segunda etapa de la liga Skaters del Interior, con riders de todo el país y, por primera vez, de la otra orilla. Es sábado y es Halloween: además de la fecha hay concurso de disfraces, y para ese no hace falta saber andar.",
  },
  /* Galería de la Fecha 1, "el rollo". La primera foto es la grande del collage.
     Cada foto: { src: "/skaters-del-interior/archivo.webp", alt: "…", width, height }.
     Si la lista queda vacía, la sección no muestra la galería. */
  gallery: {
    kicker: "El rollo de la Fecha 1",
    title: "Fecha 1 · Sábado 19 de setiembre",
    day: "19·09",
    place: "Mercedes, Soriano",
    photos: [
      { src: "/skaters-del-interior/fecha1-05.webp", alt: "Rider en el aire contra el cielo, con la tabla bajo los pies y el público mirando desde abajo", width: 1440, height: 1800 },
      { src: "/skaters-del-interior/fecha1-03.webp", alt: "Rider de gorra deslizando sobre el cajón azul, con la gente mirando detrás", width: 1440, height: 1800 },
      { src: "/skaters-del-interior/fecha1-04.webp", alt: "Rider de negro saltando la baranda frente a la gente que mira desde la rampa", width: 1440, height: 1800 },
      { src: "/skaters-del-interior/fecha1-02.webp", alt: "Rider en el aire con la tabla girando debajo de los pies", width: 1440, height: 1800 },
      { src: "/skaters-del-interior/fecha1-07.webp", alt: "Rider de pantalón rojo andando sobre la rampa pintada, visto desde arriba", width: 1440, height: 1800 },
      { src: "/skaters-del-interior/fecha1-01.webp", alt: "Rider sin remera con la tabla sobre la baranda, con las rampas celestes detrás", width: 1440, height: 1800 },
      { src: "/skaters-del-interior/fecha1-06.webp", alt: "Rider con la tabla en vertical sobre el borde del cajón, al atardecer", width: 1440, height: 1800 },
    ] as { src: string; alt: string; width: number; height: number }[],
  },
};

export const PLAYLISTS = {
  text: "Estamos preparando y curando una selección de playlists de artistas por descubrir para cualquier momento o mood del día.",
  items: [
    { name: "SkatePark Underfest Playlist", subtitle: "by POC Music" },
    { name: "Artistas Emergentes", subtitle: "Curated by Darkside" },
  ],
};

export const TU_SEMANA = {
  /* Se lanza con PRODUCT_LAUNCHED (data/proximamente.ts) */
  launched: PRODUCT_LAUNCHED,
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
  edition: "03",
  text: "Plataforma editorial que documenta y amplifica las voces culturales del interior profundo. Cada edición es un corte transversal del ecosistema que estamos construyendo.",
};

export const TERRITORIO = {
  departamentos: ["MALDONADO", "SORIANO", "RIO NEGRO", "PAYSANDÚ", "SALTO", "DURAZNO", "SAN JOSÉ", "COLONIA"],
  text: "El experimento continúa. El sistema es transferible. La condición de extraño vuelve a activarse.",
};

export const CONTACT = {
  email: "productora@darksideuy.com",
  emailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=productora@darksideuy.com",
  /* Formulario "Hablemos": los mensajes los envía Web3Forms al correo de
     arriba. La clave es pública por diseño (solo sirve para mandar a ese
     correo); se pide gratis en https://web3forms.com con ese correo. */
  formKey: "a98bbd81-0010-4317-8e02-ee95b75d4819",
  topics: ["Soy artista", "Sponsor / institución", "Prensa", "Otro"],
  instagram: "https://www.instagram.com/darkside.uy",
  sponsors:
    "El proyecto tiene track record, FIC ganado y metodología documentada. Si tu organización quiere estar donde la cultura ocurre antes de que sea mainstream, hablemos.",
  artists:
    "Desarrollamos proyectos integrales. Producción audiovisual, desarrollo de carrera, sello. No buscamos servicios. Buscamos colaboraciones reales.",
};
