import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import SiteBackground from "./components/SiteBackground";
import { MusicProvider } from "./music/MusicProvider";
import MiniPlayer from "./music/MiniPlayer";
import { SITE } from "./data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Títulos y etiquetas: una sola carga para todo el sitio */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* La imagen para compartir la genera opengraph-image.tsx (y una por
   artista en artists/[slug]); acá van títulos y descripciones. */
export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-black text-white overflow-x-hidden font-sans">
        {/* La foto de público de fondo (la de la página original) */}
        <SiteBackground />

          <MusicProvider>
            <Navigation />

            {/* En celular deja lugar a la barra inferior */}
            <div className="relative z-10 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
              {children}
            </div>

            <MiniPlayer />
          </MusicProvider>

        {/* Grano de película sobre todo (fotos incluidas): textura pareja.
            CSS en línea, sin imágenes externas */}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-30" />

      </body>
    </html>
  );
}
