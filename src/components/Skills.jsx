import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillsData as defaultSkillsData } from "../data/skills";

const filterCategories = [
  "All",
  "Programming",
  "Frontend",
  "Backend",
  "AI & Agents",
  "Cloud & DevOps",
  "Databases & Architecture",
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

// Local Component to handle isolated cell hover, tilt, icon upward transition and text reveal animations
function HoneycombCell({ skill, idx, rowLength, iconObj }) {
  const [isHovered, setIsHovered] = useState(false);

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

  const iconSrc = iconObj?.url || skill.icon;
  const springConfig = { type: "spring", stiffness: 240, damping: 22 };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.05 : 1,
        rotate: isHovered ? tiltVal : 0,
        zIndex: isHovered ? 40 : 1,
      }}
      transition={springConfig}
      className="skill flex items-center justify-center relative w-[60px] h-[69px] min-[320px]:w-[92px] min-[320px]:h-[106px] min-[360px]:w-[110px] min-[360px]:h-[126px] min-[400px]:w-[130px] min-[400px]:h-[150px] overflow-visible group cursor-pointer select-none shrink-0"
    >
      {/* Hexagon SVG Background with smooth crimson glow filter */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        viewBox="0 0 100 110"
      >
        <polygon
          points="50,0 100,25 100,75 50,100 0,75 0,25"
          className="fill-card-dark stroke-border-theme stroke-[2.5] group-hover:stroke-brand-red/70 group-hover:[filter:drop-shadow(0_2px_16px_rgba(229,9,20,0.4))] transition-colors duration-300"
        />
      </svg>

      {/* Icon (Absolute Positioned with Framer Motion spring - moves further up on hover) */}
      {iconSrc ? (
        <motion.img
          src={iconSrc}
          alt={`${skill.name} Icon`}
          className="absolute left-1/2 top-1/2 w-[20px] h-[20px] min-[320px]:w-[32px] min-[320px]:h-[32px] min-[400px]:w-[45px] min-[400px]:h-[45px] object-contain select-none pointer-events-none"
          loading="lazy"
          animate={{
            x: "-50%",
            y: isHovered ? "-112%" : "-50%",
            scale: isHovered ? 0.55 : 1,
          }}
          transition={springConfig}
        />
      ) : (
        <motion.span
          className="absolute left-1/2 top-1/2 text-xs min-[360px]:text-xl font-bold text-brand-red select-none pointer-events-none"
          animate={{
            x: "-50%",
            y: isHovered ? "-110%" : "-50%",
            scale: isHovered ? 0.6 : 1,
          }}
          transition={springConfig}
        >
          ⚡
        </motion.span>
      )}

      {/* Reveal text inside hexagon */}
      <motion.div
        className="absolute bottom-[12px] min-[320px]:bottom-[24px] min-[400px]:bottom-[42px] left-0 right-0 flex flex-col items-center text-center px-1 min-[360px]:px-2 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.88,
          y: isHovered ? 0 : 6,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        <h4 className="text-[6.5px] min-[320px]:text-[8.5px] min-[400px]:text-[11px] font-extrabold text-text-primary tracking-wide leading-none font-sans truncate max-w-full">
          {skill.name}
        </h4>
        {skill.description && (
          <p className="text-[5px] min-[320px]:text-[7.5px] min-[400px]:text-[8.5px] text-text-secondary leading-tight mt-0.5 min-[400px]:mt-1 max-w-[50px] min-[320px]:max-w-[75px] min-[400px]:max-w-[100px] line-clamp-2 font-sans">
            {skill.description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

function Skills({ data, icons = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const activeSkillsData = data?.length ? data : defaultSkillsData;

  const iconMap = new Map();
  icons.forEach((ic) => iconMap.set(ic.id, ic));

  return (
    <section
      id="skills"
      className="w-full py-16 min-[400px]:py-20 px-2 min-[360px]:px-4 text-text-primary flex flex-col items-center justify-center font-sans scroll-mt-24 lg:scroll-mt-[12vh] transition-colors duration-300 relative z-20 overflow-hidden"
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(36px,8vw,65px)] font-black text-text-primary text-center mb-6 tracking-tight header-shadow font-sans"
        >
          SKILLS
        </motion.h2>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 min-[360px]:gap-2.5 justify-center mb-12 min-[400px]:mb-16 max-w-[900px] px-1">
          {filterCategories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] min-[360px]:text-xs font-semibold px-2.5 py-1.5 min-[360px]:px-4 min-[360px]:py-2 rounded-full cursor-pointer transition-all duration-300 border ${
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
          className="w-full flex flex-col items-center gap-12 min-[400px]:gap-16"
        >
          <AnimatePresence mode="popLayout">
            {activeSkillsData
              .filter(
                (group) =>
                  activeCategory === "All" || group.category === activeCategory,
              )
              .map((categoryGroup, catIndex) => {
                const filteredSkills = categoryGroup.items || [];
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
                    <h3 className="inline-block font-black text-[18px] min-[360px]:text-[22px] min-[500px]:text-[26px] text-text-primary mt-2 mb-8 min-[400px]:mb-10 pb-1 border-b-2 border-brand-red font-sans">
                      {categoryGroup.category}
                    </h3>

                    {isFirst || isLast ? (
                      /* Compact Rectangular Cards for First & Last Categories */
                      <motion.div
                        layout
                        className="flex flex-wrap items-center justify-center gap-3 min-[360px]:gap-4 max-w-[1200px] mx-auto my-3 min-[400px]:my-5"
                      >
                        {filteredSkills.map((skill) => {
                          const iconObj = iconMap.get(skill.iconId);
                          const iconSrc = iconObj?.url || skill.icon;
                          return (
                            <motion.div
                              layout
                              key={skill.id || skill.name}
                              className="flex flex-col items-center justify-center w-[clamp(115px,38vw,180px)] h-[135px] min-[360px]:h-[165px] min-[500px]:h-[180px] p-3 bg-card-dark border border-border-theme rounded-xl shadow-sm hover:shadow-[0_8px_25px_rgba(229,9,20,0.08)] hover:border-brand-red/30 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                            >
                              <div className="w-6 h-6 min-[360px]:w-8 min-[360px]:h-8 mb-2 flex items-center justify-center shrink-0">
                                {iconSrc ? (
                                  <img
                                    src={iconSrc}
                                    alt={`${skill.name} Icon`}
                                    className="w-full h-full object-contain select-none"
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="text-base font-bold text-brand-red">⚡</span>
                                )}
                              </div>
                              <h4 className="text-xs min-[360px]:text-base text-text-primary text-center font-bold mb-1 tracking-wide font-sans line-clamp-1">
                                {skill.name}
                              </h4>
                              {skill.description && (
                                <p className="text-[9.5px] min-[360px]:text-[12px] text-text-secondary text-center leading-tight font-sans line-clamp-2">
                                  {skill.description}
                                </p>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    ) : (
                      /* Honeycomb Hexagon Grid for Middle Categories */
                      <motion.div
                        layout
                        className="flex flex-col items-center justify-center w-full overflow-visible"
                      >
                        {chunkSkillsIntoHoneycombRows(filteredSkills).map(
                          (row, rowIndex) => (
                            <motion.div
                              layout
                              key={rowIndex}
                              className="flex items-center justify-center gap-1 min-[320px]:gap-2 min-[360px]:gap-3 min-[400px]:gap-4 -mt-[13px] min-[320px]:-mt-[22px] min-[360px]:-mt-[28px] min-[400px]:-mt-[33px] first:mt-0 overflow-visible"
                            >
                              {row.map((skill, idx) => (
                                <HoneycombCell
                                  key={skill.id || skill.name}
                                  skill={skill}
                                  idx={idx}
                                  rowLength={row.length}
                                  iconObj={iconMap.get(skill.iconId)}
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
