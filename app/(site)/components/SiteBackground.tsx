import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   FONDO: EL PÚBLICO
   La foto de público de la página original, fija detrás de todo,
   con zoom lento y degradados para que el texto se lea.
   En la home, apagada se ve en penumbra y al tocar la D se ilumina
   ("se prenden las luces"): lo controla data-power en <html>
   (ver home/power.tsx y .site-bg en globals.css).
   ═══════════════════════════════════════════════════════════════ */

export default function SiteBackground() {
  return (
    <div aria-hidden className="site-bg pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="site-bg-photo absolute inset-0 scale-110 animate-slow-zoom motion-reduce:animate-none">
        <Image
          src="/background-image.webp"
          alt=""
          fill
          sizes="100vw"
          fetchPriority="low"
          className="object-cover"
        />
      </div>
      {/* Profundidad: oscuro arriba (menú) y abajo, el público al medio */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      {/* Viñeta para que los bordes se fundan con el negro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}
