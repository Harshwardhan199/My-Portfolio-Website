import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useCursor } from "../cursor/useCursor";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark"; // Default to dark theme
    }
    return "dark";
  });

  // Scroll Progress Tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Dark/Light Theme Handler
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll Section Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when section hits the center of the viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const hamburgerColor = theme === "dark" ? "FFFFFF" : "000000";
  const linkCursor = useCursor("link");
  const btnCursor = useCursor("button");

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[10vh] flex justify-between items-center bg-navbar-bg border-navbar-border px-4 min-[400px]:px-[30px] z-[1000] font-sans backdrop-blur-md transition-colors duration-300">
        {/* Brand Name */}
        <div className="flex-1">
          <a
            href="#"
            className="text-brand-red text-[clamp(22px,3.5vw,30px)] font-bold tracking-wide drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)] hover:text-red-500 transition-colors"
          >
            HARSHWARDHAN SAINI
          </a>
        </div>

        {/* Navigation Links and Theme Switcher */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 list-none relative">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="relative py-1">
                  <a
                    href={`#${item.id}`}
                    className={`font-montserrat text-lg transition-colors duration-300 font-medium ${
                      isActive
                        ? "text-brand-red"
                        : "text-text-primary hover:text-brand-red"
                    }`}
                    {...linkCursor}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop/Tablet Vertical Divider */}
          <div className="w-[1.5px] h-4 bg-neutral-300 dark:bg-neutral-700 hidden md:block mx-1" />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="text-text-primary hover:text-brand-red transition-colors duration-300 cursor-pointer focus:outline-none flex items-center justify-center p-1.5"
            aria-label="Toggle Theme"
            {...btnCursor}
          >
            {theme === "dark" ? (
              // Sun Icon (shows in Dark Mode to switch to Light)
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 transition-transform duration-500 hover:rotate-45"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              // Moon Icon (shows in Light Mode to switch to Dark)
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 transition-transform duration-500 hover:-rotate-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="block md:hidden focus:outline-none cursor-pointer z-[1001] p-1"
            aria-label="Toggle Menu"
          >
            <img
              className="h-[30px] w-[30px] transition-all duration-300"
              src={`https://img.icons8.com/?size=100&id=36389&format=png&color=${hamburgerColor}`}
              alt="Menu icon"
            />
          </button>
        </div>

        {/* Mobile Drawer Menu (Framer Motion transitions) */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
                className="fixed top-[10vh] left-0 w-screen h-[90vh] bg-black/50 backdrop-blur-xs z-[998]"
              />

              {/* Drawer Menu */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="fixed w-[200px] h-[90vh] top-[10vh] right-0 p-5 rounded-l-xl bg-card-dark/95 border-l border-navbar-border shadow-[0_8px_30px_rgba(0,0,0,0.3)] z-[999] backdrop-blur-md"
              >
                <ul className="flex flex-col w-full list-none gap-2">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={closeMenu}
                          className={`font-montserrat text-2xl transition-colors duration-300 block py-2.5 ${
                            isActive
                              ? "text-brand-red font-bold"
                              : "text-text-primary hover:text-brand-red"
                          }`}
                        >
                          {item.label}
                        </a>
                        <div className="w-full h-[1px] bg-navbar-border/20" />
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Integrated scroll progress bar at absolute bottom edge of navbar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-red origin-left z-[1002]"
          style={{ scaleX }}
        />
      </nav>
    </>
  );
}

export default Navbar;
