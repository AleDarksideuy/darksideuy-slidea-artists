import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { PRODUCT_LAUNCHED } from "../(site)/data/proximamente";
import { SITE } from "../(site)/data/site";

const TITLE = "Expediente del Artista — Darkside UY";
const DESCRIPTION =
  "Nivel 1. El sistema que pone por escrito todo lo que tu proyecto ya tiene: lo cruza, te muestra lo que no estabas viendo y arma con tus datos los mensajes, el media kit y las postulaciones.";

export const metadata: Metadata = {
  /* Esta página tiene su propio layout raíz: sin esto, la imagen al
     compartir (opengraph-image.tsx) saldría con una URL relativa */
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/expediente-del-artista" },
  /* Antes del lanzamiento: accesible solo por link, fuera de los buscadores */
  ...(PRODUCT_LAUNCHED ? {} : { robots: { index: false, follow: false } }),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/expediente-del-artista",
    siteName: "Darkside UY",
    locale: "es_UY",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/* Barra del navegador en negro (Chrome Android, navegador de Instagram) */
export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

/* Base de html/body. Va acá y no en el CSS module porque webpack no
   acepta selectores globales sueltos dentro de un module.
   overflowX en <html>: ningún adorno puede generar scroll de costado,
   ni siquiera en navegadores viejos (iOS < 16) que no entienden "clip". */
const HTML_BASE = { margin: 0, padding: 0, background: "#0a0a0b", overflowX: "hidden" as const, scrollBehavior: "smooth" as const };
const BODY_BASE = { margin: 0, padding: 0, background: "#0a0a0b" };

export default function ExpedienteDelArtistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" style={HTML_BASE}>
      <body style={BODY_BASE}>
        {children}
        {/* Contador de visitas (Vercel Web Analytics): cuánta gente entra
            por el link directo y de dónde viene (referrer / ?utm_source=) */}
        <Analytics />
      </body>
    </html>
  );
}
