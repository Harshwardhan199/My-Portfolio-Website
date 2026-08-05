import { motion } from "framer-motion";
import { defaultAboutCards } from "../data/about";
import { useCursor } from "../cursor/useCursor";

function About({ data }) {
  const cardCursor = useCursor("card");
  const activeCards = data?.cards?.length ? data.cards : defaultAboutCards;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: "blur(6px)",
      scale: 0.97,
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
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="about-details"
      className="w-full py-14 min-[400px]:py-20 px-3 min-[400px]:px-4 text-text-primary flex flex-col items-center justify-center font-sans transition-colors duration-300 relative z-20"
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
          ABOUT ME
        </motion.h2>

        {/* Detailed Info Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 min-[400px]:gap-6 w-full"
        >
          {activeCards.map((card, idx) => (
            <motion.div
              key={card.id || idx}
              variants={cardVariants}
              className="group relative bg-card-dark p-5 min-[400px]:p-8 rounded-2xl border border-border-theme hover:border-brand-red/30 transition-all duration-500 overflow-hidden flex flex-col gap-3 min-[400px]:gap-5 shadow-sm hover:shadow-[0_8px_30px_rgba(229,9,20,0.08)] hover:-translate-y-1"
              {...cardCursor}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="text-2xl min-[400px]:text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10 select-none">
                {card.emoji || "🎓"}
              </div>

              <h3 className="text-base min-[400px]:text-lg sm:text-xl font-bold text-text-primary tracking-wide z-10">
                {card.title}
              </h3>

              <p className="text-text-secondary text-xs min-[400px]:text-sm sm:text-[15px] leading-relaxed z-10 font-sans">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default About;
