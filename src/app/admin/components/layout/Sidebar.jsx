import { motion } from "framer-motion";

const SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "hero", label: "Hero", icon: "⚡" },
  { id: "about", label: "About", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "skills", label: "Skills", icon: "🛠️" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "certifications", label: "Certifications", icon: "📜" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "contact", label: "Contact", icon: "✉️" },
  { id: "socials", label: "Social Links", icon: "🌐" },
  { id: "seo", label: "SEO Metadata", icon: "🔍" },
  { id: "icons", label: "Icon Library", icon: "🎨" },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 max-w-[85vw] bg-card-dark border-r border-border-theme flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 min-[360px]:p-6 border-b border-border-theme flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-red/20 shrink-0">
              P
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-text-primary text-sm min-[360px]:text-base leading-tight truncate">
                Portfolio CMS
              </h2>
              <span className="text-[10px] min-[360px]:text-[11px] text-text-secondary block truncate">Admin Control Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto p-3 min-[360px]:p-4 space-y-1">
          {SECTIONS.map((sec) => {
            const isActive = activeTab === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveTab(sec.id);
                  setIsOpen(false);
                }}
                className={`w-full relative flex items-center gap-3 px-3 min-[360px]:px-4 py-2.5 rounded-xl font-medium text-xs min-[360px]:text-sm transition-colors duration-200 cursor-pointer ${
                  isActive ? "text-text-primary font-semibold" : "text-text-secondary hover:text-text-primary hover:bg-input-bg/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-input-bg border border-border-theme rounded-xl shadow-sm z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="text-base relative z-10 shrink-0">{sec.icon}</span>
                <span className="relative z-10 truncate">{sec.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
