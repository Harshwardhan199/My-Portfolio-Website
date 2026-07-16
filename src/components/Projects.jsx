import { useEffect, useRef, useState } from "react";
import { projectsData } from "../data/projects";
import gitIcon from "../assets/images/Git.png";

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
  // Default LLM / AI / General icon fallback
  return "https://img.icons8.com/?size=100&id=8420&format=png&color=ffffff";
};

function Projects() {
  const [visibleIds, setVisibleIds] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".project-card");

    const observer = new IntersectionObserver((entries) => {
      let delay = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          setTimeout(() => {
            setVisibleIds((prev) => [...prev, Number(id)]);
          }, delay);

          delay += 500; // Exact staggered 500ms delay increment as in old JS
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="projects" className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300">
      <div className="w-full max-w-[1100px] flex flex-col items-center" ref={containerRef}>
        
        {/* Section Header */}
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-12 tracking-tight font-sans header-shadow">
          PROJECTS
        </h2>

        {/* Projects Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-6">
          {projectsData.map((project) => {
            const isVisible = visibleIds.includes(project.id);
            return (
              <div 
                key={project.id}
                data-id={project.id}
                className={`project-card flex flex-col relative bg-card-dark border border-border-theme rounded-2xl shadow-card-custom hover:shadow-card-custom-hover transition-all duration-300 ease-out will-change-[opacity,transform] group cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
                }`}
              >
                
                {/* GitHub Repo Link (Top Right Icon overlay) */}
                {project.github && (
                  <div className="absolute right-3 top-3 h-[35px] w-[35px] z-10 transition-transform duration-300 hover:scale-110">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                      <img src={gitIcon} alt="GitHub Link" className="h-[35px] w-[35px] rounded-full object-cover" />
                    </a>
                  </div>
                )}

                {/* Project Image */}
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

                {/* Project Details */}
                <div className="flex flex-col flex-1 p-5 text-left">
                  <h3 className="text-xl font-bold text-brand-red mb-3 tracking-wide pl-2 border-l-2 border-brand-red font-sans">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-5 font-sans min-h-[60px]">
                    {project.description}
                  </p>

                  {/* Tech Used badges */}
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

export default Projects;
