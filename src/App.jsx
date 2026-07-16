import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="bg-bg-dark text-text-secondary min-h-screen font-sans antialiased overflow-x-hidden selection:bg-brand-red selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Single Page Sections */}
      <main className="w-full flex flex-col items-center">
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
  );
}

export default App;
