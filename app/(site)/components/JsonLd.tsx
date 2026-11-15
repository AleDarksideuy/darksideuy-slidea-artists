import { CONTACT } from "../data/home";
import { artists, type Artist } from "../data/artists";
import { EVENTS, type CarteleraEvent } from "../data/cartelera";
import { SITE } from "../data/site";
import { todayInUruguay } from "../lib/cartelera";

/* ═══════════════════════════════════════════════════════════════
   DATOS ESTRUCTURADOS (schema.org)
   Le cuentan a Google, en su idioma, quién es Darkside UY y quién es
   cada artista: nombre, lugar, género, redes y lanzamientos. Ayudan a
   mostrar mejores resultados (logo, redes, panel de la organización).
   ═══════════════════════════════════════════════════════════════ */

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE.url}${encodeURI(path)}`);

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      /* "<" escapado para que el JSON no pueda cerrar la etiqueta */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: abs(SITE.logo),
  description: SITE.description,
  email: CONTACT.email,
  address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: SITE.country },
  sameAs: [CONTACT.instagram],
};

const EVENT_STATUS = {
  cancelado: "https://schema.org/EventCancelled",
  postergado: "https://schema.org/EventPostponed",
  agotado: "https://schema.org/EventScheduled",
};

/* Una fecha de la cartelera, como evento de Google (solo las que ya
   tienen día: sin día no hay evento para Google) */
function eventData(event: CarteleraEvent & { date: string }) {
  const url = `${SITE.url}/#evento-${event.id}`;
  const [locality, region] = event.city.split(",").map((s) => s.trim());
  const entry = event.entry;
  const offer =
    entry &&
    (entry.kind === "libre" || entry.price !== undefined) && {
      "@type": "Offer",
      price: entry.kind === "libre" ? 0 : entry.price,
      priceCurrency: "UYU",
      url: (entry.kind === "paga" && entry.link) || url,
      availability: event.status === "agotado" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    };
  const performers = (event.artists ?? []).map((name) => {
    const artist = artists.find((a) => a.slug === name);
    return artist
      ? { "@type": "MusicGroup", name: artist.name, url: `${SITE.url}/artists/${artist.slug}` }
      : { "@type": "PerformingGroup", name };
  });

  return {
    "@type": "Event",
    "@id": `${url}#event`,
    name: event.title,
    url,
    startDate: event.time ? `${event.date}T${event.time}:00-03:00` : event.date,
    eventStatus: event.status ? EVENT_STATUS[event.status] : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.place ?? event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        ...(region && { addressRegion: region }),
        addressCountry: "UY",
      },
    },
    image: abs(event.poster?.src ?? SITE.logo),
    ...(event.text && { description: event.text }),
    organizer: { "@id": `${SITE.url}/#organization` },
    ...(performers.length && { performer: performers }),
    ...(offer && { offers: offer }),
  };
}

/* Home: la productora, el sitio y las fechas de la cartelera que
   todavía no pasaron (al momento de publicar) */
export function SiteJsonLd() {
  const today = todayInUruguay();
  const events = EVENTS.filter((e): e is CarteleraEvent & { date: string } => !!e.date && e.date >= today).map(eventData);
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          ORGANIZATION,
          {
            "@type": "WebSite",
            "@id": `${SITE.url}/#website`,
            name: SITE.name,
            url: SITE.url,
            inLanguage: "es",
            publisher: { "@id": `${SITE.url}/#organization` },
          },
          ...events,
        ],
      }}
    />
  );
}

/* Ficha de artista: el artista, sus redes y sus lanzamientos */
export function ArtistJsonLd({ artist }: { artist: Artist }) {
  const url = `${SITE.url}/artists/${artist.slug}`;
  const sameAs = [artist.instagram, artist.spotify, artist.youtube, artist.facebook].filter((v): v is string => !!v);
  const albums = (artist.releases ?? [])
    .filter((r) => r.status === "Lanzado")
    .map((r) => ({
      "@type": "MusicAlbum",
      name: r.title,
      ...(r.cover && { image: abs(r.cover) }),
      ...((r.spotify || r.youtube) && { url: r.spotify || r.youtube }),
    }));

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "@id": `${url}#artist`,
        name: artist.name,
        url,
        image: abs(artist.image),
        description: artist.description || `${artist.category} · ${artist.city}, ${artist.country}.`,
        genre: artist.category,
        foundingLocation: { "@type": "Place", name: `${artist.city}, ${artist.country}` },
        ...(sameAs.length && { sameAs }),
        ...(albums.length && { album: albums }),
        recordLabel: { "@id": `${SITE.url}/#organization`, "@type": "Organization", name: SITE.name, url: SITE.url },
      }}
    />
  );
}
