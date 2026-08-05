import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillsData as defaultSkillsData } from "../../assets/data/skills";

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
function HoneycombCell({ skill, idx, rowIndex, rowLength, iconObj, activeWaveStep, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate cell step in the center-first button click ripple sequence:
  // Step 0: [0] center piece (origin)
  // Step 1: [-1] and [+1] adjacent cells
  // Step 2: [-2] and [+2] diagonal cells
  // Step 3: [00] bottom cell
  const getCellWaveStep = () => {
    if (rowIndex === 0 && rowLength === 3) {
      if (idx === 1) return 0; // [0] center piece
      return 1;                // [-1] and [+1]
    }
    if (rowIndex === 1 && rowLength === 2) {
      return 2;                // [-2] and [+2]
    }
    return 3;                  // [00]
  };

  const cellStep = getCellWaveStep();
  const isWaveActiveCell = activeWaveStep === cellStep;
  const isTransformActive = isHovered || isWaveActiveCell;
  const isContentRevealed = isMobile || isHovered || isWaveActiveCell;

  // Directional movement mapping (reduced by 30% overall):
  const getDirectionalShift = () => {
    if (rowLength === 3) {
      if (idx === 0) return { x: -11, y: 0 };  // [-1] move toward left
      if (idx === 1) return { x: 0, y: 0 };    // [0] center
      if (idx === 2) return { x: 11, y: 0 };   // [+1] move toward right
    }
    if (rowLength === 2) {
      if (idx === 0) return { x: -7, y: 12 };  // [-2] move away from [0] diagonally (down-left)
      if (idx === 1) return { x: 7, y: 12 };   // [+2] move away from [0] diagonally (down-right)
    }
    return { x: 0, y: 13 };                    // [00] move toward bottom
  };

  const shift = getDirectionalShift();
  const iconSrc = iconObj?.url || skill.icon;
  const springConfig = { type: "spring", stiffness: 220, damping: 20 };
  const animTransition = isWaveActiveCell && !isHovered
    ? { type: "spring", stiffness: 260, damping: 18 }
    : springConfig;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isTransformActive ? 1.06 : 1,
        x: isTransformActive ? shift.x : 0,
        y: isTransformActive ? shift.y : 0,
        zIndex: isTransformActive ? 40 : 1,
      }}
      transition={animTransition}
      className={`skill flex items-center justify-center relative w-[60px] h-[69px] min-[320px]:w-[92px] min-[320px]:h-[106px] min-[360px]:w-[110px] min-[360px]:h-[126px] min-[400px]:w-[130px] min-[400px]:h-[150px] overflow-visible group cursor-pointer select-none shrink-0 transform-gpu transition-shadow duration-300 ${
        isMobile
          ? ""
          : isTransformActive || isContentRevealed
            ? "[filter:drop-shadow(0_4px_16px_rgba(229,9,20,0.12))]"
            : ""
      }`}
    >
      {/* Hexagon SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        viewBox="0 0 100 110"
      >
        <polygon
          points="50,0 100,25 100,75 50,100 0,75 0,25"
          className={`fill-card-dark stroke-[1] transition-colors duration-300 ${
            isTransformActive || (!isMobile && isContentRevealed)
              ? "stroke-brand-red/70"
              : "stroke-border-theme group-hover:stroke-brand-red/30"
          }`}
        />
      </svg>

      {/* Flexbox Centered Icon Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {iconSrc ? (
          <motion.img
            src={iconSrc}
            alt={`${skill.name} Icon`}
            className="w-[20px] h-[20px] min-[320px]:w-[32px] min-[320px]:h-[32px] min-[400px]:w-[45px] min-[400px]:h-[45px] object-contain select-none"
            loading="eager"
            initial={false}
            animate={{
              y: isContentRevealed ? "-26px" : "0px",
              scale: isContentRevealed ? 0.6 : 1,
            }}
            transition={animTransition}
          />
        ) : (
          <motion.span
            className="text-xs min-[360px]:text-xl font-bold text-brand-red select-none"
            initial={false}
            animate={{
              y: isContentRevealed ? "-26px" : "0px",
              scale: isContentRevealed ? 0.65 : 1,
            }}
            transition={animTransition}
          >
            ⚡
          </motion.span>
        )}
      </div>

      {/* Reveal text inside hexagon */}
      <motion.div
        initial={false}
        className="absolute bottom-[12px] min-[320px]:bottom-[24px] min-[400px]:bottom-[42px] left-0 right-0 flex flex-col items-center text-center px-1 min-[360px]:px-2 pointer-events-none opacity-0"
        animate={{
          opacity: isContentRevealed ? 1 : 0,
          scale: isContentRevealed ? 1 : 0.88,
          y: isContentRevealed ? 0 : 6,
        }}
        transition={animTransition}
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

// Local Component to handle compact rectangular skill card hover & wave animations
function RectangularCardCell({ skill, idx, totalItems, iconObj, activeWaveStep, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const centerIdx = Math.floor(totalItems / 2);
  const cellStep = Math.abs(idx - centerIdx);
  const isWaveActiveCell = activeWaveStep === cellStep;
  const isTransformActive = isHovered || isWaveActiveCell;
  const activeHover = isMobile || isTransformActive;

  const iconSrc = iconObj?.url || skill.icon;
  const springConfig = { type: "spring", stiffness: 220, damping: 20 };
  const animTransition = isWaveActiveCell && !isHovered
    ? { type: "spring", stiffness: 260, damping: 18 }
    : springConfig;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isTransformActive ? 1.05 : 1,
        y: isTransformActive ? -6 : 0,
      }}
      transition={animTransition}
      className={`flex flex-col items-center justify-center w-[clamp(115px,38vw,180px)] h-[135px] min-[360px]:h-[165px] min-[500px]:h-[180px] p-3 bg-card-dark border rounded-xl shadow-sm transition-colors duration-300 cursor-default transform-gpu ${
        isMobile
          ? isTransformActive
            ? "border-brand-red/70"
            : "border-border-theme"
          : activeHover
            ? "border-brand-red/70 shadow-[0_4px_16px_rgba(229,9,20,0.12)]"
            : "border-border-theme hover:border-brand-red/30"
      }`}
    >
      <div className="w-6 h-6 min-[360px]:w-8 min-[360px]:h-8 mb-2 flex items-center justify-center shrink-0">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={`${skill.name} Icon`}
            className={`w-full h-full object-contain select-none transition-transform duration-300 ${
              activeHover ? "scale-110" : ""
            }`}
            loading="eager"
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
}

// Local Component to handle per-category sub-section scroll wave animation (Center [0] -> Adjacent -> Diagonal -> Bottom)
function SkillCategoryBlock({
  categoryGroup,
  catIndex,
  activeCategory,
  iconMap,
  isWaveActiveSection,
  onSectionEnter,
  onSectionWaveComplete,
  isMobile,
}) {
  const [activeWaveStep, setActiveWaveStep] = useState(-1);
  const hasTriggeredRef = useRef(false);

  const filteredSkills = categoryGroup.items || [];
  const isFirst = catIndex === 0 && activeCategory === "All";
  const isLast =
    categoryGroup.category === "Databases & Architecture" &&
    activeCategory === "All";

  const rows = isFirst || isLast
    ? [filteredSkills]
    : chunkSkillsIntoHoneycombRows(filteredSkills);

  // Trigger ripple wave ONLY when this section is active in the global sequence
  useEffect(() => {
    if (!isWaveActiveSection || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    let step = 0;
    const maxSteps = 4; // Step 0: [0], Step 1: [-1]/[+1], Step 2: [-2]/[+2], Step 3: [00]
    const interval = setInterval(() => {
      setActiveWaveStep(step);
      step++;
      if (step > maxSteps) {
        clearInterval(interval);
        setActiveWaveStep(-1);
        onSectionWaveComplete(catIndex);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isWaveActiveSection, catIndex, onSectionWaveComplete]);

  return (
    <motion.div
      layout
      onViewportEnter={() => onSectionEnter(catIndex)}
      viewport={{ once: true, amount: 0.25 }}
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
          {filteredSkills.map((skill, idx) => (
            <RectangularCardCell
              key={skill.id || skill.name}
              skill={skill}
              idx={idx}
              totalItems={filteredSkills.length}
              iconObj={iconMap.get(skill.iconId)}
              activeWaveStep={activeWaveStep}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      ) : (
        /* Honeycomb Hexagon Grid for Middle Categories */
        <motion.div
          layout
          className="flex flex-col items-center justify-center w-full overflow-visible"
        >
          {rows.map((row, rowIndex) => (
            <motion.div
              layout
              key={rowIndex}
              className="flex items-center justify-center gap-0.5 min-[320px]:gap-1.5 min-[360px]:gap-2 min-[400px]:gap-2.5 -mt-[20px] min-[320px]:-mt-[30px] min-[360px]:-mt-[37px] min-[400px]:-mt-[43px] first:mt-0 overflow-visible"
            >
              {row.map((skill, idx) => (
                <HoneycombCell
                  key={skill.id || skill.name}
                  skill={skill}
                  idx={idx}
                  rowIndex={rowIndex}
                  rowLength={row.length}
                  iconObj={iconMap.get(skill.iconId)}
                  activeWaveStep={activeWaveStep}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function Skills({ data, icons = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCatSet, setVisibleCatSet] = useState(() => new Set());
  const [completedCatSet, setCompletedCatSet] = useState(() => new Set());
  const [activeWaveCatIndex, setActiveWaveCatIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 639px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeSkillsData = data?.length ? data : defaultSkillsData;

  const iconMap = new Map();
  icons.forEach((ic) => iconMap.set(ic.id, ic));

  const filteredGroups = activeSkillsData.filter(
    (group) => activeCategory === "All" || group.category === activeCategory,
  );

  // Sequential Queue Manager: picks the lowest visible category index that hasn't completed its wave yet
  useEffect(() => {
    if (activeWaveCatIndex !== -1) return;

    const nextIdx = filteredGroups.findIndex(
      (_, idx) => visibleCatSet.has(idx) && !completedCatSet.has(idx)
    );

    if (nextIdx !== -1) {
      setActiveWaveCatIndex(nextIdx);
    }
  }, [visibleCatSet, completedCatSet, activeWaveCatIndex, filteredGroups]);

  const handleSectionEnter = useCallback((catIndex) => {
    setVisibleCatSet((prev) => {
      if (prev.has(catIndex)) return prev;
      const next = new Set(prev);
      next.add(catIndex);
      return next;
    });
  }, []);

  const handleSectionWaveComplete = useCallback((catIndex) => {
    setCompletedCatSet((prev) => {
      if (prev.has(catIndex)) return prev;
      const next = new Set(prev);
      next.add(catIndex);
      return next;
    });
    setActiveWaveCatIndex(-1);
  }, []);

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
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCatSet(new Set());
                  setCompletedCatSet(new Set());
                  setActiveWaveCatIndex(-1);
                }}
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
            {filteredGroups.map((categoryGroup, catIndex) => (
              <SkillCategoryBlock
                key={categoryGroup.category}
                categoryGroup={categoryGroup}
                catIndex={catIndex}
                activeCategory={activeCategory}
                iconMap={iconMap}
                isWaveActiveSection={activeWaveCatIndex === catIndex}
                onSectionEnter={handleSectionEnter}
                onSectionWaveComplete={handleSectionWaveComplete}
                isMobile={isMobile}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
