import Hero from "./home/Hero";
import Cartelera from "./home/Cartelera";
import Lineup from "./home/Lineup";
import Musica from "./home/Musica";
import Llamado from "./home/Llamado";
import Underfest from "./home/Underfest";
import Producciones from "./home/Producciones";
import JuanMaidana from "./home/JuanMaidana";
import LigaSkaters from "./home/LigaSkaters";
import TuSemana from "./home/TuSemana";
import Productora from "./home/Productora";
import Contacto from "./home/Contacto";
import { PowerProvider, PoweredSections } from "./home/power";
import { SiteJsonLd } from "./components/JsonLd";

/* El recorrido de la home, pensado para quien llega desde Instagram:
   portada (tocar la D prende la página) → cartelera (las fechas del mes) → Juan Maidana → artistas → Skaters del Interior (la liga) →
   música → sumarse → eventos → trabajos → infoproducto → la productora → contacto. */
export default function Home() {
  return (
    <main>
      <SiteJsonLd />
      <PowerProvider>
        <Hero />
        {/* Se muestran al tocar la D (o al bajar, usar el menú o entrar por un link) */}
        <PoweredSections>
          <Cartelera />
          <JuanMaidana />
          <Lineup />
          <LigaSkaters />
          <Musica />
          <Llamado />
          <Underfest />
          <Producciones />
          <TuSemana />
          <Productora />
          <Contacto />
        </PoweredSections>
      </PowerProvider>
    </main>
  );
}
