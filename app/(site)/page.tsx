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

/* El recorrido de la home, pensado para quien llega desde Instagram:
   quiénes somos → artistas → música → sumarse → eventos → trabajos →
   infoproducto → la productora → contacto. */
export default function Home() {
  return (
    <main>
      <WelcomeModal />
      <Hero />
      <Lineup />
      <Musica />
      <Llamado />
      <Underfest />
      <Producciones />
      <TuSemana />
      <Productora />
      <Contacto />
    </main>
  );
}
