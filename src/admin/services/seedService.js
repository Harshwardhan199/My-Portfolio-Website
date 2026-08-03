import {
  doc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { experienceData } from "../../data/experience";
import { projectsData } from "../../data/projects";
import { skillsData } from "../../data/skills";
import { publishAll } from "./publishService";

/**
 * Checks whether Firestore has been initialized with portfolio data.
 */
export async function isFirestoreInitialized() {
  try {
    const statusSnap = await getDoc(doc(db, "system", "status"));
    if (statusSnap.exists() && statusSnap.data()?.isInitialized) {
      return true;
    }
    // Check if any draft projects exist
    const draftProjectsSnap = await getDocs(collection(db, "draft_projects"));
    return !draftProjectsSnap.empty;
  } catch (err) {
    console.error("Error checking initialization status:", err);
    return false;
  }
}

/**
 * Seeds initial portfolio data into Firestore draft collections and publishes immediately.
 */
export async function seedInitialData(user) {
  const batch = writeBatch(db);
  const metadata = {
    updatedAt: serverTimestamp(),
    updatedByUid: user?.uid || "system",
    updatedByEmail: user?.email || "system",
  };

  // 1. Seed Shared Icons & Skills
  const iconMap = new Map();
  let iconCounter = 1;

  const initialSkills = skillsData.map((cat, catIdx) => {
    const catId = `cat_${catIdx + 1}`;
    const items = cat.items.map((item, itemIdx) => {
      let iconId = item.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      if (!iconMap.has(iconId)) {
        iconMap.set(iconId, {
          id: iconId,
          name: item.name,
          category: cat.category,
          url: item.icon || "",
          svgCode: "",
          keywords: [item.name, cat.category, item.description || ""].join(", "),
        });
      }
      return {
        id: `skill_${catIdx + 1}_${itemIdx + 1}`,
        name: item.name,
        description: item.description || "",
        iconId,
        order: itemIdx + 1,
      };
    });

    return {
      id: catId,
      category: cat.category,
      order: catIdx + 1,
      items,
    };
  });

  // Write icons to single icons/ collection
  iconMap.forEach((iconObj, iconId) => {
    const iconRef = doc(db, "icons", iconId);
    batch.set(iconRef, { ...iconObj, ...metadata });
  });

  // Write skills to draft_skills/
  initialSkills.forEach((cat) => {
    const catRef = doc(db, "draft_skills", cat.id);
    batch.set(catRef, { ...cat, ...metadata });
  });

  // 2. Seed Projects to draft_projects/
  projectsData.forEach((proj, idx) => {
    const projId = `proj_${proj.id || idx + 1}`;
    const projRef = doc(db, "draft_projects", projId);
    batch.set(projRef, {
      id: projId,
      title: proj.title || "",
      description: proj.description || "",
      image: typeof proj.image === "string" ? proj.image : "",
      github: proj.github || "",
      demo: proj.demo || "",
      technologies: proj.technologies || [],
      featured: idx < 3,
      isTeam: proj.title?.toLowerCase().includes("team") || false,
      order: idx + 1,
      ...metadata,
    });
  });

  // 3. Seed Experience to draft_experience/
  experienceData.forEach((exp, idx) => {
    const expId = `exp_${idx + 1}`;
    const expRef = doc(db, "draft_experience", expId);
    batch.set(expRef, {
      id: expId,
      role: exp.role || "",
      company: exp.company || "",
      duration: exp.duration || "",
      responsibilities: exp.responsibilities || [],
      technologies: exp.technologies || [],
      order: idx + 1,
      ...metadata,
    });
  });

  // 4. Seed Hero to draft_portfolio/hero
  const heroRef = doc(db, "draft_portfolio", "hero");
  batch.set(heroRef, {
    name: "Harshwardhan Saini",
    roles: [
      "Software Engineer",
      "Backend Developer",
      "AI Engineer",
      "Cloud Enthusiast",
      "Full Stack Developer",
    ],
    subtexts: [
      { emoji: "💻", text: "I'm a Software Developer passionate about building robust backend architectures and AI-driven solutions." },
      { emoji: "🎓", text: "Currently pursuing Computer Science at NIIT University, focusing on scalable distributed systems." },
      { emoji: "🛠️", text: "Experienced in designing microservices, orchestrating clouds, and building multi-agent AI ecosystems." },
    ],
    profileImage: "",
    resumeUrl: "",
    github: "https://github.com/Harshwardhan199",
    linkedin: "https://www.linkedin.com/in/harshwardhan-saini-ab65a4279/",
    ...metadata,
  });

  // 5. Seed About to draft_portfolio/about
  const aboutRef = doc(db, "draft_portfolio", "about");
  batch.set(aboutRef, {
    cards: [
      {
        id: "about_1",
        emoji: "🎓",
        title: "Education",
        description: "Pursuing a Bachelor of Technology in Computer Science at NIIT University. I specialize in backend architectures, system design, and intelligence integration.",
        order: 1,
      },
      {
        id: "about_2",
        emoji: "💻",
        title: "My Focus",
        description: "I am highly focused on building full-stack applications, designing microservices, and crafting multi-agent AI ecosystems that solve concrete business challenges.",
        order: 2,
      },
      {
        id: "about_3",
        emoji: "🛠️",
        title: "Philosophy",
        description: "I believe in clean, reusable code, rigorous automation, and continuous optimization. Turning complex challenges into simple, maintainable software is my ultimate goal.",
        order: 3,
      },
    ],
    ...metadata,
  });

  // 6. Seed Contact to draft_portfolio/contact
  const contactRef = doc(db, "draft_portfolio", "contact");
  batch.set(contactRef, {
    email: "harshwardhansaini@gmail.com",
    phone: "",
    location: "India",
    formEnabled: true,
    ...metadata,
  });

  // 7. Seed Socials to draft_portfolio/socials
  const socialsRef = doc(db, "draft_portfolio", "socials");
  batch.set(socialsRef, {
    items: [
      { id: "soc_1", platform: "GitHub", url: "https://github.com/Harshwardhan199", iconId: "github", order: 1 },
      { id: "soc_2", platform: "LinkedIn", url: "https://www.linkedin.com/in/harshwardhan-saini-ab65a4279/", iconId: "linkedin", order: 2 },
    ],
    ...metadata,
  });

  // 8. Seed SEO to draft_portfolio/seo
  const seoRef = doc(db, "draft_portfolio", "seo");
  batch.set(seoRef, {
    title: "Harshwardhan Saini | Portfolio",
    description: "Software Developer specializing in backend engineering, distributed systems, and AI agents.",
    keywords: "Harshwardhan Saini, Software Engineer, React, Node.js, AI, Full Stack, Portfolio",
    ogImage: "",
    ...metadata,
  });

  // Write status flag
  const statusRef = doc(db, "system", "status");
  batch.set(statusRef, {
    isInitialized: true,
    lastDraftUpdatedAt: serverTimestamp(),
    updatedByEmail: user?.email || "system",
  });

  await batch.commit();

  // Automatically publish all draft data to live collections
  await publishAll(user);
}
