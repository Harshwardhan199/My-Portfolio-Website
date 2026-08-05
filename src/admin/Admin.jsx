import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { loginWithGoogle, logout, isAdmin } from "../firebase/firebase";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardHome from "./pages/DashboardHome";
import HeroEditor from "./pages/HeroEditor";
import AboutEditor from "./pages/AboutEditor";
import ExperienceEditor from "./pages/ExperienceEditor";
import SkillsEditor from "./pages/SkillsEditor";
import ProjectsEditor from "./pages/ProjectsEditor";
import EducationEditor from "./pages/EducationEditor";
import CertificationsEditor from "./pages/CertificationsEditor";
import AchievementsEditor from "./pages/AchievementsEditor";
import ContactEditor from "./pages/ContactEditor";
import SocialsEditor from "./pages/SocialsEditor";
import SeoEditor from "./pages/SeoEditor";
import IconLibrary from "./pages/IconLibrary";

export default function Admin() {
  const { user, loading, isAuthenticated, isAuthorized } = useAdminAuth();
  const [authError, setAuthError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  // Automatically sign out and redirect non-admin authenticated users attempting to load /admin
  useEffect(() => {
    if (!loading && isAuthenticated && !isAuthorized) {
      const handleUnauthorized = async () => {
        await logout();
        navigate("/", {
          state: { authError: "This account is not authorized to access the admin panel." },
          replace: true,
        });
      };
      handleUnauthorized();
    }
  }, [loading, isAuthenticated, isAuthorized, navigate]);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      setIsLoggingIn(true);
      const loggedInUser = await loginWithGoogle();

      if (!loggedInUser) return;

      if (!isAdmin(loggedInUser)) {
        await logout();
        navigate("/", {
          state: { authError: "This account is not authorized to access the admin panel." },
          replace: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // State 1: Loading state or redirecting state (prevents UI flicker)
  if (loading || (isAuthenticated && !isAuthorized)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark text-text-primary">
        <div className="flex items-center gap-3 text-lg font-medium animate-pulse">
          <svg className="w-5 h-5 animate-spin text-brand-red" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Admin Panel...
        </div>
      </div>
    );
  }

  // State 2: Not authenticated state -> Render Admin Login Card
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark text-text-primary p-4 relative z-20">
        <div className="bg-card-dark border border-border-theme p-8 rounded-2xl shadow-card-custom max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
          <p className="text-sm text-text-secondary">
            Sign in with your Google account to access the administrative dashboard.
          </p>

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">
              {authError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-brand-red text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 16.143 15.645 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.455 0 2.783.525 3.81 1.395l2.445-2.445C16.995 3.48 14.775 2.7 12.24 2.7c-5.13 0-9.3 4.17-9.3 9.3s4.17 9.3 9.3 9.3c5.355 0 9.075-3.765 9.075-9.18 0-.615-.06-1.08-.135-1.535H12.24z" />
            </svg>
            {isLoggingIn ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    );
  }

  // State 3: Authenticated & Authorized Admin state -> Render Admin Panel CMS Layout
  const renderSectionPage = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome onNavigate={setActiveSection} />;
      case "hero":
        return <HeroEditor />;
      case "about":
        return <AboutEditor />;
      case "experience":
        return <ExperienceEditor />;
      case "skills":
        return <SkillsEditor />;
      case "projects":
        return <ProjectsEditor />;
      case "education":
        return <EducationEditor />;
      case "certifications":
        return <CertificationsEditor />;
      case "achievements":
        return <AchievementsEditor />;
      case "contact":
        return <ContactEditor />;
      case "socials":
        return <SocialsEditor />;
      case "seo":
        return <SeoEditor />;
      case "icons":
        return <IconLibrary />;
      default:
        return <DashboardHome onNavigate={setActiveSection} />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {renderSectionPage()}
    </AdminLayout>
  );
}
