import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import { CursorProvider } from "../../cursor/CursorContext";
import CustomCursor from "../../cursor/CustomCursor";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { logout } from "../../firebase/firebase";

export default function Portfolio({ isPreview = false }) {
  const navigate = useNavigate();
  const { loading: authLoading, isAuthenticated, isAuthorized } = useAdminAuth();
  const data = usePortfolioData(isPreview);

  // Enforce admin protection on /preview route
  useEffect(() => {
    if (isPreview && !authLoading && (!isAuthenticated || !isAuthorized)) {
      const handleUnauthorizedPreview = async () => {
        await logout();
        navigate("/", {
          state: { authError: "Access denied. Preview mode requires admin authorization." },
          replace: true,
        });
      };
      handleUnauthorizedPreview();
    }
  }, [isPreview, authLoading, isAuthenticated, isAuthorized, navigate]);

  // Loading state for preview authorization check
  if (isPreview && (authLoading || (!isAuthenticated || !isAuthorized))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark text-text-primary">
        <div className="flex items-center gap-3 text-lg font-medium animate-pulse">
          <svg className="w-5 h-5 animate-spin text-brand-red" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying Preview Authorization...
        </div>
      </div>
    );
  }

  return (
    <CursorProvider>
      {/* Custom cursor overlay (portfolio view only) */}
      <CustomCursor />

      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="bg-amber-500 text-black px-4 py-2 text-center text-xs font-bold uppercase tracking-wider sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
          <span>⚠️ You are viewing DRAFT PREVIEW mode. Live site visitors see published content.</span>
          <a href="/admin" className="underline font-black hover:text-white ml-2">
            Back to CMS
          </a>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar />

      {/* Main Single Page Sections */}
      <main className="w-full flex flex-col items-center relative z-20">
        {/* Landing Hero */}
        <Hero data={data.hero} />

        {/* Biography Highlights */}
        <About data={data.about} />

        {/* Professional Experience */}
        <Experience data={data.experience} />

        {/* Categorized Skills */}
        <Skills data={data.skills} icons={data.icons} />

        {/* Dynamic Projects Grid */}
        <Projects data={data.projects} icons={data.icons} />

        {/* Contact Form Card */}
        <Contact data={data.contact} socials={data.socials} />
      </main>
    </CursorProvider>
  );
}
