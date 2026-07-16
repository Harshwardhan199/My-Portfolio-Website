import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { CursorProvider } from "./cursor/CursorContext";
import CustomCursor from "./cursor/CustomCursor";
import AnimatedBackground from "./background/AnimatedBackground";

function App() {
  return (
    <CursorProvider>
      {/* Custom cursor overlay (desktop only, pointer:fine) */}
      <CustomCursor />

      <div className="text-text-secondary min-h-screen font-sans antialiased selection:bg-brand-red selection:text-white transition-colors duration-300 relative z-10">
        {/* Global animated background — fixed, spans entire app */}
        <AnimatedBackground />

        {/* Navigation Header */}
        <Navbar />

        {/* Main Single Page Sections */}
        <main className="w-full flex flex-col items-center relative z-20">
          {/* Landing Hero */}
          <Hero />

          {/* Biography Highlights */}
          <About />

          {/* Professional Experience */}
          <Experience />

          {/* Categorized Skills */}
          <Skills />

          {/* Dynamic Projects Grid */}
          <Projects />

          {/* Contact Form Card */}
          <Contact />
        </main>
      </div>
    </CursorProvider>
  );
}

export default App;
