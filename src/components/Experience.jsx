import { motion } from "framer-motion";
import { experienceData } from "../data/experience";
import { useCursor } from "../cursor/useCursor";

// Helper to map index to custom responsibility bullet icons
const getRespIcon = (idx) => {
  const icons = ["🤖", "⚡", "💻", "🧩", "📊", "🧪", "🚀"];
  return icons[idx % icons.length];
};

// Core technologies used in the role to display as badge pills
const coreTech = [
  "Dialogflow CX", "Angular", "GCP Cloud Run", "AWS Lambda", 
  "BigQuery", "Model Context Protocol (MCP)", "Terraform", 
  "Jenkins", "Cypress"
];

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
        
        {/* Section Header */}
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-16 tracking-tight header-shadow font-sans"
        >
          EXPERIENCE
        </motion.h2>

        {/* Timeline Structure Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="w-full relative pl-6 min-[600px]:pl-10"
        >
          {/* Vertical timeline center line */}
          <div className="absolute left-1.5 min-[600px]:left-5 top-2 bottom-2 w-[2px] bg-border-theme" />

          {experienceData.map((exp, index) => (
            <div key={index} className="w-full relative mb-8">
              
              {/* Timeline indicator node */}
              <div className="absolute left-[-29px] min-[600px]:left-[-45px] top-1.5 w-4 h-4 rounded-full bg-brand-red border-4 border-bg-dark z-10 shadow-[0_0_10px_rgba(229,9,20,0.5)] animate-pulse" />
              
              {/* Timeline Card */}
              <motion.div 
                variants={cardVariants}
                className="w-full bg-card-dark p-6 min-[600px]:p-8 rounded-2xl border border-border-theme shadow-sm hover:border-brand-red/30 transition-all duration-300"
                {...useCursor("card")}
              >
                
                {/* Job Details Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6 pb-4 border-b border-border-theme">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-wide">
                      {exp.role}
                    </h3>
                    <p className="text-lg min-[500px]:text-xl font-bold text-brand-red mt-1">
                      {exp.company}
                    </p>
                  </div>
                  
                  {/* Job Duration Badge */}
                  <div className="text-xs min-[500px]:text-sm font-semibold text-text-primary bg-text-primary/10 dark:bg-neutral-800 border border-border-theme px-4 py-1.5 rounded-full inline-block self-start sm:self-center">
                    {exp.duration}
                  </div>
                </div>

                {/* Job Responsibilities List (Framer Motion Stagger) */}
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
                        {/* Highlight key developer keywords in bold */}
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

                {/* Key Technologies Section */}
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

export default Experience;
