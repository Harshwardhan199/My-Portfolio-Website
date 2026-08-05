import { motion } from "framer-motion";
import { experienceData as defaultExperienceData } from "../../../assets/data/experience";
import { useCursor } from "../cursor/useCursor";

const getRespIcon = (idx) => {
  const icons = ["🤖", "⚡", "💻", "🧩", "📊", "🧪", "🚀"];
  return icons[idx % icons.length];
};

const defaultCoreTech = [
  "Dialogflow CX", "Angular", "GCP Cloud Run", "AWS Lambda", 
  "BigQuery", "Model Context Protocol (MCP)", "Terraform", 
  "Jenkins", "Cypress"
];

function Experience({ data }) {
  const cardCursor = useCursor("button");
  const activeExperience = data?.length ? data : defaultExperienceData;

  return (
    <section
      id="experience"
      className="w-full py-14 min-[400px]:py-20 px-3 min-[400px]:px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-24 lg:scroll-mt-[12vh] transition-colors duration-300 relative z-20"
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
          EXPERIENCE
        </motion.h2>

        {/* Timeline Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-6 min-[500px]:space-y-10"
        >
          {activeExperience.map((exp, idx) => (
            <motion.div
              key={exp.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-card-dark p-4 min-[400px]:p-6 min-[500px]:p-10 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1 overflow-hidden"
              {...cardCursor}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-red/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col min-[650px]:flex-row min-[650px]:items-center justify-between gap-2 border-b border-border-theme pb-4 min-[500px]:pb-6 mb-5 min-[500px]:mb-8">
                <div>
                  <h3 className="text-lg min-[400px]:text-xl sm:text-2xl min-[500px]:text-3xl font-black text-text-primary tracking-tight font-sans">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-red font-bold text-sm min-[400px]:text-base sm:text-lg min-[500px]:text-xl tracking-wide font-montserrat">
                      {exp.company}
                    </span>
                  </div>
                </div>

                <span className="self-start min-[650px]:self-auto px-3 py-1 min-[500px]:px-4 min-[500px]:py-1.5 rounded-full bg-input-bg border border-border-theme text-text-secondary text-[10px] min-[400px]:text-xs min-[500px]:text-sm font-semibold tracking-wider uppercase font-montserrat">
                  {exp.duration}
                </span>
              </div>

              {/* Responsibilities list */}
              <ul className="space-y-3 min-[500px]:space-y-4 mb-6 min-[500px]:mb-10 list-none p-0">
                {(exp.responsibilities || []).map((resp, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2.5 min-[400px]:gap-4 text-text-secondary text-xs min-[400px]:text-sm sm:text-base leading-relaxed">
                    <span className="text-sm min-[400px]:text-base min-[500px]:text-lg select-none shrink-0 mt-0.5">{getRespIcon(rIdx)}</span>
                    <span className="font-sans">{resp}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack Pills */}
              <div className="pt-4 min-[500px]:pt-6 border-t border-border-theme flex flex-wrap items-center gap-1.5 min-[400px]:gap-2">
                <span className="text-[10px] min-[400px]:text-xs font-bold tracking-wider text-text-primary/70 uppercase font-montserrat mr-1">
                  Stack:
                </span>
                {(exp.technologies?.length ? exp.technologies : defaultCoreTech).map((tech, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 min-[400px]:px-3 min-[400px]:py-1 rounded-lg bg-input-bg border border-border-theme text-text-secondary text-[10px] min-[400px]:text-xs font-medium font-mono hover:border-brand-red/40 hover:text-text-primary transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
