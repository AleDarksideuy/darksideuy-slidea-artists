import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu semana como artista — Darkside UY",
  description:
    "El archivo que usamos internamente con un artista nuevo en su primera semana, adaptado para que lo uses solo. Siete bloques, siete días.",
};

export default function TuSemanaComoArtistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
