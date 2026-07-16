import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark"; // Default to dark theme
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Determine hamburger icon color based on the current active theme
  const hamburgerColor = theme === "dark" ? "FFFFFF" : "000000";

  return (
    <nav className="sticky top-0 w-full h-[10vh] flex justify-between items-center bg-navbar-bg border-b border-navbar-border px-4 min-[400px]:px-[30px] z-[1000] font-sans backdrop-blur-md transition-colors duration-300">
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
        <ul className="hidden md:flex items-center gap-6 list-none">
          <li>
            <a
              href="#about"
              className="font-montserrat text-text-primary text-xl transition-colors duration-300 hover:text-brand-red font-medium"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#experience"
              className="font-montserrat text-text-primary text-xl transition-colors duration-300 hover:text-brand-red font-medium"
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className="font-montserrat text-text-primary text-xl transition-colors duration-300 hover:text-brand-red font-medium"
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className="font-montserrat text-text-primary text-xl transition-colors duration-300 hover:text-brand-red font-medium"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="font-montserrat text-text-primary text-xl transition-colors duration-300 hover:text-brand-red font-medium"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="text-text-primary hover:text-brand-red transition-colors duration-300 cursor-pointer focus:outline-none flex items-center justify-center p-1.5"
          aria-label="Toggle Theme"
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
              className="w-6 h-6 transition-transform duration-200 hover:rotate-25"
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
              className="w-6 h-6 transition-transform duration-130 hover:-rotate-25"
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

      {/* Mobile Menu Overlay */}
      <div
        onClick={closeMenu}
        className={`fixed top-[10vh] left-0 w-screen h-[90vh] bg-black/40 z-[998] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed w-[180px] h-[90vh] top-[10vh] p-2.5 rounded-l-lg bg-card-dark border-l border-navbar-border shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-[999] transition-[right] duration-300 ease-in-out ${
          isOpen ? "right-0" : "right-[-180px]"
        }`}
      >
        <ul className="flex flex-col w-full list-none gap-2">
          <li>
            <a
              href="#about"
              onClick={closeMenu}
              className="font-montserrat text-text-primary text-2xl transition-colors duration-300 hover:text-brand-red block py-2"
            >
              About
            </a>
          </li>
          <li>
            <div className="w-full h-[1px] bg-navbar-border" />
          </li>
          <li>
            <a
              href="#experience"
              onClick={closeMenu}
              className="font-montserrat text-text-primary text-2xl transition-colors duration-300 hover:text-brand-red block py-2"
            >
              Experience
            </a>
          </li>
          <li>
            <div className="w-full h-[1px] bg-navbar-border" />
          </li>
          <li>
            <a
              href="#skills"
              onClick={closeMenu}
              className="font-montserrat text-text-primary text-2xl transition-colors duration-300 hover:text-brand-red block py-2"
            >
              Skills
            </a>
          </li>
          <li>
            <div className="w-full h-[1px] bg-navbar-border" />
          </li>
          <li>
            <a
              href="#projects"
              onClick={closeMenu}
              className="font-montserrat text-text-primary text-2xl transition-colors duration-300 hover:text-brand-red block py-2"
            >
              Projects
            </a>
          </li>
          <li>
            <div className="w-full h-[1px] bg-navbar-border" />
          </li>
          <li>
            <a
              href="#contact"
              onClick={closeMenu}
              className="font-montserrat text-text-primary text-2xl transition-colors duration-300 hover:text-brand-red block py-2"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
