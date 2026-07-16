import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { CursorProvider } from "../cursor/CursorContext";
import CustomCursor from "../cursor/CustomCursor";
import AnimatedBackground from "../background/AnimatedBackground";

// Asset Imports
import profileImg from "../assets/images/Profile.png";
import resumePdf from "../assets/resume.pdf";
import gitIcon from "../assets/images/Git.png";
import phoneIcon from "../assets/images/phone.png";
import nameIcon from "../assets/images/name.png";
import emailIcon from "../assets/images/email.png";
import messageIcon from "../assets/images/message.png";

import sageAiImg from "../assets/images/SageAI.png";
import portfolioImg from "../assets/images/Portfolio-Website.png";
import brandSightImg from "../assets/images/BrandSight.png";
import foodiesImg from "../assets/images/foodies.png";
import threatVistaImg from "../assets/images/Threat-Vista.png";

// ==========================================
// DATA CONFIGURATIONS
// ==========================================

const skillsData = [
  {
    category: "Programming",
    items: [
      {
        name: "JavaScript",
        description: "Dynamic Web Scripting",
        icon: "https://img.icons8.com/?size=100&id=39854&format=png&color=ff0000",
      },
      {
        name: "Python",
        description: "Scripting & ML",
        icon: "https://img.icons8.com/?size=100&id=12592&format=png&color=ff0000",
      },
      {
        name: "TypeScript",
        description: "Typed JavaScript",
        icon: "https://img.icons8.com/?size=100&id=cHBUT9SmrD2V&format=png&color=ff0000",
      },
      {
        name: "Go",
        description: "Systems Programming",
        icon: "https://img.icons8.com/?size=100&id=66832&format=png&color=ff0000",
      },
    ],
  },
  {
    category: "Frontend",
    items: [
      {
        name: "HTML",
        description: "Web Markup",
        icon: "https://img.icons8.com/?size=100&id=23028&format=png&color=ff0000",
      },
      {
        name: "CSS",
        description: "Web Styling",
        icon: "https://img.icons8.com/?size=100&id=38272&format=png&color=ff0000",
      },
      {
        name: "React",
        description: "Component-Based UI",
        icon: "https://img.icons8.com/?size=100&id=w4RSxcrpwrzy&format=png&color=ff0000",
      },
      {
        name: "Next.js",
        description: "SSR React Framework",
        icon: "https://img.icons8.com/?size=100&id=gwR0hbBi5JeZ&format=png&color=ff0000",
      },
      {
        name: "TailwindCSS",
        description: "Utility-First Styling",
        icon: "https://img.icons8.com/?size=100&id=UpSCHTwpywad&format=png&color=ff0000",
      },
    ],
  },
  {
    category: "Backend",
    items: [
      {
        name: "Node.js",
        description: "Server Runtime",
        icon: "https://img.icons8.com/?size=100&id=t9oCxEN7McHZ&format=png&color=ff0000",
      },
      {
        name: "Express",
        description: "Micro-framework",
        icon: "https://img.icons8.com/?size=100&id=XIkDynN7Uo6f&format=png&color=ff0000",
      },
      {
        name: "Django",
        description: "Robust Python Backend",
        icon: "https://img.icons8.com/?size=100&id=37o3DqV429ra&format=png&color=ff0000",
      },
      {
        name: "Flask",
        description: "Micro Web Server",
        icon: "https://img.icons8.com/?size=100&id=AqYCfGyGXlO7&format=png&color=ff0000",
      },
      {
        name: "FastAPI",
        description: "High-Performance APIs",
        icon: "https://img.icons8.com/?size=100&id=122187&format=png&color=ff0000",
      },
    ],
  },
  {
    category: "AI & Agents",
    items: [
      {
        name: "LLM APIs",
        description: "Model Integration",
        icon: "https://img.icons8.com/?size=100&id=Q48f9JPNPu0E&format=png&color=ff0000",
      },
      {
        name: "Dialogflow CX & ADK",
        description: "Conversational Agents",
        icon: "https://img.icons8.com/?size=100&id=37628&format=png&color=ff0000",
      },
      {
        name: "MCP",
        description: "Model Context Protocol",
        icon: "https://img.icons8.com/?size=100&id=rfIn8nl8UUXz&format=png&color=ff0000",
      },
      {
        name: "Prompt Engineering",
        description: "Context Optimization",
        icon: "https://img.icons8.com/?size=100&id=8420&format=png&color=ff0000",
      },
      {
        name: "Agent Development",
        description: "Autonomous Workflows",
        icon: "https://img.icons8.com/?size=100&id=xT8d0Ap2E9Yt&format=png&color=ff0000",
      },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      {
        name: "AWS",
        description: "Cloud Hosting & Services",
        icon: "https://img.icons8.com/?size=100&id=AtEKkdldZfri&format=png&color=ff0000",
      },
      {
        name: "GCP",
        description: "Google Cloud Platform",
        icon: "https://img.icons8.com/?size=100&id=20773&format=png&color=ff0000",
      },
      {
        name: "Docker",
        description: "Containerization",
        icon: "https://img.icons8.com/?size=100&id=ckyutUQGU0PM&format=png&color=ff0000",
      },
      {
        name: "Kubernetes",
        description: "Orchestration",
        icon: "https://img.icons8.com/?size=100&id=1hFR28gNL9Hy&format=png&color=ff0000",
      },
      {
        name: "Terraform",
        description: "Infrastructure as Code",
        icon: "https://img.icons8.com/?size=100&id=F2ZeQQjwdIJp&format=png&color=ff0000",
      },
      {
        name: "Jenkins & CI/CD",
        description: "Automation Server",
        icon: "https://img.icons8.com/?size=100&id=41129&format=png&color=ff0000",
      },
    ],
  },
  {
    category: "Databases & Architecture",
    items: [
      {
        name: "MySQL",
        description: "Relational Storage",
        icon: "https://img.icons8.com/?size=100&id=39858&format=png&color=ff0000",
      },
      {
        name: "MongoDB",
        description: "Document Store",
        icon: "https://img.icons8.com/?size=100&id=Y9VdL7V5XPIc&format=png&color=ff0000",
      },
      {
        name: "Redis",
        description: "In-Memory Cache",
        icon: "https://img.icons8.com/?size=100&id=dmAy2s25QyTr&format=png&color=ff0000",
      },
      {
        name: "Kafka",
        description: "Event Streaming",
        icon: "https://img.icons8.com/?size=100&id=GcoBILXGLwFD&format=png&color=ff0000",
      },
      {
        name: "Microservices",
        description: "Distributed Systems",
        icon: "https://img.icons8.com/?size=100&id=k3W8eBXojTKY&format=png&color=ff0000",
      },
    ],
  },
];

const experienceData = [
  {
    role: "DT Intern",
    company: "GE Appliances (Haier)",
    duration: "Jan 2026 – June 2026",
    responsibilities: [
      "Built AI conversational agents using ADK and Dialogflow CX for manufacturing data.",
      "Developed backend APIs, cloud infrastructure, CI/CD pipelines and multi-agent orchestration.",
      "Worked across Angular frontend, Agent Engine, MCP, Cloud Run, AWS Lambda and Google Cloud Functions.",
      "Built reusable Angular components for internal AI agent UI.",
      "Developed MCP-based natural language interface for BigQuery.",
      "Built foundations for autonomous AI workflows including Cypress test generation.",
      "Automated deployments using Terraform, Jenkins and GitHub Actions.",
    ],
  },
];

const projectsData = [
  {
    id: 1,
    title: "National Cyber Threat Intelligence Hub",
    description:
      "A centralized platform designed to monitor, aggregate, and analyze real-time cyber threats. Features ingestion of feed intelligence, indicators of compromise (IoC) visualization, and collaborative threat response frameworks.",
    technologies: [
      "React",
      "Node.js",
      "Django",
      "Kafka",
      "Kubernetes",
      "Docker",
    ],
    github:
      "https://github.com/ktyangden/National-Cyber-Threat-Intelligence-Hub",
    demo: "",
    image: threatVistaImg,
  },
  {
    id: 2,
    title: "Sage AI",
    description:
      "This is a MERN stack chatbot platform project with some additional features like Chats history organized in folder, reusable prompts and interactive quizzes.",
    technologies: ["React", "Node.js", "FastAPI", "Redis", "MongoDB", "LLM"],
    github: "https://github.com/Harshwardhan199/SageAI",
    demo: "https://sage-ai-chatbot.vercel.app/",
    image: sageAiImg,
  },
  {
    id: 3,
    title: "BrandSight",
    description:
      "This is a team project where we built a Brand Analyzer website which takes reviews from different sources (PlayStore, Maps) and analyzes them using our NLP API and gives suggestions to improve their service.",
    technologies: ["React", "Node.js", "MongoDB", "NLP"],
    github: "https://github.com/rakshitsawarn/brandsight",
    demo: "",
    image: brandSightImg,
  },
];

// Helper to resolve technology badge icons dynamically from skillsData
const getTechIcon = (tech) => {
  const allSkills = skillsData.flatMap((cat) => cat.items);
  const matched = allSkills.find(
    (s) =>
      s.name.toLowerCase() === tech.toLowerCase() ||
      tech.toLowerCase().includes(s.name.toLowerCase())
  );

  if (matched) {
    // Convert red icon from skillsData to white to support the theme-icon-invert helper
    return matched.icon.replace("color=ff0000", "color=ffffff");
  }

  // Basic Fallbacks
  const normalized = tech.toLowerCase();
  if (normalized.includes("react")) {
    return "https://img.icons8.com/ios-glyphs/30/ffffff/react.png";
  }
  if (normalized.includes("node")) {
    return "https://img.icons8.com/windows/32/ffffff/node-js.png";
  }
  if (normalized.includes("mongodb")) {
    return "https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/ffffff/external-mongodb-a-cross-platform-document-oriented-database-program-logo-bold-tal-revivo.png";
  }
  if (normalized.includes("kubernetes")) {
    return "https://img.icons8.com/ios-filled/50/ffffff/kubernetes.png";
  }
  if (normalized.includes("docker")) {
    return "https://img.icons8.com/ios-filled/50/ffffff/docker.png";
  }
  return "https://img.icons8.com/?size=100&id=8420&format=png&color=ffffff";
};

const getRespIcon = (idx) => {
  const icons = ["🤖", "⚡", "💻", "🧩", "📊", "🧪", "🚀"];
  return icons[idx % icons.length];
};

const coreTech = [
  "Dialogflow CX", "Angular", "GCP Cloud Run", "AWS Lambda", 
  "BigQuery", "Model Context Protocol (MCP)", "Terraform", 
  "Jenkins", "Cypress"
];

// Helper to chunk skills into alternating rows of 3 and 2 for the honeycomb shape
const chunkSkillsIntoHoneycombRows = (items) => {
  const rows = [];
  let index = 0;
  let rowType = 3;

  while (index < items.length) {
    const rowSize = rowType;
    rows.push(items.slice(index, index + rowSize));
    index += rowSize;
    rowType = rowType === 3 ? 2 : 3;
  }
  return rows;
};

// ==========================================
// SUBCOMPONENTS
// ==========================================

// --- NAVBAR COMPONENT ---
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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

  useEffect(() => {
    const sections = ["about", "experience", "skills", "projects", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
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
  const navItems = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[10vh] flex justify-between items-center bg-navbar-bg border-b border-navbar-border px-4 min-[400px]:px-[30px] z-[1000] font-sans backdrop-blur-md transition-colors duration-300">
        <div className="flex-1">
          <a
            href="#"
            className="text-brand-red text-[clamp(22px,3.5vw,30px)] font-bold tracking-wide drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)] hover:text-red-500 transition-colors"
          >
            HARSHWARDHAN SAINI
          </a>
        </div>

        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-8 list-none relative">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="relative py-1">
                  <a
                    href={`#${item.id}`}
                    className={`font-montserrat text-lg transition-colors duration-300 font-medium ${
                      isActive ? "text-brand-red" : "text-text-primary hover:text-brand-red"
                    }`}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.div 
                      layoutId="activeUnderlineDemo"
                      className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-brand-red rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop/Tablet Vertical Divider */}
          <div className="w-[1.5px] h-4 bg-neutral-300 dark:bg-neutral-700 hidden md:block mx-1" />

          <button
            onClick={toggleTheme}
            className="text-text-primary hover:text-brand-red transition-colors duration-300 cursor-pointer focus:outline-none flex items-center justify-center p-1.5"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
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

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
                className="fixed top-[10vh] left-0 w-screen h-[90vh] bg-black/50 backdrop-blur-xs z-[998]"
              />

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
                            isActive ? "text-brand-red font-bold" : "text-text-primary hover:text-brand-red"
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

// --- HERO COMPONENT ---
function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullWord = roles[roleIdx];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && roleText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIdx((prev) => (prev + 1) % roles.length);
    } else {
      timer = setTimeout(() => {
        setRoleText(
          isDeleting
            ? fullWord.substring(0, roleText.length - 1)
            : fullWord.substring(0, roleText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIdx]);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const roles = [
    "Software Engineer",
    "Backend Developer",
    "AI Engineer",
    "Cloud Enthusiast",
    "Full Stack Developer"
  ];

  const orbitingBadges = [
    { name: "React", icon: "https://img.icons8.com/ios-glyphs/30/FFFFFF/react.png", class: "top-[5%] left-[-15%]", delay: 0, duration: 6 },
    { name: "Node.js", icon: "https://img.icons8.com/windows/32/FFFFFF/node-js.png", class: "top-[15%] right-[-15%]", delay: 1, duration: 5.5 },
    { name: "Docker", icon: "https://img.icons8.com/ios-filled/50/FFFFFF/docker.png", class: "bottom-[5%] left-[-15%]", delay: 0.5, duration: 6.5 },
    { name: "Kubernetes", icon: "https://img.icons8.com/ios-filled/50/FFFFFF/kubernetes.png", class: "bottom-[20%] right-[-15%]", delay: 1.5, duration: 5.8 },
    { name: "AWS", icon: "https://img.icons8.com/?size=100&id=AtEKkdldZfri&format=png&color=ffffff", class: "top-[-12%] left-[30%]", delay: 2, duration: 7 },
    { name: "Redis", icon: "https://img.icons8.com/?size=100&id=dmAy2s25QyTr&format=png&color=ffffff", class: "bottom-[-12%] right-[30%]", delay: 0.8, duration: 6.2 }
  ];

  return (
    <section
      id="about"
      className="w-full min-h-screen pt-[10vh] flex flex-col items-center justify-center text-center p-4 min-[500px]:p-[50px] text-text-primary font-sans scroll-mt-[10vh] transition-colors duration-300 relative overflow-visible"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col min-[1000px]:flex-row justify-between items-center w-full max-w-[1100px] p-2.5 gap-16 min-[1000px]:gap-24 relative z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center min-[1000px]:items-start text-center min-[1000px]:text-left max-w-[580px] p-2.5 min-[1000px]:p-[10px_40px_10px_10px] min-[650px]:text-base"
        >
          <h1 className="text-[clamp(32px,6.5vw,48px)] font-black tracking-tight leading-none mb-1 text-text-primary">
            Hello, I'm
          </h1>
          <h2 className="text-[clamp(34px,7vw,54px)] font-black tracking-tight leading-tight mb-4 text-brand-red whitespace-nowrap">
            Harshwardhan Saini
          </h2>

          <div className="h-10 min-[500px]:h-12 flex items-center justify-center min-[1000px]:justify-start mb-6 w-full">
            <span className="text-xl min-[500px]:text-2xl font-bold font-montserrat text-text-primary/90">
              I code as a{" "}
              <span className="text-brand-red border-r-2 border-brand-red animate-pulse pr-1">
                {roleText}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-4 text-left w-full text-base min-[650px]:text-lg text-text-secondary mb-8 font-sans">
            <div className="flex items-start gap-4">
              <span className="text-xl select-none shrink-0 mt-1">💻</span>
              <p className="mt-1">
                I'm a Software Developer passionate about building robust backend architectures and AI-driven solutions.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl select-none shrink-0 mt-1">🎓</span>
              <p className="mt-1">
                Currently pursuing Computer Science at NIIT University, focusing on scalable distributed systems.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl select-none shrink-0 mt-1">🛠️</span>
              <p className="mt-1">
                Experienced in designing microservices, orchestrating clouds, and building multi-agent AI ecosystems.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-base font-montserrat justify-center min-[1000px]:justify-start">
            <a
              href="#projects"
              className="flex items-center gap-2 bg-[#0a0a0a] dark:bg-neutral-900 text-white border border-neutral-700/60 hover:border-brand-red/50 rounded-xl px-5 py-2.5 font-bold transition-all duration-300 shadow-md hover:shadow-[0_4px_20px_rgba(229,9,20,0.15)] hover:-translate-y-0.5 relative overflow-hidden group no-underline"
            >
              <span className="relative z-10">Projects</span>
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white relative z-10"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>

            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-red text-white border border-transparent rounded-xl px-5 py-2.5 font-bold transition-all duration-300 shadow-md hover:shadow-[0_4px_25px_rgba(229,9,20,0.3)] hover:-translate-y-0.5 relative overflow-hidden group no-underline"
            >
              <span className="relative z-10">Resume</span>
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white relative z-10"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="15" y2="3"></line>
                <polyline points="7 10 12 15 17 10"></polyline>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              </svg>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center gap-6 relative"
        >
          {/* Main Avatar Container */}
          <div 
            className="w-[260px] h-[260px] relative flex items-center justify-center group select-none"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-red via-red-600 to-transparent animate-glow-spin p-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-red via-red-500 to-transparent animate-glow-spin p-[2px]" />

            <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full bg-bg-dark p-1.5 relative z-10 flex items-center justify-center">
              <img
                src={profileImg}
                alt="Harshwardhan Saini Profile"
                className="w-full h-full rounded-full object-cover shadow-[0_4px_30px_rgba(0,0,0,0.35)] select-none pointer-events-none group-hover:scale-[1.01] transition-transform duration-300"
                loading="eager"
              />
            </div>

            {orbitingBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                className={`absolute ${badge.class} z-30 w-[42px] h-[42px] min-[400px]:w-[48px] min-[400px]:h-[48px] rounded-full bg-card-dark border border-border-theme flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:border-brand-red/50 hover:shadow-[0_8px_25px_rgba(229,9,20,0.2)] transition-colors duration-300`}
                initial={{ y: 0 }}
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: badge.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: badge.delay
                }}
              >
                <img 
                  src={badge.icon} 
                  alt={badge.name} 
                  className="w-5 h-5 min-[400px]:w-6 min-[400px]:h-6 object-contain pointer-events-none theme-icon-invert"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mt-6 z-20">
            <a
              href="https://www.linkedin.com/in/harshwardhan-saini-ab65a4279/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 font-bold text-sm min-[400px]:text-base text-white bg-[#0a0a0a] dark:bg-neutral-900 border border-neutral-700/60 hover:border-brand-red/50 rounded-xl transition-all hover:scale-105 duration-300 shadow-md hover:shadow-[0_4px_15px_rgba(0,0,0,0.25)] relative overflow-hidden group"
            >
              <span className="relative z-10">LinkedIn</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>
            <a
              href="https://github.com/Harshwardhan199"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 font-bold text-sm min-[400px]:text-base text-white bg-[#0a0a0a] dark:bg-neutral-900 border border-neutral-700/60 hover:border-brand-red/50 rounded-xl transition-all hover:scale-105 duration-300 shadow-md hover:shadow-[0_4px_15px_rgba(0,0,0,0.25)] relative overflow-hidden group"
            >
              <span className="relative z-10">GitHub</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// --- ABOUT COMPONENT ---
function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 35, 
      filter: "blur(6px)", 
      scale: 0.97 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 18,
        duration: 0.6
      } 
    }
  };

  return (
    <section
      id="about-details"
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-16 tracking-tight header-shadow font-sans"
        >
          ABOUT ME
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <motion.div 
            variants={cardVariants}
            className="group relative bg-card-dark p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1 cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10 select-none">
              🎓
            </div>
            <h3 className="text-xl font-bold text-text-primary tracking-wide z-10">
              Education
            </h3>
            <p className="text-text-secondary text-[15px] leading-relaxed z-10 font-sans">
              Pursuing a Bachelor of Technology in Computer Science at NIIT University. I specialize in backend architectures, system design, and intelligence integration.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            className="group relative bg-card-dark p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1 cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10 select-none">
              💻
            </div>
            <h3 className="text-xl font-bold text-text-primary tracking-wide z-10">
              My Focus
            </h3>
            <p className="text-text-secondary text-[15px] leading-relaxed z-10 font-sans">
              I am highly focused on building full-stack applications, designing microservices, and crafting multi-agent AI ecosystems that solve concrete business challenges.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            className="group relative bg-card-dark p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1 cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10 select-none">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-text-primary tracking-wide z-10">
              Philosophy
            </h3>
            <p className="text-text-secondary text-[15px] leading-relaxed z-10 font-sans">
              I believe in clean, reusable code, rigorous automation, and continuous optimization. Turning complex challenges into simple, maintainable software is my ultimate goal.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- EXPERIENCE COMPONENT ---
function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 70, damping: 15 }
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <section
      id="experience"
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-16 tracking-tight header-shadow font-sans"
        >
          EXPERIENCE
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="w-full relative pl-6 min-[600px]:pl-10"
        >
          <div className="absolute left-1.5 min-[600px]:left-5 top-2 bottom-2 w-[2px] bg-border-theme" />

          {experienceData.map((exp, index) => (
            <div key={index} className="w-full relative mb-8">
              <div className="absolute left-[-29px] min-[600px]:left-[-45px] top-1.5 w-4 h-4 rounded-full bg-brand-red border-4 border-bg-dark z-10 shadow-[0_0_10px_rgba(229,9,20,0.5)] animate-pulse" />
              
              <motion.div 
                variants={cardVariants}
                className="w-full bg-card-dark p-6 min-[600px]:p-8 rounded-2xl border border-border-theme shadow-sm hover:border-brand-red/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6 pb-4 border-b border-border-theme">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-wide">
                      {exp.role}
                    </h3>
                    <p className="text-lg min-[500px]:text-xl font-bold text-brand-red mt-1">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-xs min-[500px]:text-sm font-semibold text-text-primary bg-text-primary/10 dark:bg-neutral-800 border border-border-theme px-4 py-1.5 rounded-full inline-block self-start sm:self-center">
                    {exp.duration}
                  </div>
                </div>

                <motion.ul 
                  variants={listVariants}
                  className="flex flex-col gap-4 list-none pl-0 mb-8"
                >
                  {exp.responsibilities.map((resp, idx) => (
                    <motion.li 
                      key={idx} 
                      variants={itemVariants}
                      className="flex items-start gap-3 text-[15px] min-[500px]:text-base text-text-secondary leading-relaxed font-sans"
                    >
                      <span className="text-xl select-none shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center">
                        {getRespIcon(idx)}
                      </span>
                      <span className="mt-0.5">
                        {resp.split(/\b(ADK|Dialogflow CX|Angular|MCP|Cloud Run|AWS Lambda|Google Cloud Functions|BigQuery|Cypress|Terraform|Jenkins|GitHub Actions|AI conversational agents|backend APIs|CI\/CD pipelines)\b/g).map((part, i) => {
                          const isKeyword = ["ADK", "Dialogflow CX", "Angular", "MCP", "Cloud Run", "AWS Lambda", "Google Cloud Functions", "BigQuery", "Cypress", "Terraform", "Jenkins", "GitHub Actions", "AI conversational agents", "backend APIs", "CI/CD pipelines"].includes(part);
                          return isKeyword ? (
                            <strong key={i} className="font-semibold text-text-primary">
                              {part}
                            </strong>
                          ) : (
                            part
                          );
                        })}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">
                    Core Stack & Frameworks Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {coreTech.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-input-bg border border-border-theme text-text-primary hover:border-brand-red/30 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Local Component to handle isolated cell hover and tilt states in Demo
function HoneycombCell({ skill, idx, rowLength }) {
  const [isHovered, setIsHovered] = useState(false);

  // L = 3: idx 0 tilts left (-6deg), idx 1 no tilt (0deg), idx 2 tilts right (6deg)
  // L = 2: idx 0 tilts left (-6deg), idx 1 tilts right (6deg)
  const tiltVal = rowLength === 3
    ? (idx === 0 ? -6 : idx === 2 ? 6 : 0)
    : (rowLength === 2 ? (idx === 0 ? -6 : 6) : 0);

  return (
    <motion.div 
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="skill flex items-center justify-center relative w-[125px] h-[143px] min-[400px]:w-[150px] min-[400px]:h-[172px] overflow-visible group cursor-pointer"
    >
      {/* Hexagon SVG Background with hover glow, scaling, and custom direction tilt */}
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 110">
        <polygon 
          points="50,0 100,25 100,75 50,100 0,75 0,25" 
          className="fill-card-dark stroke-border-theme stroke-[2.5] group-hover:stroke-brand-red/60 group-hover:[filter:drop-shadow(0_1px_12px_rgba(229,9,20,0.35))] transition-all duration-500"
          style={{
            transform: `scale(${isHovered ? 1.015 : 0.95}) rotate(${isHovered ? tiltVal : 0}deg)`,
            transformOrigin: "center"
          }}
        />
      </svg>
      
      {/* HTML Content Overlay (100% GPU-accelerated transitions) */}
      {/* HTML Content Overlay (100% GPU-accelerated transitions) */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        animate={{
          rotate: isHovered ? tiltVal : 0
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20
        }}
      >
        {/* Icon (Absolute Positioned with Framer Motion spring) */}
        <motion.img 
          src={skill.icon} 
          alt={`${skill.name} Icon`} 
          className="absolute left-1/2 top-1/2 w-[45px] h-[45px] min-[400px]:w-[55px] min-[400px]:h-[55px] object-contain select-none"
          loading="lazy"
          initial={{ x: "-50%", y: "-50%", scale: 1 }}
          animate={{
            x: "-50%",
            y: isHovered 
              ? (window.innerWidth < 400 ? "-85%" : "-95%") 
              : "-50%",
            scale: isHovered ? 0.55 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22
          }}
        />
        
        {/* Reveal text inside hexagon (Framer Motion fade & scale) */}
        <motion.div 
          className="absolute bottom-[38px] min-[400px]:bottom-[46px] left-0 right-0 flex flex-col items-center text-center px-2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.9,
            y: isHovered ? 0 : 4
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut"
          }}
        >
          <h4 className="text-[10px] min-[400px]:text-[12px] font-extrabold text-text-primary tracking-wide leading-none font-sans">
            {skill.name}
          </h4>
          <p className="text-[7.5px] min-[400px]:text-[9.5px] text-text-secondary leading-tight mt-1 max-w-[95px] min-[400px]:max-w-[115px] line-clamp-2 font-sans">
            {skill.description}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// --- SKILLS COMPONENT ---
function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filterCategories = [
    "All", 
    "Programming", 
    "Frontend", 
    "Backend", 
    "AI & Agents", 
    "Cloud & DevOps", 
    "Databases & Architecture"
  ];

  return (
    <section
      id="skills"
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-6 tracking-tight header-shadow font-sans"
        >
          SKILLS
        </motion.h2>

        <div className="flex flex-wrap gap-2.5 justify-center mb-16 max-w-[900px]">
          {filterCategories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all duration-300 border ${
                  isActive 
                    ? "bg-brand-red text-white border-brand-red shadow-sm"
                    : "bg-card-dark border-border-theme text-text-primary hover:border-brand-red/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <motion.div 
          layout="position"
          className="w-full flex flex-col items-center gap-16"
        >
          <AnimatePresence mode="popLayout">
            {skillsData
              .filter((group) => activeCategory === "All" || group.category === activeCategory)
              .map((categoryGroup, catIndex) => {
                const filteredSkills = categoryGroup.items;
                const isFirst = catIndex === 0 && activeCategory === "All";
                const isLast = categoryGroup.category === "Databases & Architecture" && activeCategory === "All";

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={categoryGroup.category} 
                    className="w-full text-center"
                  >
                    <h3 className="inline-block font-black text-[22px] min-[500px]:text-[26px] text-text-primary mt-4 mb-10 pb-1.5 border-b-2 border-brand-red font-sans">
                      {categoryGroup.category}
                    </h3>

                    {isFirst || isLast ? (
                      <motion.div 
                        layout
                        className="flex flex-wrap items-center justify-center gap-5 max-w-[1200px] mx-auto my-5"
                      >
                        {filteredSkills.map((skill) => (
                          <motion.div 
                            layout
                            key={skill.name}
                            className="flex flex-col items-center justify-center w-[clamp(145px,43vw,190px)] h-[250px] p-5 bg-card-dark border border-border-theme rounded-xl shadow-sm hover:shadow-[0_8px_25px_rgba(229,9,20,0.08)] hover:border-brand-red/30 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                          >
                            <img 
                              src={skill.icon} 
                              alt={`${skill.name} Icon`} 
                              className="w-10 h-10 mt-2 mb-6 object-contain select-none"
                              loading="lazy"
                            />
                            <h4 className="text-lg text-text-primary text-center font-bold mb-3 tracking-wide font-sans">
                              {skill.name}
                            </h4>
                            <p className="text-[13px] text-text-secondary text-center leading-relaxed font-sans">
                              {skill.description}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        layout
                        className="flex flex-col items-center justify-center"
                      >
                        {chunkSkillsIntoHoneycombRows(filteredSkills).map((row, rowIndex) => (
                          <motion.div 
                            layout
                            key={rowIndex} 
                            className="flex items-center justify-center gap-2.5 -mt-[40px] min-[400px]:-mt-[50px] first:mt-0 overflow-visible"
                          >
                            {row.map((skill, idx) => (
                              <HoneycombCell 
                                key={skill.name} 
                                skill={skill} 
                                idx={idx} 
                                rowLength={row.length} 
                              />
                            ))}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// --- PROJECTS COMPONENT ---
function ProjectCard({ project }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

    setTilt({ x: rotateX, y: rotateY });
    setSpotlight({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const isTeamProject = project.description.toLowerCase().includes("team project");

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="project-card flex flex-col relative bg-card-dark border border-border-theme rounded-2xl overflow-hidden shadow-sm hover:border-brand-red/35 transition-all duration-300 w-full cursor-pointer h-full group"
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.005)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.12s ease-out, border-color 0.3s ease"
      }}
    >
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(180px circle at ${spotlight.x}px ${spotlight.y}px, rgba(229, 9, 20, 0.06) 0%, transparent 100%)`
          }}
        />
      )}

      {project.github && (
        <div className="absolute right-3.5 top-3.5 h-[34px] w-[34px] z-20 opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
            <img src={gitIcon} alt="GitHub Link" className="h-[34px] w-[34px] rounded-full object-cover" />
          </a>
        </div>
      )}

      <div className="w-full h-[200px] overflow-hidden border-b border-border-theme relative z-0">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 select-none"
          loading="lazy"
        />
        {project.demo && (
          <a 
            href={project.demo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold text-sm tracking-wide z-10"
          >
            View Live Demo ↗
          </a>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 text-left relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-text-primary tracking-wide border-l-2 border-brand-red pl-2.5 font-sans leading-snug">
            {project.title}
          </h3>
          {isTeamProject && (
            <span className="text-[10px] font-bold tracking-wider text-brand-red bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 rounded-full uppercase shrink-0">
              Team
            </span>
          )}
        </div>

        <p className="text-[13px] text-text-secondary leading-relaxed mb-6 font-sans flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.technologies.map((tech, idx) => (
            <span 
              key={idx} 
              className="flex items-center gap-1.5 bg-input-bg border border-border-theme text-text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full select-none transition-colors duration-300 hover:border-brand-red/35 font-sans"
            >
              <img 
                src={getTechIcon(tech)} 
                alt="" 
                className="w-3.5 h-3.5 object-contain theme-icon-invert"
                aria-hidden="true"
              />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

function Projects() {
  return (
    <section 
      id="projects" 
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-16 tracking-tight font-sans header-shadow"
        >
          PROJECTS
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-6"
        >
          {projectsData.map((project) => (
            <div key={project.id} className="h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- CONTACT COMPONENT ---
function Contact() {
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    const form = e.target;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((res) => {
        if (res.ok) {
          setStatus({ submitting: false, submitted: true, error: null });
        } else {
          setStatus({
            submitting: false,
            submitted: false,
            error:
              "Something went wrong. Please check your inputs and try again.",
          });
        }
      })
      .catch((err) => {
        setStatus({
          submitting: false,
          submitted: false,
          error:
            err.message ||
            "A network error occurred. Please check your connection and try again.",
        });
      });
  };

  return (
    <section
      id="contact"
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-6 tracking-tight font-sans header-shadow"
        >
          CONTACT
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[700px] bg-card-dark p-6 min-[500px]:p-8 my-5 mx-4 min-h-[480px] rounded-2xl border border-border-theme shadow-sm flex flex-col justify-center relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {status.submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10 text-emerald-500 dark:text-emerald-450"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  Message Sent!
                </h3>
                
                <p className="text-text-secondary max-w-[420px] text-[15px] leading-relaxed font-sans">
                  Thank you for reaching out. Your message has been received, and I will get back to you as soon as possible.
                </p>
                
                <button
                  onClick={() =>
                    setStatus({ submitting: false, submitted: false, error: null })
                  }
                  className="mt-8 px-6 py-2.5 bg-input-bg hover:bg-input-focus-bg text-text-primary border border-border-theme rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between items-center w-full text-brand-red font-semibold mb-8">
                  <span className="font-sans text-[clamp(14px,3vw,18px)] text-text-primary tracking-wider uppercase">
                    GET IN TOUCH
                  </span>
                  <span className="flex items-center text-[clamp(14px,3vw,18px)] text-text-primary">
                    <img
                      src={phoneIcon}
                      alt="Phone Icon"
                      className="w-3.5 h-3.5 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                    />
                    (+91) 7357980181
                  </span>
                </div>

                <form
                  className="w-full font-sans text-text-primary flex flex-col gap-5"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" name="form-name" value="contact" />

                  {status.error && (
                    <div className="p-3.5 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold rounded-xl text-left">
                      ⚠️ {status.error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-col text-left w-full sm:w-1/2">
                      <label
                        htmlFor="name"
                        className="flex items-center text-sm font-semibold text-text-secondary mb-2"
                      >
                        <img
                          src={nameIcon}
                          alt=""
                          className="w-4 h-4 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                        />
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        className="w-full p-3 bg-input-bg text-text-primary border border-border-theme focus:border-brand-red/60 rounded-xl outline-none text-[15px] transition-all duration-300 focus:shadow-[0_0_15px_rgba(229,9,20,0.08)] focus:bg-card-dark shadow-xs"
                      />
                    </div>

                    <div className="flex flex-col text-left w-full sm:w-1/2">
                      <label
                        htmlFor="email"
                        className="flex items-center text-sm font-semibold text-text-secondary mb-2"
                      >
                        <img
                          src={emailIcon}
                          alt=""
                          className="w-4 h-3.5 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                        />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your email"
                        required
                        className="w-full p-3 bg-input-bg text-text-primary border border-border-theme focus:border-brand-red/60 rounded-xl outline-none text-[15px] transition-all duration-300 focus:shadow-[0_0_15px_rgba(229,9,20,0.08)] focus:bg-card-dark shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col text-left w-full mt-2">
                    <label
                      htmlFor="message"
                      className="flex items-center text-sm font-semibold text-text-secondary mb-2"
                    >
                      <img
                        src={messageIcon}
                        alt=""
                        className="w-4 h-3.5 mr-2 object-contain select-none filter dark:invert-0 light:invert-1"
                      />
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Your message"
                      required
                      className="w-full p-3 bg-input-bg text-text-primary border border-border-theme focus:border-brand-red/60 rounded-xl outline-none text-[15px] resize-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(229,9,20,0.08)] focus:bg-card-dark shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="w-full p-3.5 mt-4 border border-transparent rounded-xl bg-brand-red text-white text-base font-bold cursor-pointer transition-all duration-300 hover:bg-red-600 shadow-md hover:shadow-[0_4px_25px_rgba(229,9,20,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {status.submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </span>
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-center items-center gap-10 my-10 relative z-10">
          <a
            href="https://github.com/Harshwardhan199"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.5] hover:scale-[1.6] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            aria-label="GitHub Profile"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 496 512"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=harshwardhan199saini@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.5] hover:scale-[1.6] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            aria-label="Gmail Account Link"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/harshwardhan-saini/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.5] hover:scale-[1.6] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            aria-label="LinkedIn Profile"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN EXPORTED COMPONENT (DEMO)
// ==========================================

export default function Demo() {
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
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </CursorProvider>
  );
}
