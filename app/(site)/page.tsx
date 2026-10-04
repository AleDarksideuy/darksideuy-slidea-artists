import WelcomeModal from "./components/WelcomeModal";
import Hero from "./home/Hero";
import Lineup from "./home/Lineup";
import Musica from "./home/Musica";
import Llamado from "./home/Llamado";
import Underfest from "./home/Underfest";
import Producciones from "./home/Producciones";
import TuSemana from "./home/TuSemana";
import Productora from "./home/Productora";
import Contacto from "./home/Contacto";
import { PowerProvider, PoweredSections } from "./home/power";

/* El recorrido de la home, pensado para quien llega desde Instagram:
   portada (tocar la D prende la página) → artistas → música → sumarse → eventos → trabajos →
   infoproducto → la productora → contacto. */
export default function Home() {
  return (
    <main>
      <WelcomeModal />
      <PowerProvider>
        <Hero />
        {/* Se muestran al tocar la D (o al bajar, usar el menú o entrar por un link) */}
        <PoweredSections>
          <Lineup />
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
