import { experienceData } from "../data/experience";

function Experience() {
  return (
    <section id="experience" className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme scroll-mt-[10vh] transition-colors duration-300">
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        
        {/* Section Header */}
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-12 tracking-tight header-shadow">
          EXPERIENCE
        </h2>

        {/* Experience Timeline/Cards */}
        <div className="w-full flex flex-col gap-8">
          {experienceData.map((exp, index) => (
            <div 
              key={index} 
              className="w-full bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-[1.01] hover:border-brand-red/50 hover:shadow-card-custom-hover"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-brand-red tracking-wide">
                    {exp.role}
                  </h3>
                  <p className="text-xl font-bold text-text-primary mt-1">
                    {exp.company}
                  </p>
                </div>
                <div className="text-sm md:text-base font-semibold text-text-primary bg-text-primary/10 px-4 py-1.5 rounded-full inline-block self-start sm:self-center">
                  {exp.duration}
                </div>
              </div>

              {/* Responsibilities */}
              <ul className="flex flex-col gap-3 list-none pl-0">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-text-secondary leading-relaxed">
                    <span className="text-brand-red select-none text-xl mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Experience;
