import { artists } from "../../(site)/data/artists";
import { undergroundTracks } from "../../(site)/data/discover";
import { spotlightArtists } from "../../(site)/data/spotlight";

/* ═══════════════════════════════════════════════════════════════
   EL MAPA DEL MUNDO
   Cada zona es una lista de "estaciones" (cosas con las que el
   personaje interactúa). Artistas, temas y spotlight salen solos de
   data/*.ts; el resto de los textos son los mismos que la landing.
   ═══════════════════════════════════════════════════════════════ */

export const RED = "#E50914";

export type ZoneId = "lobby" | "artistas" | "musica" | "underfest" | "producciones" | "semana";

/* Secciones reales del sitio que se abren como panel */
export type SectionId =
  | "underfest"
  | "darksidePick"
  | "spotlight"
  | "playlists"
  | "llamado"
  | "fic"
  | "partners"
  | "magazine"
  | "production"
  | "releases"
  | "territorio"
  | "contacto";

export type CardLink = { label: string; href: string };

export type Card = {
  kicker: string;
  title: string;
  image?: string;
  body?: string[];
  links?: CardLink[];
  section?: { id: SectionId; label: string };
};

export type Action =
  | { type: "artist"; slug: string }
  | { type: "card"; card: Card }
  | { type: "section"; section: SectionId }
  | { type: "track"; trackId: string }
  | { type: "portal"; zone: ZoneId };

export type Visual =
  | { kind: "poster"; image: string; fit?: "cover" | "contain"; w?: number; h?: number }
  | { kind: "sign"; kicker?: string; title: string; body?: string }
  | { kind: "disc"; image: string }
  | { kind: "pillar"; number: string }
  | { kind: "portal" };

export type Station = {
  id: string;
  label: string;
  hint: string; // texto del aviso: "Ver artista", "Escuchar", "Ir a…"
  position: [number, number]; // x, z
  rotationY: number;
  visual: Visual;
  action: Action;
};

export type Zone = {
  id: ZoneId;
  kicker: string;
  title: string;
  description: string;
  spawn: [number, number];
  /* Paredes del salón */
  room: { halfWidth: number; minZ: number; maxZ: number };
  /* Hasta dónde camina el personaje */
  walk: { minX: number; maxX: number; minZ: number; maxZ: number };
  stations: Station[];
};

/* Punto del piso frente a una estación, donde aparece el aviso */
export function stationSpot(station: Station): [number, number] {
  const distance = station.visual.kind === "portal" ? 1.4 : 1.7;
  return [
    station.position[0] + Math.sin(station.rotationY) * distance,
    station.position[1] + Math.cos(station.rotationY) * distance,
  ];
}

/* ───────────────────────── Pasillos ─────────────────────────
   La mayoría de las zonas son un pasillo con estaciones a ambos
   lados y un portal de vuelta al lobby al fondo. */

type Item = Omit<Station, "position" | "rotationY">;

const SPACING = 4.2;
const SIDE_X = 4.4;

function corridor(base: Omit<Zone, "spawn" | "room" | "walk" | "stations">, items: Item[]): Zone {
  const stations: Station[] = items.map((item, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    return {
      ...item,
      position: [side * SIDE_X, -Math.floor(i / 2) * SPACING - 1],
      rotationY: -side * 0.55,
    };
  });

  const lastZ = stations[stations.length - 1].position[1];
  const endZ = lastZ - 5.5;

  stations.push({
    id: "volver",
    label: "LOBBY",
    hint: "Volver al lobby",
    position: [0, endZ],
    rotationY: 0,
    visual: { kind: "portal" },
    action: { type: "portal", zone: "lobby" },
  });

  return {
    ...base,
    spawn: [0, 5],
    room: { halfWidth: 7.5, minZ: endZ - 3, maxZ: 9 },
    walk: { minX: -3, maxX: 3, minZ: endZ + 1.6, maxZ: 7 },
    stations,
  };
}

/* ───────────────────────── Lobby ───────────────────────── */

const PORTALS: { zone: ZoneId; label: string }[] = [
  { zone: "artistas", label: "ARTISTAS" },
  { zone: "musica", label: "MÚSICA" },
  { zone: "underfest", label: "UNDERFEST" },
  { zone: "producciones", label: "PRODUCCIONES" },
  { zone: "semana", label: "TU SEMANA" },
];

const LOBBY_INFO: Item[] = [
  {
    id: "llamado",
    label: "LLAMADO DE ARTISTAS",
    hint: "Aplicar como artista",
    visual: {
      kind: "sign",
      kicker: "Convocatoria abierta",
      title: "Llamado de artistas",
      body: "De todo el mundo. La convocatoria sigue abierta.",
    },
    action: { type: "section", section: "llamado" },
  },
  {
    id: "fic",
    label: "FIC · MEC",
    hint: "Ver más",
    visual: { kind: "poster", image: "/logos/fic.png", fit: "contain", w: 2.2, h: 2.2 },
    action: {
      type: "card",
      card: {
        kicker: "Seleccionado · Ministerio de Educación y Cultura",
        title: "Fondo de Incentivo Cultural",
        image: "/logos/fic.png",
        body: [
          "El Fondo de Incentivo Cultural (FIC) del Ministerio de Educación y Cultura (MEC) de Uruguay es un mecanismo de financiamiento que permite la captación de recursos privados para proyectos artístico-culturales declarados de fomento.",
          "En este marco, Darkside fue seleccionado como proyecto cultural sostenible, validando su impacto en el desarrollo artístico, la generación de audiencias y la construcción de un ecosistema cultural en el territorio.",
        ],
        section: { id: "fic", label: "Ver sección FIC" },
      },
    },
  },
  {
    id: "magazine",
    label: "MAGAZINE",
    hint: "Ver revista",
    visual: {
      kind: "sign",
      kicker: "Revista cultural",
      title: "Darkside Magazine",
      body: "Plataforma editorial que documenta y amplifica las voces culturales del interior profundo.",
    },
    action: { type: "section", section: "magazine" },
  },
  {
    id: "partners",
    label: "PARTNERS",
    hint: "Ver partners",
    visual: { kind: "poster", image: "/logos/soriano-fertil.png", fit: "contain", w: 2.2, h: 2.2 },
    action: {
      type: "card",
      card: {
        kicker: "Partners",
        title: "Soriano Fértil · INJU · Abitab",
        body: [
          "Darkside articula con instituciones públicas y privadas para desarrollar proyectos culturales con impacto real en el territorio.",
          "Nuestros colaboradores forman parte activa de un ecosistema que impulsa el crecimiento artístico, la generación de audiencias y la profesionalización de la escena local.",
        ],
        links: [
          {
            label: "Quiero colaborar",
            href: "https://mail.google.com/mail/?view=cm&fs=1&to=productora@darksideuy.com",
          },
        ],
        section: { id: "partners", label: "Ver sección Partners" },
      },
    },
  },
  {
    id: "contacto",
    label: "CONTACTO",
    hint: "Contactar",
    visual: {
      kind: "sign",
      kicker: "Contacto",
      title: "Hablemos",
      body: "Para sponsors, instituciones y artistas.",
    },
    action: {
      type: "card",
      card: {
        kicker: "Contacto",
        title: "Hablemos",
        body: [
          "Para sponsors e instituciones: el proyecto tiene track record, FIC ganado y metodología documentada. Si tu organización quiere estar donde la cultura ocurre antes de que sea mainstream, hablemos.",
          "Para artistas: desarrollamos proyectos integrales. Producción audiovisual, desarrollo de carrera, sello. No buscamos servicios. Buscamos colaboraciones reales.",
        ],
        links: [
          {
            label: "productora@darksideuy.com",
            href: "https://mail.google.com/mail/?view=cm&fs=1&to=productora@darksideuy.com",
          },
          { label: "Instagram", href: "https://www.instagram.com/darkside.uy" },
        ],
        section: { id: "contacto", label: "Ver sección Contacto" },
      },
    },
  },
  {
    id: "territorio",
    label: "PRÓXIMO TERRITORIO",
    hint: "Ver más",
    visual: {
      kind: "sign",
      kicker: "Est. 2026",
      title: "Próximo territorio",
      body: "El experimento continúa. El sistema es transferible.",
    },
    action: { type: "section", section: "territorio" },
  },
];

function lobby(): Zone {
  const R_PORTAL = 11.5;
  const R_INFO = 6.4;
  const deg = Math.PI / 180;

  const portals: Station[] = PORTALS.map(({ zone, label }, i) => {
    const angle = (-60 + i * 30) * deg;
    return {
      id: `portal-${zone}`,
      label,
      hint: `Ir a ${label.charAt(0)}${label.slice(1).toLowerCase()}`,
      position: [Math.sin(angle) * R_PORTAL, -Math.cos(angle) * R_PORTAL],
      rotationY: -angle,
      visual: { kind: "portal" },
      action: { type: "portal", zone },
    };
  });

  const info: Station[] = LOBBY_INFO.map((item, i) => {
    const angle = (-80 + i * 32) * deg;
    return {
      ...item,
      position: [Math.sin(angle) * R_INFO, -Math.cos(angle) * R_INFO],
      rotationY: -angle,
    };
  });

  const front: Station[] = [
    {
      id: "manifiesto",
      label: "MANIFIESTO",
      hint: "Leer",
      position: [-9, 3.5],
      rotationY: 0.65,
      visual: {
        kind: "sign",
        kicker: "Mercedes, Uruguay",
        title: "Productora cultural independiente",
        body: "El vacío cultural no es una condición permanente. Es una oportunidad.",
      },
      action: {
        type: "card",
        card: {
          kicker: "Productora cultural independiente — Mercedes, Uruguay — 2026",
          title: "Darkside UY",
          image: "/Darksideuy.png",
          body: [
            "Antes de que llegáramos, nadie lo concebía posible. Llegamos a una ciudad del interior profundo de Uruguay sin red, sin capital, sin historia ahí. Con tres personas y una convicción: que el vacío cultural no es una condición permanente. Es una oportunidad.",
            "Construimos un ecosistema desde cero. Eventos, artistas, contenido audiovisual, relaciones institucionales. No como servicios. Como sistema.",
            "Darkside UY no es una productora de eventos. Es una metodología aplicada al territorio. Y el territorio cambió.",
          ],
        },
      },
    },
    {
      id: "semana-promo",
      label: "TU SEMANA COMO ARTISTA",
      hint: "Ver",
      position: [9, 3.5],
      rotationY: -0.65,
      visual: {
        kind: "sign",
        kicker: "Para los que comentaron",
        title: "Tu semana como artista",
        body: "Siete días, tres cosas por día. El sistema con el que ordenamos a nuestros artistas.",
      },
      action: { type: "card", card: SEMANA_CTA() },
    },
  ];

  return {
    id: "lobby",
    kicker: "Zona 00",
    title: "Lobby",
    description: "El punto de partida. Desde acá se llega a todas las zonas.",
    spawn: [0, 5],
    room: { halfWidth: 14, minZ: -15.5, maxZ: 10 },
    walk: { minX: -12, maxX: 12, minZ: -12.5, maxZ: 7 },
    stations: [...portals, ...info, ...front],
  };
}

/* ───────────────────────── Tu semana ───────────────────────── */

function SEMANA_CTA(): Card {
  return {
    kicker: "Tu semana como artista",
    title: "Quiero el archivo",
    body: [
      "No podemos tomar a todos los artistas que nos escriben. Así que agarramos el sistema con el que ordenamos a nuestros artistas y lo convertimos en un archivo que podés usar solo, sin nosotros.",
      "No es un PDF. Es una herramienta que se llena, se guarda sola y te devuelve un diagnóstico con números.",
    ],
    links: [{ label: "Ver precio y conseguirlo", href: "/tu-semana-como-artista#precio" }],
  };
}

const SEMANA_BLOCKS = [
  ["Tus siete días", "Tres cosas por día. Arrancan cuando abrís el archivo."],
  ["Tu material dormido", "Convierte lo que ya grabaste en piezas posibles. Casi siempre sorprende."],
  ["Tus cuatro pilares", "Te muestra a quién le estás hablando y a quién no."],
  ["Tu ficha técnica", "Lo primero que pide un lugar. Se copia con un botón."],
  ["Tus textos", "Las tres biografías, con detector de frases genéricas."],
  ["Tus fechas del año", "Ventanas de fondos y los papeles que hay que tener antes."],
  ["Dónde estás parado", "El diagnóstico. Seis ejes, calculado con todo lo de arriba."],
];

/* ───────────────────────── Todas las zonas ───────────────────────── */

function buildZones(): Record<ZoneId, Zone> {
  const artistas = corridor(
    {
      id: "artistas",
      kicker: "Zona 01",
      title: "Galería de artistas",
      description: "Acercate a cada artista y descubrí su música y sus links.",
    },
    [
      ...artists.map<Item>((artist) => ({
        id: artist.slug,
        label: artist.name,
        hint: "Ver artista",
        visual: { kind: "poster", image: artist.image },
        action: { type: "artist", slug: artist.slug },
      })),
      {
        id: "llamado",
        label: "LLAMADO DE ARTISTAS",
        hint: "Aplicar como artista",
        visual: {
          kind: "sign",
          kicker: "¿Querés estar acá?",
          title: "Llamado de artistas",
          body: "La convocatoria sigue abierta.",
        },
        action: { type: "section", section: "llamado" },
      },
    ]
  );

  const musica = corridor(
    {
      id: "musica",
      kicker: "Zona 02",
      title: "Música",
      description: "Darkside's Pick, Spotlight y playlists. Acercate a un disco para escucharlo.",
    },
    [
      {
        id: "pick",
        label: "DARKSIDE'S PICK",
        hint: "Abrir reproductor",
        visual: {
          kind: "sign",
          kicker: "Darkside's Pick",
          title: "Música de artistas emergentes",
          body: "Seleccionada por Darkside. Acercate a cada disco para escucharlo.",
        },
        action: { type: "section", section: "darksidePick" },
      },
      {
        id: "spotlight",
        label: "SPOTLIGHT",
        hint: "Ver Spotlight",
        visual: {
          kind: "sign",
          kicker: "Spotlight",
          title: "Últimos lanzamientos",
          body: "Descubre a artistas y sus últimos lanzamientos en distintas plataformas.",
        },
        action: { type: "section", section: "spotlight" },
      },
      ...undergroundTracks.map<Item>((track) => ({
        id: track.id,
        label: track.title.toUpperCase(),
        hint: "Escuchar",
        visual: { kind: "disc", image: track.cover },
        action: { type: "track", trackId: track.id },
      })),
      ...spotlightArtists.map<Item>((item) => ({
        id: `spotlight-${item.id}`,
        label: item.artist.toUpperCase(),
        hint: "Ver lanzamiento",
        visual: { kind: "poster", image: item.image },
        action: {
          type: "card",
          card: {
            kicker: `Spotlight · ${item.type} · ${item.year}`,
            title: `${item.artist} — ${item.release}`,
            image: item.image,
            body: [item.genre],
            links: [
              ...(item.spotify ? [{ label: "Spotify", href: item.spotify }] : []),
              ...("youtube" in item && item.youtube ? [{ label: "YouTube", href: item.youtube }] : []),
            ],
            section: { id: "spotlight", label: "Ver todo el Spotlight" },
          },
        },
      })),
      {
        id: "playlists",
        label: "PLAYLISTS",
        hint: "Ver playlists",
        visual: {
          kind: "sign",
          kicker: "En desarrollo",
          title: "Playlists",
          body: "Una selección de artistas por descubrir para cualquier momento o mood del día.",
        },
        action: { type: "section", section: "playlists" },
      },
    ]
  );

  const UNDERFEST_EXPERIENCES = [
    ["01", "Sesión de skate", "Skaters del litoral. Unión que impulsa el deporte a través de sesiones no competitivas."],
    ["02", "Feria de emprendedores", "Emprendedores locales. Economía circular dentro del evento."],
    ["03", "Show en vivo", "Artistas musicales en vivo. La plaza como escenario."],
    ["04", "Exposición de artes visuales", "Artistas del departamento. Intervención del espacio público."],
    ["05", "Concurso de outfits", "Para la audiencia. La cultura como expresión individual."],
  ];
  const UNDERFEST_BANNERS = [
    "/underfest/banner-1 .jpg",
    "/underfest/banner-2.jpg",
    "/underfest/banner-3.jpg",
    "/underfest/banner-4.jpg",
    "/underfest/banner-6.jpg",
  ];

  const underfest = corridor(
    {
      id: "underfest",
      kicker: "Zona 03",
      title: "Skatepark Underfest",
      description: "Since 2023 · Manzana 19 — Plaza de deportes.",
    },
    [
      {
        id: "underfest-intro",
        label: "UNDERFEST",
        hint: "Ver Underfest",
        visual: {
          kind: "sign",
          kicker: "Since 2023",
          title: "Skatepark Underfest",
          body: "Manzana 19 — Plaza de deportes.",
        },
        action: { type: "section", section: "underfest" },
      },
      ...UNDERFEST_EXPERIENCES.flatMap<Item>(([number, title, text], i) => [
        {
          id: `banner-${i}`,
          label: `UNDERFEST · ${number}`,
          hint: "Ver foto",
          visual: { kind: "poster", image: UNDERFEST_BANNERS[i] },
          action: {
            type: "card",
            card: {
              kicker: "Skatepark Underfest",
              title,
              image: UNDERFEST_BANNERS[i],
              body: [text],
              section: { id: "underfest", label: "Ver sección Underfest" },
            },
          },
        },
        {
          id: `experiencia-${number}`,
          label: title.toUpperCase(),
          hint: "Ver",
          visual: { kind: "pillar", number },
          action: {
            type: "card",
            card: {
              kicker: `Experiencia ${number}`,
              title,
              body: [text],
              section: { id: "underfest", label: "Ver sección Underfest" },
            },
          },
        },
      ]),
    ]
  );

  const producciones = corridor(
    {
      id: "producciones",
      kicker: "Zona 04",
      title: "Producciones",
      description: "Producciones, dirección creativa y formatos visuales.",
    },
    [
      {
        id: "naz",
        label: "NAZ",
        hint: "Ver producción",
        visual: { kind: "poster", image: "/releases/naz-cover.jpeg" },
        action: {
          type: "card",
          card: {
            kicker: "Producción · NAZ",
            title: "Fundirme de nuevo en un Abrazo",
            image: "/releases/naz-cover.jpeg",
            body: ["Desarrollo completo del universo visual y musical del álbum."],
            links: [
              {
                label: "Spotify",
                href: "https://open.spotify.com/intl-es/album/5OoZMtkcph4FzXOgyTQcom?si=dPj8_7NGSymYqeoqIe2SKA",
              },
              {
                label: "Videoclips",
                href: "https://youtube.com/playlist?list=PLGXkX-oM2avJABfYZvlaN28KT4AaBAyZg&si=ujrEOFQ0MDeIv0qz",
              },
            ],
            section: { id: "releases", label: "Ver todas las producciones" },
          },
        },
      },
      {
        id: "cimarrones",
        label: "CIMARRONES",
        hint: "Ver producción",
        visual: { kind: "poster", image: "/releases/porfiao-cover2.jpeg" },
        action: {
          type: "card",
          card: {
            kicker: "Producción · Cimarrones",
            title: "Porfiao",
            image: "/releases/porfiao-cover2.jpeg",
            body: ["Desarrollo audiovisual y musical completo del proyecto."],
            links: [
              {
                label: "Spotify",
                href: "https://open.spotify.com/intl-es/album/07t08qgwKvLTwTl9TKgAuF?si=5ORcxOB9S3G3ylk5IZMl1A",
              },
              {
                label: "Visualizers",
                href: "https://youtube.com/playlist?list=PLirZ0CJi5fSXAogL1Q8AH9QW8_lXZ8C5d&si=YL4qa9d8Q7wKTKVQ",
              },
            ],
            section: { id: "releases", label: "Ver todas las producciones" },
          },
        },
      },
      {
        id: "living",
        label: "LIVING SESSIONS",
        hint: "Ver formato",
        visual: { kind: "poster", image: "/thumbnails/living.png", w: 3, h: 1.7 },
        action: {
          type: "card",
          card: {
            kicker: "Formatos visuales · 01",
            title: "Living Sessions",
            image: "/thumbnails/living.png",
            links: [
              {
                label: "Ver en YouTube",
                href: "https://youtube.com/playlist?list=PLKYACo2D96OLjeM5eS2j981odUL3hZpZ5&si=DxIZDk50foa63hU6",
              },
            ],
            section: { id: "production", label: "Ver formatos visuales" },
          },
        },
      },
      {
        id: "isla",
        label: "LA ISLA SESSIONS",
        hint: "Ver formato",
        visual: { kind: "poster", image: "/thumbnails/isla.png", w: 3, h: 1.7 },
        action: {
          type: "card",
          card: {
            kicker: "Formatos visuales · 03",
            title: "La Isla Sessions",
            image: "/thumbnails/isla.png",
            links: [
              {
                label: "Ver en YouTube",
                href: "https://youtube.com/playlist?list=PLKYACo2D96OKVr4-x-E5oBngll0YJxtpu&si=Oc-KVIUsELmZxwlh",
              },
            ],
            section: { id: "production", label: "Ver formatos visuales" },
          },
        },
      },
      {
        id: "visualizers",
        label: "VISUALIZERS",
        hint: "Ver",
        visual: { kind: "poster", image: "/releases/visualizer-1.jpeg", w: 3, h: 1.7 },
        action: { type: "section", section: "releases" },
      },
      {
        id: "intervencion",
        label: "INTERVENCIÓN MERCEDES",
        hint: "Ver",
        visual: {
          kind: "sign",
          kicker: "Formatos visuales · 02",
          title: "Intervención Mercedes",
          body: "Próximamente.",
        },
        action: { type: "section", section: "production" },
      },
      {
        id: "evidencia",
        label: "FORMATOS VISUALES",
        hint: "Ver",
        visual: {
          kind: "sign",
          kicker: "Living Sessions / CGI / Visualizers",
          title: "El contenido no fue el objetivo. Fue la evidencia.",
        },
        action: { type: "section", section: "production" },
      },
    ]
  );

  const semana = corridor(
    {
      id: "semana",
      kicker: "Zona 05",
      title: "Tu semana como artista",
      description: "Siete bloques, siete días. Recorrelos de a uno.",
    },
    [
      {
        id: "semana-intro",
        label: "TU SEMANA COMO ARTISTA",
        hint: "Leer",
        visual: {
          kind: "sign",
          kicker: "Para los que comentaron",
          title: "Tu semana como artista",
          body: "Siete días, tres cosas por día. Arrancan el día que abrís el archivo.",
        },
        action: { type: "card", card: SEMANA_CTA() },
      },
      ...SEMANA_BLOCKS.map<Item>(([title, text], i) => {
        const number = String(i + 1).padStart(2, "0");
        return {
          id: `bloque-${number}`,
          label: title.toUpperCase(),
          hint: `Bloque ${number}`,
          visual: { kind: "pillar", number },
          action: {
            type: "card",
            card: {
              kicker: `Bloque ${number} de 07`,
              title,
              body: [text],
              links: [{ label: "Quiero el archivo", href: "/tu-semana-como-artista#precio" }],
            },
          },
        };
      }),
      {
        id: "semana-cta",
        label: "QUIERO EL ARCHIVO",
        hint: "Conseguir el archivo",
        visual: {
          kind: "sign",
          kicker: "Día 7",
          title: "Quiero el archivo",
          body: "Al día 7 sabés exactamente en qué estás parado.",
        },
        action: { type: "card", card: SEMANA_CTA() },
      },
    ]
  );

  return { lobby: lobby(), artistas, musica, underfest, producciones, semana };
}

export const zones = buildZones();

export const ZONE_ORDER: ZoneId[] = ["lobby", "artistas", "musica", "underfest", "producciones", "semana"];

export function isZoneId(value: unknown): value is ZoneId {
  return typeof value === "string" && value in zones;
}

export function findStation(zone: ZoneId, id: string) {
  return zones[zone].stations.find((station) => station.id === id) ?? null;
}

/* Al volver al lobby, aparecer frente al portal de la zona de donde venís */
export function spawnPoint(zone: ZoneId, from: ZoneId | null): [number, number] {
  if (zone === "lobby" && from && from !== "lobby") {
    const portal = findStation("lobby", `portal-${from}`);
    if (portal) {
      const [x, z] = stationSpot(portal);
      return [x * 0.82, z * 0.82];
    }
  }
  return zones[zone].spawn;
}
