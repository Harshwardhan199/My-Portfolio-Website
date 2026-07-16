import { motion } from "framer-motion";
import { useCursor } from "../cursor/useCursor";

function About() {
  const cardCursor = useCursor("card");
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
        
        {/* Section Header */}
        <motion.h2 
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-16 tracking-tight header-shadow font-sans"
        >
          ABOUT ME
        </motion.h2>

        {/* Detailed Info Bento Grid (Framer Motion Stagger) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          
          {/* Card 1: Education */}
          <motion.div 
            variants={cardVariants}
            className="group relative bg-card-dark p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1"
            {...cardCursor}
          >
            {/* Background Spot Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Icon Header */}
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

          {/* Card 2: Technical Focus */}
          <motion.div 
            variants={cardVariants}
            className="group relative bg-card-dark p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1"
            {...cardCursor}
          >
            {/* Background Spot Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Icon Header */}
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

          {/* Card 3: Philosophy */}
          <motion.div 
            variants={cardVariants}
            className="group relative bg-card-dark p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1"
            {...cardCursor}
          >
            {/* Background Spot Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Icon Header */}
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

export default About;
