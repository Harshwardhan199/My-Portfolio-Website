import profileImg from "../assets/images/Profile.png";
import resumePdf from "../assets/resume.pdf";

function Hero() {
  return (
    <section
      id="about"
      className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center p-4 min-[500px]:p-[50px] text-text-primary font-sans scroll-mt-[10vh] transition-colors duration-300"
    >
      <div className="flex flex-col min-[1000px]:flex-row justify-between items-center w-full max-w-[1100px] p-2.5 gap-16 min-[1000px]:gap-24">
        {/* Description Section */}
        <div className="flex flex-col items-center min-[1000px]:items-start text-center min-[1000px]:text-left max-w-[580px] p-2.5 min-[1000px]:p-[10px_40px_10px_10px] min-[650px]:text-base">
          <p className="text-[clamp(30px,7vw,50px)] font-extrabold tracking-tight header-shadow">
            Hello! i'm
          </p>
          <p className="text-[clamp(30px,7vw,50px)] font-extrabold mb-[30px] tracking-tight whitespace-nowrap overflow-wrap-normal header-shadow">
            Harshwardhan Saini
          </p>

          {/* Subtext info */}
          <div className="flex flex-col gap-4 text-left w-full text-lg min-[650px]:text-xl text-text-primary/90 mb-8 font-sans">
            <div className="flex items-start gap-4">
              <span className="text-xl">💻</span>
              <p>
                I'm a Software Developer passionate about software development
                and AI technologies.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl">🎓</span>
              <p>
                Currently studying Computer Science at NIIT University,
                passionate about building scalable software.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl">🛠️</span>
              <p>
                Experienced in full-stack development and AI-powered solutions.
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex gap-4 text-[clamp(16px,3.5vw,22px)] font-montserrat">
            <a href="#projects" className="inline-block no-underline">
              <div className="flex items-center gap-2 bg-[#030712] text-white border-2 border-slate-400 rounded-xl px-5 py-2 font-semibold transition-transform hover:scale-105 duration-300">
                <span>Projects</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-white"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </div>
            </a>
            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block no-underline"
            >
              <div className="flex items-center gap-2 bg-[#030712] text-white border-2 border-slate-400 rounded-xl px-5 py-2 font-semibold transition-transform hover:scale-105 duration-300">
                <span>Resume</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-white"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Profile Image Section */}
        <div className="hidden min-[1000px]:flex flex-col items-center gap-6">
          <img
            src={profileImg}
            alt="Harshwardhan Saini Profile"
            className="w-[250px] h-[250px] rounded-full border-none shadow-[0_0_5px_#ff3333,0_0_10px_#ba0202] object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/harshwardhan-saini-ab65a4279/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 font-semibold text-lg text-white bg-[#030712] border-2 border-slate-400 rounded-lg hover:bg-slate-900 transition-all hover:scale-105 duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Harshwardhan199"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 font-semibold text-lg text-white bg-[#030712] border-2 border-slate-400 rounded-lg hover:bg-slate-900 transition-all hover:scale-105 duration-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
