import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { logout } from "../../../firebase/firebase";
import { publishAll } from "../../services/publishService";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useIconLibrary } from "../../hooks/useIconLibrary";

export default function TopBar({ onToggleSidebar, onSelectSection }) {
  const { user } = useAuth();
  const [showPublishAllConfirm, setShowPublishAllConfirm] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  // Theme State Sync
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Global search queries
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch items for global search
  const { data: projects } = useFirestoreCollection("draft_projects");
  const { data: skills } = useFirestoreCollection("draft_skills");
  const { data: experience } = useFirestoreCollection("draft_experience");
  const { data: education } = useFirestoreCollection("draft_education");
  const { data: certifications } = useFirestoreCollection("draft_certifications");
  const { data: achievements } = useFirestoreCollection("draft_achievements");
  const { icons } = useIconLibrary();

  const handlePublishAll = async () => {
    try {
      setIsPublishingAll(true);
      await publishAll(user);
      setShowPublishAllConfirm(false);
    } catch (err) {
      console.error("Error during Publish All:", err);
    } finally {
      setIsPublishingAll(false);
    }
  };

  // Build global search results
  const q = searchQuery.toLowerCase().trim();
  const searchResults = [];

  if (q) {
    projects.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      .forEach(p => searchResults.push({ id: p.id, title: p.title, type: "Project", section: "projects", icon: "🚀" }));

    skills.forEach(cat => {
      cat.items?.filter(s => s.name?.toLowerCase().includes(q))
        .forEach(s => searchResults.push({ id: s.id, title: `${s.name} (${cat.category})`, type: "Skill", section: "skills", icon: "🛠️" }));
    });

    experience.filter(e => e.role?.toLowerCase().includes(q) || e.company?.toLowerCase().includes(q))
      .forEach(e => searchResults.push({ id: e.id, title: `${e.role} @ ${e.company}`, type: "Experience", section: "experience", icon: "💼" }));

    education.filter(e => e.degree?.toLowerCase().includes(q) || e.institution?.toLowerCase().includes(q))
      .forEach(e => searchResults.push({ id: e.id, title: e.degree, type: "Education", section: "education", icon: "🎓" }));

    certifications.filter(c => c.name?.toLowerCase().includes(q))
      .forEach(c => searchResults.push({ id: c.id, title: c.name, type: "Certification", section: "certifications", icon: "📜" }));

    achievements.filter(a => a.title?.toLowerCase().includes(q))
      .forEach(a => searchResults.push({ id: a.id, title: a.title, type: "Achievement", section: "achievements", icon: "🏆" }));

    icons.filter(i => i.name?.toLowerCase().includes(q) || i.keywords?.toLowerCase().includes(q))
      .forEach(i => searchResults.push({ id: i.id, title: i.name, type: "Icon", section: "icons", icon: "🎨" }));
  }

  return (
    <>
      <header className="min-h-[64px] py-2 border-b border-border-theme bg-card-dark/80 backdrop-blur-md sticky top-0 z-30 flex flex-wrap items-center justify-between px-2.5 sm:px-4 lg:px-8 gap-2">
        <div className="flex items-center gap-2 min-[360px]:gap-4 flex-1 min-w-[180px] max-w-xl">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 min-[360px]:p-2 rounded-xl bg-input-bg border border-border-theme text-text-primary shrink-0"
            aria-label="Toggle menu"
          >
            <svg className="w-4 h-4 min-[360px]:w-5 min-[360px]:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Global Search Input */}
          <div className="relative w-full">
            <div className="relative flex items-center">
              <svg className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 absolute left-3 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search CMS..."
                className="w-full pl-8 min-[360px]:pl-10 pr-3 py-1.5 min-[360px]:py-2 bg-input-bg border border-border-theme focus:border-brand-red/60 rounded-xl text-xs text-text-primary outline-none transition"
              />
            </div>

            {/* Global Search Results Dropdown */}
            {isSearchOpen && q && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-card-dark border border-border-theme rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto w-[260px] min-[360px]:w-full max-w-[85vw]">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-xs text-text-secondary text-center">No matching entities found</div>
                ) : (
                  searchResults.slice(0, 10).map((res, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onSelectSection(res.section);
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-input-bg flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm shrink-0">{res.icon}</span>
                        <span className="text-xs font-medium text-text-primary truncate">{res.title}</span>
                      </div>
                      <span className="text-[9px] min-[360px]:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5 dark:bg-black/40 border border-border-theme text-text-secondary font-medium shrink-0 ml-1">
                        {res.type}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Links & User Info */}
        <div className="flex items-center gap-2 min-[360px]:gap-3 shrink-0">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 min-[360px]:p-2 rounded-xl bg-input-bg border border-border-theme text-text-primary hover:border-brand-red/50 transition-colors duration-300 cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Toggle Dark / Light Theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 transition-transform duration-500 hover:rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg className="w-4 h-4 transition-transform duration-500 hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-[480px]:flex items-center gap-1.5 px-3 py-1.5 bg-input-bg border border-border-theme hover:border-brand-red/50 text-text-primary text-xs font-medium rounded-xl transition"
          >
            Live Site
          </a>

          <a
            href="/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-[480px]:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 text-xs font-semibold rounded-xl transition"
          >
            Preview
          </a>

          <button
            onClick={() => setShowPublishAllConfirm(true)}
            className="flex items-center gap-1.5 px-3 min-[360px]:px-4 py-1.5 min-[360px]:py-2 bg-brand-red text-white text-[10px] min-[360px]:text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer shadow-md shadow-brand-red/20 shrink-0"
          >
            Publish All
          </button>

          <button
            onClick={() => logout()}
            className="text-[10px] min-[360px]:text-xs text-text-secondary hover:text-brand-red font-medium transition cursor-pointer shrink-0 ml-1"
            title={user?.email}
          >
            Logout
          </button>
        </div>
      </header>

      <ConfirmDialog
        isOpen={showPublishAllConfirm}
        title="Publish All Sections?"
        message="This will atomically copy all current draft data across your portfolio into the live published collections, making all changes live immediately."
        confirmText="Publish All Live"
        isLoading={isPublishingAll}
        onConfirm={handlePublishAll}
        onCancel={() => setShowPublishAllConfirm(false)}
      />
    </>
  );
}
