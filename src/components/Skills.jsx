import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillsData } from "../data/skills";
import { useCursor } from "../cursor/useCursor";

// Helper to chunk skills into alternating rows of 3 and 2 for the honeycomb shape
const chunkSkillsIntoHoneycombRows = (items) => {
  const rows = [];
  let index = 0;
  let rowType = 3; // alternating row sizes: start with a row of 3

  while (index < items.length) {
    const rowSize = rowType;
    rows.push(items.slice(index, index + rowSize));
    index += rowSize;
    rowType = rowType === 3 ? 2 : 3; // alternate between 3 and 2
  }
  return rows;
};

const filterCategories = [
  "All",
  "Programming",
  "Frontend",
  "Backend",
  "AI & Agents",
  "Cloud & DevOps",
  "Databases & Architecture",
];

// Local Component to handle isolated cell hover and tilt states
function HoneycombCell({ skill, idx, rowLength }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardCursor = useCursor("card");

  // L = 3: idx 0 tilts left (-6deg), idx 1 no tilt (0deg), idx 2 tilts right (6deg)
  // L = 2: idx 0 tilts left (-6deg), idx 1 tilts right (6deg)
  const tiltVal =
    rowLength === 3
      ? idx === 0
        ? -6
        : idx === 2
          ? 6
          : 0
      : rowLength === 2
        ? idx === 0
          ? -6
          : 6
        : 0;

  return (
    <motion.div
      layout
      onMouseEnter={(e) => {
        setIsHovered(true);
        cardCursor.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        cardCursor.onMouseLeave(e);
      }}
      className="skill flex items-center justify-center relative w-[125px] h-[143px] min-[400px]:w-[150px] min-[400px]:h-[172px] overflow-visible group"
    >
      {/* Hexagon SVG Background with hover glow, scaling, and custom direction tilt */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 100 110"
      >
        <polygon
          points="50,0 100,25 100,75 50,100 0,75 0,25"
          className="fill-card-dark stroke-border-theme stroke-[2.5] group-hover:stroke-brand-red/60 group-hover:[filter:drop-shadow(0_1px_12px_rgba(229,9,20,0.35))] transition-all duration-500"
          style={{
            transform: `scale(${isHovered ? 1.015 : 0.95}) rotate(${isHovered ? tiltVal : 0}deg)`,
            transformOrigin: "center",
          }}
        />
      </svg>

      {/* HTML Content Overlay (100% GPU-accelerated transitions) */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        animate={{
          rotate: isHovered ? tiltVal : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20,
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
            y: isHovered ? (window.innerWidth < 400 ? "-85%" : "-95%") : "-50%",
            scale: isHovered ? 0.55 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22,
          }}
        />

        {/* Reveal text inside hexagon (Framer Motion fade & scale) */}
        <motion.div
          className="absolute bottom-[38px] min-[400px]:bottom-[46px] left-0 right-0 flex flex-col items-center text-center px-2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.9,
            y: isHovered ? 0 : 4,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
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

function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section
      id="skills"
      className="w-full py-20 px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-[10vh] transition-colors duration-300 relative z-20"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(45px,9vw,65px)] font-black text-text-primary text-center mb-6 tracking-tight header-shadow font-sans"
        >
          SKILLS
        </motion.h2>

        {/* Category Filter Pills (Vercel Style) */}
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

        {/* Skills Categories Display */}
        <motion.div
          layout="position"
          className="w-full flex flex-col items-center gap-16"
        >
          <AnimatePresence mode="popLayout">
            {skillsData
              .filter(
                (group) =>
                  activeCategory === "All" || group.category === activeCategory,
              )
              .map((categoryGroup, catIndex) => {
                const filteredSkills = categoryGroup.items;
                const isFirst = catIndex === 0 && activeCategory === "All";
                const isLast =
                  categoryGroup.category === "Databases & Architecture" &&
                  activeCategory === "All";

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
                    {/* Category Title */}
                    {activeCategory === "All" && (
                      <h3 className="inline-block font-black text-[22px] min-[500px]:text-[26px] text-text-primary mt-4 mb-10 pb-1.5 border-b-2 border-brand-red">
                        {categoryGroup.category}
                      </h3>
                    )}

                    {isFirst || isLast ? (
                      /* Render Programming & Databases as Card Grids */
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
                      /* Render middle sections as Honeycomb Grid with dynamic position-based rotations */
                      <motion.div
                        layout
                        className="flex flex-col items-center justify-center"
                      >
                        {chunkSkillsIntoHoneycombRows(filteredSkills).map(
                          (row, rowIndex) => (
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
                          ),
                        )}
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

export default Skills;
