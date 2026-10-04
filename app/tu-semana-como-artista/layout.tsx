import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu semana como artista — Darkside UY",
  description:
    "El archivo que usamos internamente con un artista nuevo en su primera semana, adaptado para que lo uses solo. Siete bloques, siete días.",
};

/* Base de html/body. Va acá y no en el CSS module porque webpack no
   acepta selectores globales sueltos dentro de un module. */
const PAGE_BASE = { margin: 0, padding: 0, background: "#0a0a0b" };

export default function TuSemanaComoArtistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" style={PAGE_BASE}>
      <body style={PAGE_BASE}>{children}</body>
    </html>
  );
}
