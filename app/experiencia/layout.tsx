import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../(site)/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Experiencia — Darkside UY",
  description:
    "Recorré el universo Darkside: artistas, música y más, en una experiencia interactiva.",
};

export default function ExperienciaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
