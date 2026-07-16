import { skillsData } from "../data/skills";

function Skills() {
  return (
    <section id="skills" className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300">
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        
        {/* Section Header */}
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-6 tracking-tight header-shadow">
          SKILLS
        </h2>

        {/* Skills Categories */}
        <div className="w-full flex flex-col items-center gap-10">
          {skillsData.map((categoryGroup, index) => (
            <div key={index} className="w-full text-center">
              
              {/* Category Name */}
              <h3 className="inline-block font-black text-[26px] min-[500px]:text-[30px] text-text-primary mt-8 mb-6 pb-1.5 border-b-2 border-brand-red font-sans">
                {categoryGroup.category}
              </h3>

              {/* Skills Card Grid */}
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

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Skills;
