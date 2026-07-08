import Hero from "./sections/Hero";
import About from "./sections/About";
import CallToArtists from "./sections/CallToArtists";
import FIC from "./sections/FIC";
import Partners from "./sections/Partners";
import Events from "./sections/Events";
import Underfest from "./sections/Underfest";
import Magazine from "./sections/Magazine";
import Production from "./sections/Production";
import NextTerritory from "./sections/NextTerritory";
import Releases from "./sections/Releases";
import Contact from "./sections/Contact";
import Artists from "./sections/Artists";
export default function Home() {
  return (
    <main >
      
      <Hero />
      <About/>
      <Artists/>
      <CallToArtists/>
      <FIC/>
      <Partners/>
      
      <Underfest/>
      <Magazine/>
      <Production/>
      <Releases/>
      <NextTerritory/>
      <Contact/>
    </main>
  );
}