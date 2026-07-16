function About() {
  return (
    <section id="about-details" className="w-full py-16 px-4 bg-bg-dark text-text-primary flex flex-col items-center justify-center font-sans border-t border-border-theme transition-colors duration-300">
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        
        {/* Section Header */}
        <h2 className="text-[clamp(50px,10vw,70px)] font-black text-text-primary text-center mb-12 tracking-tight header-shadow">
          ABOUT ME
        </h2>

        {/* Detailed Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Card 1: Education */}
          <div className="bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-105 hover:border-brand-red/50 hover:shadow-card-custom-hover flex flex-col gap-4">
            <div className="text-4xl text-brand-red">🎓</div>
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">Education</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Pursuing a Bachelor of Technology in Computer Science at NIIT University. I specialize in backend architectures, system design, and intelligence integration.
            </p>
          </div>

          {/* Card 2: Technical Focus */}
          <div className="bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-105 hover:border-brand-red/50 hover:shadow-card-custom-hover flex flex-col gap-4">
            <div className="text-4xl text-brand-red">💻</div>
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">My Focus</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              I am highly focused on building full-stack applications, designing microservices, and crafting multi-agent AI ecosystems that solve concrete business challenges.
            </p>
          </div>

          {/* Card 3: Developer Philosophy */}
          <div className="bg-card-dark p-8 rounded-2xl border border-border-theme shadow-card-custom transition-all duration-300 hover:scale-105 hover:border-brand-red/50 hover:shadow-card-custom-hover flex flex-col gap-4">
            <div className="text-4xl text-brand-red">🛠️</div>
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">Philosophy</h3>
            <p className="text-text-secondary text-base leading-relaxed">
              I believe in clean, reusable code, rigorous automation, and continuous optimization. Turning complex challenges into simple, maintainable software is my ultimate goal.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default About;
