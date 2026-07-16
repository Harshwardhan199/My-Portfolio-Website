import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCursor } from "../cursor/useCursor";
import { projectsData } from "../data/projects";
import { skillsData } from "../data/skills";
import gitIcon from "../assets/images/Git.png";

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

// Framer motion variants for cards entrance
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

function ProjectCard({ project }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardCursor = useCursor("card");
  const githubCursor = useCursor("github");
  const demoCursor = useCursor("demo");
  const imgCursor = useCursor("image");

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale tilt to max 6 degrees
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
      onMouseEnter={(e) => { handleMouseEnter(e); cardCursor.onMouseEnter(e); }}
      onMouseLeave={(e) => { handleMouseLeave(e); cardCursor.onMouseLeave(e); }}
      className="project-card flex flex-col relative bg-card-dark border border-border-theme rounded-2xl overflow-hidden shadow-sm hover:border-brand-red/35 transition-all duration-300 w-full h-full group"
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.005)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.12s ease-out, border-color 0.3s ease"
      }}
    >
      {/* Spotlight dynamic radial overlay */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(180px circle at ${spotlight.x}px ${spotlight.y}px, rgba(229, 9, 20, 0.06) 0%, transparent 100%)`
          }}
        />
      )}

      {/* GitHub Repo Overlay Link */}
      {project.github && (
        <div className="absolute right-3.5 top-3.5 h-[34px] w-[34px] z-20 opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="block" {...githubCursor}>
            <img src={gitIcon} alt="GitHub Link" className="h-[34px] w-[34px] rounded-full object-cover" />
          </a>
        </div>
      )}

      {/* Project Image & Live Demo Link Overlay */}
      <div className="w-full h-[200px] overflow-hidden border-b border-border-theme relative z-0" {...imgCursor}>
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
            {...demoCursor}
          >
            View Live Demo ↗
          </a>
        )}
      </div>

      {/* Project Details */}
      <div className="flex flex-col flex-1 p-6 text-left relative z-10">
        {/* Title and Metadata badge row */}
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

        {/* Description */}
        <p className="text-[13px] text-text-secondary leading-relaxed mb-6 font-sans flex-1">
          {project.description}
        </p>

        {/* Technologies Badge List */}
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

function Projects() {
  return (
    <section 
      id="projects" 
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        
        {/* Section Header */}
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-16 tracking-tight font-sans header-shadow"
        >
          PROJECTS
        </motion.h2>

        {/* Projects Grid (Framer Motion Stagger Reveal) */}
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

export default Projects;
