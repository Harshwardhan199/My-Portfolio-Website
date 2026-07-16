import { useState, useEffect, useRef } from "react";

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
  // {
  //   id: 4,
  //   title: "Foodies",
  //   description: "This is a team project where we built an android app where users can search recipes that can be made based on direct recipe name or ingredients on hand to minimize unused ingredients wastage.",
  //   technologies: ["Kotlin", "XML", "Node.js", "MongoDB"],
  //   github: "",
  //   demo: "",
  //   image: foodiesImg
  // },
  // {
  //   id: 5,
  //   title: "Portfolio Website",
  //   description: "This is my personal project where I have built a responsive website for my portfolio to showcase my skill and projects. This website is built using HTML, CSS and JavaScript.",
  //   technologies: ["HTML5", "CSS3"],
  //   github: "https://github.com/Harshwardhan199/My-Portfolio-Website",
  //   demo: "https://harshwardhansaini.netlify.app",
  //   image: portfolioImg
  // }
];

// Helper to resolve technology badge icons
const getTechIcon = (tech) => {
  const normalized = tech.toLowerCase();
  if (normalized.includes("react")) {
    return "https://img.icons8.com/ios-glyphs/30/FFFFFF/react.png";
  }
  if (normalized.includes("node")) {
    return "https://img.icons8.com/windows/32/FFFFFF/node-js.png";
  }
  if (normalized.includes("mongodb")) {
    return "https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/FFFFFF/external-mongodb-a-cross-platform-document-oriented-database-program-logo-bold-tal-revivo.png";
  }
  if (normalized.includes("python")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/python.png";
  }
  if (normalized.includes("django")) {
    return "https://img.icons8.com/?size=100&id=qVp1ZKu92Ta3&format=png&color=ffffff";
  }
  if (normalized.includes("kafka")) {
    return "https://img.icons8.com/?size=100&id=uJM6fA7tpH3t&format=png&color=ffffff";
  }
  if (normalized.includes("kubernetes")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/kubernetes.png";
  }
  if (normalized.includes("redis")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/redis.png";
  }
  if (normalized.includes("fastapi") || normalized.includes("api")) {
    return "https://img.icons8.com/windows/32/FFFFFF/api.png";
  }
  if (normalized.includes("docker")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/docker.png";
  }
  if (normalized.includes("kotlin")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/kotlin.png";
  }
  if (normalized.includes("xml")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/xml.png";
  }
  if (normalized.includes("html")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/html-5.png";
  }
  if (normalized.includes("css")) {
    return "https://img.icons8.com/ios-filled/50/FFFFFF/css3.png";
  }
  return "https://img.icons8.com/?size=100&id=8420&format=png&color=ffffff";
};

// ==========================================
// SUBCOMPONENTS
// ==========================================

// --- NAVBAR COMPONENT ---
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const hamburgerColor = theme === "dark" ? "FFFFFF" : "000000";

  return (
    <nav className="sticky top-0 w-full h-[10vh] flex justify-between items-center bg-navbar-bg border-b border-navbar-border px-4 min-[400px]:px-[30px] z-[1000] font-sans backdrop-blur-md transition-colors duration-300">
      <div className="flex-1">
        <a
          href="#"
          className="text-brand-red text-[clamp(22px,3.5vw,30px)] font-bold tracking-wide drop-shadow-[2px_2px_5px_rgba(0,0,0,0.5)] hover:text-red-500 transition-colors"
        >
          HARSHWARDHAN SAINI
        </a>
      </div>

      <div className="flex items-center gap-6">
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

      <div
        onClick={closeMenu}
        className={`fixed top-[10vh] left-0 w-screen h-[90vh] bg-black/40 z-[998] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

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

// --- HERO COMPONENT ---
function Hero() {
  return (
    <section
      id="about"
      className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center p-4 min-[500px]:p-[50px] text-text-primary font-sans scroll-mt-[10vh] transition-colors duration-300"
    >
      <div className="flex flex-col min-[1000px]:flex-row justify-between items-center w-full max-w-[1100px] p-2.5 gap-16 min-[1000px]:gap-24">
        <div className="flex flex-col items-center min-[1000px]:items-start text-center min-[1000px]:text-left max-w-[580px] p-2.5 min-[1000px]:p-[10px_40px_10px_10px] min-[650px]:text-base">
          <p className="text-[clamp(30px,7vw,50px)] font-extrabold tracking-tight header-shadow">
            Hello! i'm
          </p>
          <p className="text-[clamp(30px,7vw,50px)] font-extrabold mb-[30px] tracking-tight whitespace-nowrap overflow-wrap-normal header-shadow">
            Harshwardhan Saini
          </p>

          <div className="flex flex-col gap-4 text-left w-full text-lg min-[650px]:text-xl text-text-primary/90 mb-8 font-sans">
            <div className="flex items-start gap-4">
              <span className="text-xl">💻</span>
              <p>
                I'm a Software Developer passionate about software development
                and AI technologies.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl">🎓</span>
              <p>
                Currently studying Computer Science at NIIT University,
                passionate about building scalable software.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl">🛠️</span>
              <p>
                Experienced in full-stack development and AI-powered solutions.
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-[clamp(16px,3.5vw,22px)] font-montserrat">
            <a href="#projects" className="inline-block no-underline">
              <div className="flex items-center gap-2 bg-[#030712] text-white border-2 border-slate-400 rounded-xl px-5 py-2 font-semibold transition-transform hover:scale-105 duration-300">
                <span>Projects</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-white"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </div>
            </a>
            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block no-underline"
            >
              <div className="flex items-center gap-2 bg-[#030712] text-white border-2 border-slate-400 rounded-xl px-5 py-2 font-semibold transition-transform hover:scale-105 duration-300">
                <span>Resume</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-white"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>

        <div className="hidden min-[1000px]:flex flex-col items-center gap-6">
          <img
            src={profileImg}
            alt="Harshwardhan Saini Profile"
            className="w-[250px] h-[250px] rounded-full border-none shadow-[0_0_5px_#ff3333,0_0_10px_#ba0202] object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/harshwardhan-saini-ab65a4279/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 font-semibold text-lg text-white bg-[#030712] border-2 border-slate-400 rounded-lg hover:bg-slate-900 transition-all hover:scale-105 duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Harshwardhan199"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 font-semibold text-lg text-white bg-[#030712] border-2 border-slate-400 rounded-lg hover:bg-slate-900 transition-all hover:scale-105 duration-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- ABOUT COMPONENT ---
function About() {
  return (
    <section
      id="about-details"
      className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme transition-colors duration-300"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-12 tracking-tight header-shadow">
          ABOUT ME
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-105 hover:border-brand-red/50 hover:shadow-card-custom-hover flex flex-col gap-4">
            <div className="text-4xl text-brand-red">🎓</div>
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">
              Education
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Pursuing a Bachelor of Technology in Computer Science at NIIT
              University. I specialize in backend architectures, system design,
              and intelligence integration.
            </p>
          </div>

          <div className="bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-105 hover:border-brand-red/50 hover:shadow-card-custom-hover flex flex-col gap-4">
            <div className="text-4xl text-brand-red">💻</div>
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">
              My Focus
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              I am highly focused on building full-stack applications, designing
              microservices, and crafting multi-agent AI ecosystems that solve
              concrete business challenges.
            </p>
          </div>

          <div className="bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-105 hover:border-brand-red/50 hover:shadow-card-custom-hover flex flex-col gap-4">
            <div className="text-4xl text-brand-red">🛠️</div>
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">
              Philosophy
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              I believe in clean, reusable code, rigorous automation, and
              continuous optimization. Turning complex challenges into simple,
              maintainable software is my ultimate goal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- EXPERIENCE COMPONENT ---
function Experience() {
  return (
    <section
      id="experience"
      className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-12 tracking-tight header-shadow">
          EXPERIENCE
        </h2>

        <div className="w-full flex flex-col gap-8">
          {experienceData.map((exp, index) => (
            <div
              key={index}
              className="w-full bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-[1.01] hover:border-brand-red/50 hover:shadow-card-custom-hover"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-brand-red tracking-wide">
                    {exp.role}
                  </h3>
                  <p className="text-xl font-bold text-text-primary mt-1">
                    {exp.company}
                  </p>
                </div>
                <div className="text-sm md:text-base font-semibold text-text-primary bg-text-primary/10 px-4 py-1.5 rounded-full inline-block self-start sm:self-center">
                  {exp.duration}
                </div>
              </div>

              <ul className="flex flex-col gap-3 list-none pl-0">
                {exp.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base text-text-secondary leading-relaxed"
                  >
                    <span className="text-brand-red select-none text-xl mt-0.5">
                      •
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SKILLS COMPONENT ---
function Skills() {
  return (
    <section
      id="skills"
      className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-6 tracking-tight header-shadow">
          SKILLS
        </h2>

        <div className="w-full flex flex-col items-center gap-10">
          {skillsData.map((categoryGroup, index) => (
            <div key={index} className="w-full text-center">
              <h3 className="inline-block font-black text-[26px] min-[500px]:text-[30px] text-text-primary mt-8 mb-6 pb-1.5 border-b-2 border-brand-red font-sans">
                {categoryGroup.category}
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-5 max-w-[1200px] mx-auto my-5">
                {categoryGroup.items.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center w-[clamp(145px,43vw,190px)] h-[250px] p-4 bg-card-dark border border-border-theme rounded-xl shadow-card-custom transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-card-custom-hover hover:border-brand-red/30 cursor-pointer"
                  >
                    <img
                      src={skill.icon}
                      alt={`${skill.name} Icon`}
                      className="w-10 h-10 mt-4 mb-6 object-contain"
                      loading="lazy"
                    />

                    <h4 className="text-lg min-[500px]:text-xl text-text-primary text-center font-bold mb-3 tracking-wide font-sans">
                      {skill.name}
                    </h4>

                    <p className="text-sm text-text-secondary text-center font-sans">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- PROJECTS COMPONENT ---
function Projects() {
  const [visibleIds, setVisibleIds] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".project-card");

    const observer = new IntersectionObserver(
      (entries) => {
        let delay = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            setTimeout(() => {
              setVisibleIds((prev) => [...prev, Number(id)]);
            }, delay);

            delay += 500;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="projects"
      className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300"
    >
      <div
        className="w-full max-w-[1100px] flex flex-col items-center"
        ref={containerRef}
      >
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-12 tracking-tight font-sans header-shadow">
          PROJECTS
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-6">
          {projectsData.map((project) => {
            const isVisible = visibleIds.includes(project.id);
            return (
              <div
                key={project.id}
                data-id={project.id}
                className={`project-card flex flex-col relative bg-card-dark border border-border-theme rounded-2xl shadow-card-custom hover:shadow-card-custom-hover transition-all duration-300 ease-out will-change-[opacity,transform] group cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[100px]"
                }`}
              >
                {project.github && (
                  <div className="absolute right-3 top-3 h-[35px] w-[35px] z-10 transition-transform duration-300 hover:scale-110">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer"
                    >
                      <img
                        src={gitIcon}
                        alt="GitHub Link"
                        className="h-[35px] w-[35px] rounded-full object-cover"
                      />
                    </a>
                  </div>
                )}

                <div className="w-full h-[200px] overflow-hidden border-b-2 border-brand-red relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold text-lg"
                    >
                      View Live Demo ↗
                    </a>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5 text-left">
                  <h3 className="text-xl font-bold text-brand-red mb-3 tracking-wide pl-2 border-l-2 border-brand-red font-sans">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-5 font-sans min-h-[60px]">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2.5 mt-auto">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1.5 bg-[#303030] text-white text-xs px-3 py-1.5 rounded-full select-none transition-colors duration-300 hover:bg-brand-red font-sans"
                      >
                        <img
                          src={getTechIcon(tech)}
                          alt=""
                          className="w-3.5 h-3.5 object-contain"
                          aria-hidden="true"
                        />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
      className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-6 tracking-tight font-sans header-shadow">
          CONTACT
        </h2>

        <div className="w-full max-w-[700px] bg-card-dark p-5 min-[500px]:p-[30px] my-5 mx-[16px] min-[500px]:mx-[30px] min-h-[480px] rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 flex flex-col justify-center">
          {status.submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-brand-red animate-pulse"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Message Sent!
              </h3>
              <p className="text-text-secondary max-w-[420px] text-base leading-relaxed">
                Thank you for reaching out. Your message has been received, and
                I will get back to you as soon as possible.
              </p>
              <button
                onClick={() =>
                  setStatus({
                    submitting: false,
                    submitted: false,
                    error: null,
                  })
                }
                className="mt-8 px-6 py-2.5 bg-text-primary/10 text-text-primary hover:bg-text-primary/20 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center w-full text-brand-red font-semibold mb-6">
                <span className="font-sans text-[clamp(15px,3vw,20px)] text-text-primary tracking-wider uppercase">
                  GET IN TOUCH
                </span>
                <span className="flex items-center text-[clamp(15px,3vw,20px)]">
                  <img
                    src={phoneIcon}
                    alt="Phone Icon"
                    className="w-3 h-3.5 mr-2 object-contain select-none filter invert-0 dark:invert-0 light:invert"
                  />
                  (+91) 7357980181
                </span>
              </div>

              <form
                className="w-full font-sans text-text-primary flex flex-col gap-4"
                name="contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />

                {status.error && (
                  <div className="p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm font-semibold rounded-lg text-left">
                    ⚠️ {status.error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex flex-col text-left w-full sm:w-1/2">
                    <label
                      htmlFor="name"
                      className="flex items-center text-lg min-[500px]:text-[clamp(16px,3vw,20px)] font-medium mb-1.5"
                    >
                      <img
                        src={nameIcon}
                        alt=""
                        className="w-5 h-5 mr-2 object-contain select-none"
                      />
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="w-full p-2.5 bg-input-bg text-text-primary border-3 border-transparent rounded-lg outline-none text-lg min-[500px]:text-[clamp(16px,3vw,20px)] transition-all duration-300 focus:border-brand-red focus:bg-input-focus-bg"
                    />
                  </div>

                  <div className="flex flex-col text-left w-full sm:w-1/2">
                    <label
                      htmlFor="email"
                      className="flex items-center text-lg min-[500px]:text-[clamp(16px,3vw,20px)] font-medium mb-1.5"
                    >
                      <img
                        src={emailIcon}
                        alt=""
                        className="w-5 h-4 mr-2 object-contain select-none"
                      />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your email"
                      required
                      className="w-full p-2.5 bg-input-bg text-text-primary border-3 border-transparent rounded-lg outline-none text-lg min-[500px]:text-[clamp(16px,3vw,20px)] transition-all duration-300 focus:border-brand-red focus:bg-input-focus-bg"
                    />
                  </div>
                </div>

                <div className="flex flex-col text-left w-full mt-2">
                  <label
                    htmlFor="message"
                    className="flex items-center text-lg min-[500px]:text-[clamp(16px,3vw,20px)] font-medium mb-1.5"
                  >
                    <img
                      src={messageIcon}
                      alt=""
                      className="w-[18px] h-4 mr-2 object-contain select-none"
                    />
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Your message"
                    required
                    className="w-full p-2.5 bg-input-bg text-text-primary border-3 border-transparent rounded-lg outline-none text-lg min-[500px]:text-[clamp(16px,3vw,20px)] resize-none transition-all duration-300 focus:border-brand-red focus:bg-input-focus-bg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.submitting}
                  className="w-full p-3 mt-4 border-none rounded-lg bg-bg-dark text-text-primary text-xl font-medium cursor-pointer transition-all duration-300 hover:bg-bg-dark/80 border border-border-theme shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status.submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="flex justify-center items-center gap-12 my-8">
          <a
            href="https://github.com/Harshwardhan199"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.6] hover:scale-[1.7] transition-all duration-300"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 496 512"
              height="30"
              width="30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=harshwardhan199saini@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-brand-red scale-[1.6] hover:scale-[1.7] transition-all duration-300"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="30"
              width="30"
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
            className="text-text-primary hover:text-brand-red scale-[1.6] hover:scale-[1.7] transition-all duration-300"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="30"
              width="30"
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
