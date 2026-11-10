import type { Metadata, Viewport } from "next";

import { SITE } from "../(site)/data/site";

const TITLE = "Tu semana como artista — Darkside UY";
const DESCRIPTION =
  "El archivo que usamos internamente con un artista nuevo en su primera semana, adaptado para que lo uses solo. Siete bloques, siete días.";

export const metadata: Metadata = {
  /* Esta página tiene su propio layout raíz: sin esto, la imagen al
     compartir (opengraph-image.tsx) saldría con una URL relativa */
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tu-semana-como-artista" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tu-semana-como-artista",
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

export default function TuSemanaComoArtistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" style={HTML_BASE}>
      <body style={BODY_BASE}>{children}</body>
    </html>
  );
}
