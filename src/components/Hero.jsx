import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { defaultHeroData } from "../data/hero";
import { useCursor } from "../cursor/useCursor";
import { openPdfInNewTab } from "../utils/pdfUtils";

const orbitingBadges = [
  {
    name: "React",
    icon: "https://img.icons8.com/ios-glyphs/30/FFFFFF/react.png",
    class: "top-[5%] left-[-15%]",
    delay: 0,
    duration: 6,
  },
  {
    name: "Node.js",
    icon: "https://img.icons8.com/windows/32/FFFFFF/node-js.png",
    class: "top-[15%] right-[-15%]",
    delay: 1,
    duration: 5.5,
  },
  {
    name: "Docker",
    icon: "https://img.icons8.com/ios-filled/50/FFFFFF/docker.png",
    class: "bottom-[5%] left-[-15%]",
    delay: 0.5,
    duration: 6.5,
  },
  {
    name: "Kubernetes",
    icon: "https://img.icons8.com/ios-filled/50/FFFFFF/kubernetes.png",
    class: "bottom-[20%] right-[-15%]",
    delay: 1.5,
    duration: 5.8,
  },
  {
    name: "AWS",
    icon: "https://img.icons8.com/?size=100&id=AtEKkdldZfri&format=png&color=ffffff",
    class: "top-[-12%] left-[30%]",
    delay: 2,
    duration: 7,
  },
  {
    name: "Redis",
    icon: "https://img.icons8.com/?size=100&id=dmAy2s25QyTr&format=png&color=ffffff",
    class: "bottom-[-12%] right-[30%]",
    delay: 0.8,
    duration: 6.2,
  },
];

function Hero({ data }) {
  const projectsBtnCursor = useCursor("button");
  const resumeCursor = useCursor("resume");
  const linkedinCursor = useCursor("github");
  const githubCursor = useCursor("github");

  const hero = data || defaultHeroData;
  const name = hero.name || defaultHeroData.name;
  const activeRoles = hero.roles?.length ? hero.roles : defaultHeroData.roles;
  const activeSubtexts = hero.subtexts?.length ? hero.subtexts : defaultHeroData.subtexts;
  const avatarSrc = hero.profileImage || defaultHeroData.profileImage;
  const resumeHref = hero.resumeUrl || defaultHeroData.resumeUrl;
  const githubHref = hero.github || defaultHeroData.github;
  const linkedinHref = hero.linkedin || defaultHeroData.linkedin;

  // Typing Animation Loop
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullWord = activeRoles[roleIdx % activeRoles.length] || "";
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && roleText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIdx((prev) => (prev + 1) % activeRoles.length);
    } else {
      timer = setTimeout(() => {
        setRoleText(
          isDeleting
            ? fullWord.substring(0, roleText.length - 1)
            : fullWord.substring(0, roleText.length + 1),
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIdx, activeRoles]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="about"
      className="w-full min-h-screen pt-24 lg:pt-[12vh] flex flex-col items-center justify-center text-center px-3 min-[500px]:px-[50px] pb-12 text-text-primary font-sans scroll-mt-24 lg:scroll-mt-[10vh] transition-colors duration-300 relative overflow-visible"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col min-[1000px]:flex-row justify-between items-center w-full max-w-[1100px] py-2.5 px-1 gap-12 min-[1000px]:gap-24 relative z-10"
      >
        {/* Description Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center min-[1000px]:items-start text-center min-[1000px]:text-left max-w-[580px] w-full p-1 min-[1000px]:p-[10px_40px_10px_10px]"
        >
          <h1 className="text-[clamp(26px,6vw,48px)] font-black tracking-tight leading-none mb-1 text-text-primary">
            Hello, I'm
          </h1>
          <h2 className="text-[clamp(28px,6.5vw,54px)] font-black tracking-tight leading-tight mb-4 text-brand-red break-words max-w-full">
            {name}
          </h2>

          {/* Typing Loop Section */}
          <div className="min-h-[40px] flex items-center justify-center min-[1000px]:justify-start mb-6 w-full">
            <span className="text-lg min-[400px]:text-xl min-[500px]:text-2xl font-bold font-montserrat text-text-primary/90 leading-tight">
              I code as a{" "}
              <span className="text-brand-red border-r-2 border-brand-red animate-pulse pr-1 inline-block">
                {roleText}
              </span>
            </span>
          </div>

          {/* Subtext info */}
          <div className="flex flex-col gap-3 min-[400px]:gap-4 text-left w-full text-sm min-[400px]:text-base min-[650px]:text-lg text-text-secondary mb-8 font-sans">
            {activeSubtexts.map((sub, idx) => (
              <div key={idx} className="flex items-start gap-3 min-[400px]:gap-4">
                <span className="text-lg min-[400px]:text-xl select-none shrink-0 mt-0.5">{sub.emoji}</span>
                <p className="mt-0.5 leading-snug">{sub.text}</p>
              </div>
            ))}
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap gap-3 min-[400px]:gap-4 text-sm min-[400px]:text-base font-montserrat justify-center min-[1000px]:justify-start w-full">
            <a
              href="#projects"
              className="flex items-center justify-center gap-2 bg-[#0a0a0a] dark:bg-neutral-900 text-white border border-neutral-700/60 hover:border-brand-red/50 rounded-xl px-4 py-2 min-[400px]:px-5 min-[400px]:py-2.5 font-bold transition-all duration-300 shadow-md hover:shadow-[0_4px_20px_rgba(229,9,20,0.15)] hover:-translate-y-0.5 relative overflow-hidden group no-underline shrink-0"
              {...projectsBtnCursor}
            >
              <span className="relative z-10">Projects</span>
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white relative z-10"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>

            <button
              type="button"
              onClick={() => openPdfInNewTab(resumeHref)}
              className="flex items-center justify-center gap-2 bg-brand-red text-white border border-transparent rounded-xl px-4 py-2 min-[400px]:px-5 min-[400px]:py-2.5 font-bold transition-all duration-300 shadow-md hover:shadow-[0_4px_25px_rgba(229,9,20,0.3)] hover:-translate-y-0.5 relative overflow-hidden group cursor-pointer shrink-0"
              {...resumeCursor}
            >
              <span className="relative z-10">Resume</span>
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white relative z-10"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="15" y2="3"></line>
                <polyline points="7 10 12 15 17 10"></polyline>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              </svg>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </button>
          </div>
        </motion.div>

        {/* Profile Image Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-6 relative max-w-full"
        >
          {/* Main Avatar Container */}
          <div className="w-[200px] h-[200px] min-[340px]:w-[260px] min-[340px]:h-[260px] relative flex items-center justify-center group select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-red via-red-600 to-transparent animate-glow-spin p-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-red via-red-500 to-transparent animate-glow-spin p-[2px]" />

            <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full bg-bg-dark p-1.5 relative z-10 flex items-center justify-center">
              <img
                src={avatarSrc}
                alt={`${name} Profile`}
                className="w-full h-full rounded-full object-cover shadow-[0_4px_30px_rgba(0,0,0,0.35)] select-none pointer-events-none group-hover:scale-[1.01] transition-transform duration-300"
                loading="eager"
              />
            </div>

            {/* Orbiting Badges */}
            {orbitingBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                className={`absolute ${badge.class} z-30 w-[36px] h-[36px] min-[400px]:w-[48px] min-[400px]:h-[48px] rounded-full bg-card-dark border border-border-theme flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:border-brand-red/50 hover:shadow-[0_8px_25px_rgba(229,9,20,0.2)] transition-colors duration-300`}
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: badge.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: badge.delay,
                }}
              >
                <img
                  src={badge.icon}
                  alt={badge.name}
                  className="w-4 h-4 min-[400px]:w-6 min-[400px]:h-6 object-contain pointer-events-none theme-icon-invert"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-3 min-[400px]:gap-4 mt-4 min-[400px]:mt-6 z-20 flex-wrap justify-center">
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 min-[400px]:px-5 font-bold text-xs min-[400px]:text-base text-white bg-[#0a0a0a] dark:bg-neutral-900 border border-neutral-700/60 hover:border-brand-red/50 rounded-xl transition-all hover:scale-105 duration-300 shadow-md hover:shadow-[0_4px_15px_rgba(0,0,0,0.25)] relative overflow-hidden group"
              {...linkedinCursor}
            >
              <span className="relative z-10">LinkedIn</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>
            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 min-[400px]:px-5 font-bold text-xs min-[400px]:text-base text-white bg-[#0a0a0a] dark:bg-neutral-900 border border-neutral-700/60 hover:border-brand-red/50 rounded-xl transition-all hover:scale-105 duration-300 shadow-md hover:shadow-[0_4px_15px_rgba(0,0,0,0.25)] relative overflow-hidden group"
              {...githubCursor}
            >
              <span className="relative z-10">GitHub</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-out z-0" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
