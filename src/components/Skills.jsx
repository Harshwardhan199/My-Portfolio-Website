import { skillsData } from "../data/skills";

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

function Skills() {
  return (
    <section id="skills" className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300">
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        
        {/* Section Header */}
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-6 tracking-tight header-shadow font-sans">
          SKILLS
        </h2>

        {/* Skills Categories */}
        <div className="w-full flex flex-col items-center gap-12">
          {skillsData.map((categoryGroup, index) => {
            const isFirst = index === 0;
            const isLast = index === skillsData.length - 1;

            return (
              <div key={index} className="w-full text-center">
                
                {/* Category Name */}
                <h3 className="inline-block font-black text-[26px] min-[500px]:text-[30px] text-text-primary mt-6 mb-8 pb-1.5 border-b-2 border-brand-red font-sans">
                  {categoryGroup.category}
                </h3>

                {isFirst || isLast ? (
                  /* Render first & last sections in previous way (card grid) */
                  <div className="flex flex-wrap items-center justify-center gap-5 max-w-[1200px] mx-auto my-5">
                    {categoryGroup.items.map((skill, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col items-center justify-center w-[clamp(145px,43vw,190px)] h-[250px] p-4 bg-card-dark border border-border-theme rounded-xl shadow-card-custom transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-card-custom-hover hover:border-brand-red/30 cursor-pointer"
                      >
                        {/* Skill Icon */}
                        <img 
                          src={skill.icon} 
                          alt={`${skill.name} Icon`} 
                          className="w-10 h-10 mt-4 mb-6 object-contain"
                          loading="lazy"
                        />

                        {/* Skill Name */}
                        <h4 className="text-lg min-[500px]:text-xl text-text-primary text-center font-bold mb-3 tracking-wide font-sans">
                          {skill.name}
                        </h4>

                        {/* Skill Description */}
                        <p className="text-sm text-text-secondary text-center font-sans">
                          {skill.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Render middle sections as Honeycomb Grid */
                  <div className="flex flex-col items-center justify-center">
                    {chunkSkillsIntoHoneycombRows(categoryGroup.items).map((row, rowIndex) => (
                      <div 
                        key={rowIndex} 
                        className="flex items-center justify-center gap-2.5 -mt-[40px] min-[400px]:-mt-[50px] first:mt-0 overflow-visible"
                      >
                        {row.map((skill, idx) => (
                          <div 
                            key={idx} 
                            className="skill flex items-center justify-center relative w-[125px] h-[143px] min-[400px]:w-[150px] min-[400px]:h-[172px] overflow-visible group cursor-pointer"
                          >
                            {/* Hexagon SVG Background */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 110">
                              <polygon 
                                points="50,0 100,25 100,75 50,100 0,75 0,25" 
                                className="fill-card-dark stroke-border-theme stroke-2 origin-center transition-all duration-300 scale-95 group-hover:scale-100 group-hover:stroke-brand-red/50 group-hover:[filter:drop-shadow(0_1px_8px_rgba(255,0,0,0.25))]"
                              />
                            </svg>
                            
                            {/* HTML Overlay Content (shrinks icon, shows description inside shape on hover) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-visible">
                              {/* Icon */}
                              <img 
                                src={skill.icon} 
                                alt={`${skill.name} Icon`} 
                                className="w-[45px] h-[45px] min-[400px]:w-[55px] min-[400px]:h-[55px] object-contain transition-all duration-300 group-hover:w-[24px] group-hover:h-[24px] min-[400px]:group-hover:w-[30px] min-[400px]:group-hover:h-[30px] select-none"
                                loading="lazy"
                              />
                              
                              {/* Text showing on hover inside hexagon */}
                              <div className="max-h-0 opacity-0 group-hover:max-h-[60px] group-hover:opacity-100 transition-all duration-300 flex flex-col items-center text-center mt-0 group-hover:mt-1.5 overflow-hidden pointer-events-none">
                                <h4 className="text-[10px] min-[400px]:text-[12px] font-extrabold text-text-primary tracking-wide leading-none font-sans">
                                  {skill.name}
                                </h4>
                                <p className="text-[7.5px] min-[400px]:text-[9.5px] text-text-secondary leading-tight mt-1 max-w-[95px] min-[400px]:max-w-[115px] line-clamp-2 font-sans">
                                  {skill.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Skills;
