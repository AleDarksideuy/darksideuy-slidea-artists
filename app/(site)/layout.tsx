import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Navigation from "./components/Navigation";
import { SITE } from "./data/site";
import { CtaVisibilityProvider } from "./context/CtaVisibilityContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-black overflow-x-hidden font-sans">

        {/* ================= BACKGROUND LAYERS ================= */}
        <div className="fixed inset-0 z-0 overflow-hidden">

          {/* IMAGE LAYER (con zoom + parallax suave) */}
          <div className="absolute inset-0 scale-110 animate-slow-zoom motion-reduce:animate-none">
            <Image
              src="/background-image.webp"
              alt="Background"
              fill
              priority
              className="object-cover opacity-30"
            />
          </div>

          {/* GRADIENT DEPTH LAYER */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85" />

          {/* NOISE / GRAIN LAYER (da textura cinematográfica) */}
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay noise-texture" />

        </div>
        <CtaVisibilityProvider>
          {/* ================= NAVEGACIÓN ================= */}
          <Navigation />

          {/* CONTENIDO (en celular deja lugar a la barra inferior) */}
          <div className="relative z-10 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
            {children}
          </div>
        </CtaVisibilityProvider>

      </body>
    </html>
  );
}