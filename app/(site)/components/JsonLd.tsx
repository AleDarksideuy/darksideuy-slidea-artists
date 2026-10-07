import { CONTACT } from "../data/home";
import type { Artist } from "../data/artists";
import { SITE } from "../data/site";

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

/* Home: la productora y el sitio */
export function SiteJsonLd() {
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
