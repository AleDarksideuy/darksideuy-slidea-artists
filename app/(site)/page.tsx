import WelcomeModal from "./components/WelcomeModal";
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
import Discover from "./sections/Discover";
export default function Home() {
  return (
    <main >
      <WelcomeModal />

      <Hero />
      
      <Underfest/>
      <Artists/>
      <Discover />
      <CallToArtists/>
      
      <FIC/>
      <Partners/>
      
      
      <Magazine/>
      <Production/>
      <Releases/>
      <NextTerritory/>
      <Contact/>
    </main>
  );
}