import { useState } from "react";
import { motion } from "framer-motion";
import { useCursor } from "../cursor/useCursor";
import { projectsData as defaultProjectsData } from "../data/projects";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 },
  },
};

function Projects({ data, icons = [] }) {
  const cardCursor = useCursor("card");
  const demoCursor = useCursor("button");
  const githubCursor = useCursor("github");

  const activeProjects = data?.length ? data : defaultProjectsData;

  const iconMap = new Map();
  icons.forEach((ic) => iconMap.set(ic.id, ic));

  return (
    <section
      id="projects"
      className="w-full py-14 min-[400px]:py-20 px-3 min-[400px]:px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(26px,7vw,54px)] font-black text-text-primary text-center mb-10 min-[400px]:mb-16 tracking-tight header-shadow font-sans"
        >
          PROJECTS
        </motion.h2>

        {/* Responsive Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-[400px]:gap-8 w-full"
        >
          {activeProjects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              variants={cardVariants}
              className="group relative bg-card-dark rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.12)] hover:-translate-y-1"
              {...cardCursor}
            >
              <div>
                {/* Project Image Container */}
                <div className="relative w-full h-[180px] min-[400px]:h-[210px] overflow-hidden bg-input-bg border-b border-border-theme">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl min-[400px]:text-4xl">
                      🚀
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {project.featured && (
                      <span className="px-2 py-0.5 min-[400px]:px-2.5 min-[400px]:py-1 rounded-full bg-amber-500 text-black text-[9px] min-[400px]:text-[10px] font-extrabold uppercase tracking-wider shadow">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 min-[400px]:p-6 space-y-3 min-[400px]:space-y-4">
                  <h3 className="text-base min-[400px]:text-lg sm:text-xl font-black text-text-primary tracking-tight font-sans">
                    {project.title}
                  </h3>

                  <p className="text-text-secondary text-xs min-[400px]:text-sm leading-relaxed line-clamp-3 font-sans">
                    {project.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 min-[400px]:gap-2 pt-1 min-[400px]:pt-2">
                    {(project.technologies || []).map((tech, tIdx) => {
                      const matchedIcon = iconMap.get(tech.toLowerCase());
                      return (
                        <span
                          key={tIdx}
                          className="flex items-center gap-1 min-[400px]:gap-1.5 px-2 py-0.5 min-[400px]:px-3 min-[400px]:py-1 rounded-lg bg-input-bg border border-border-theme text-text-secondary text-[10px] min-[400px]:text-xs font-medium"
                        >
                          {matchedIcon?.url && (
                            <img src={matchedIcon.url} alt={tech} className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 object-contain theme-icon-invert" />
                          )}
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 min-[400px]:p-6 pt-0 flex gap-2 min-[400px]:gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-brand-red text-white py-2 min-[400px]:py-2.5 rounded-xl font-bold text-[10px] min-[400px]:text-xs uppercase tracking-wider hover:opacity-90 transition shadow-md shadow-brand-red/20"
                    {...demoCursor}
                  >
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-input-bg border border-border-theme hover:border-brand-red/50 text-text-primary py-2 min-[400px]:py-2.5 rounded-xl font-bold text-[10px] min-[400px]:text-xs uppercase tracking-wider transition"
                    {...githubCursor}
                  >
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;
