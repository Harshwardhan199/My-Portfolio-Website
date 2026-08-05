import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import AnimatedBackground from "../background/AnimatedBackground";
import Toast from "../home/components/Toast";
import Portfolio from "../home/pages/Portfolio";
import Admin from "../admin/Admin";

function MainContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Sync initial theme class on document element from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="text-text-secondary min-h-screen font-sans antialiased selection:bg-brand-red selection:text-white transition-colors duration-300 relative z-10">
      {/* Render animated grid background only on public portfolio & preview pages */}
      {!isAdmin && <AnimatedBackground />}

      <Routes>
        <Route path="/" element={<Portfolio isPreview={false} />} />
        <Route path="/preview" element={<Portfolio isPreview={true} />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <MainContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
