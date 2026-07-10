import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Tracking } from "./components/Tracking";
import { Shelby } from "./components/Shelby";
import { Clips } from "./components/Clips";
import { LibraryWall } from "./components/LibraryWall";
import { Specs } from "./components/Specs";
import { BugReport } from "./components/BugReport";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { useReveal } from "./lib/useReveal";

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Tracking />
        <Shelby />
        <Clips />
        <LibraryWall />
        <Specs />
        <BugReport />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
