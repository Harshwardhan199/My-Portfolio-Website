import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "../utils/firebaseAdmin.js";
import { publishAll } from "./publishService.js";

const skillsData = [
  {
    category: "Programming",
    items: [
      { name: "JavaScript", description: "Dynamic Web Scripting", icon: "https://img.icons8.com/?size=100&id=39854&format=png&color=ff0000" },
      { name: "Python", description: "Scripting & ML", icon: "https://img.icons8.com/?size=100&id=12592&format=png&color=ff0000" },
      { name: "TypeScript", description: "Typed JavaScript", icon: "https://img.icons8.com/?size=100&id=cHBUT9SmrD2V&format=png&color=ff0000" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "HTML", description: "Web Markup", icon: "https://img.icons8.com/?size=100&id=23028&format=png&color=ff0000" },
      { name: "CSS", description: "Web Styling", icon: "https://img.icons8.com/?size=100&id=38272&format=png&color=ff0000" },
      { name: "React", description: "Component-Based UI", icon: "https://img.icons8.com/?size=100&id=w4RSxcrpwrzy&format=png&color=ff0000" },
      { name: "Next.js", description: "SSR React Framework", icon: "https://img.icons8.com/?size=100&id=gwR0hbBi5JeZ&format=png&color=ff0000" },
      { name: "TailwindCSS", description: "Utility-First Styling", icon: "https://img.icons8.com/?size=100&id=UpSCHTwpywad&format=png&color=ff0000" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", description: "Server Runtime", icon: "https://img.icons8.com/?size=100&id=t9oCxEN7McHZ&format=png&color=ff0000" },
      { name: "Express", description: "Micro-framework", icon: "https://img.icons8.com/?size=100&id=XIkDynN7Uo6f&format=png&color=ff0000" },
      { name: "Django", description: "Robust Python Backend", icon: "https://img.icons8.com/?size=100&id=37o3DqV429ra&format=png&color=ff0000" },
      { name: "Flask", description: "Micro Web Server", icon: "https://img.icons8.com/?size=100&id=AqYCfGyGXlO7&format=png&color=ff0000" },
      { name: "FastAPI", description: "High-Performance APIs", icon: "https://img.icons8.com/?size=100&id=122187&format=png&color=ff0000" },
    ],
  },
  {
    category: "AI & Agents",
    items: [
      { name: "LLM APIs", description: "Model Integration", icon: "https://img.icons8.com/?size=100&id=Q48f9JPNPu0E&format=png&color=ff0000" },
      { name: "Dialogflow CX & ADK", description: "Conversational Agents", icon: "https://img.icons8.com/?size=100&id=37628&format=png&color=ff0000" },
      { name: "MCP", description: "Model Context Protocol", icon: "https://img.icons8.com/?size=100&id=rfIn8nl8UUXz&format=png&color=ff0000" },
      { name: "Prompt Engineering", description: "Context Optimization", icon: "https://img.icons8.com/?size=100&id=8420&format=png&color=ff0000" },
      { name: "Agent Development", description: "Autonomous Workflows", icon: "https://img.icons8.com/?size=100&id=xT8d0Ap2E9Yt&format=png&color=ff0000" },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "AWS", description: "Cloud Hosting & Services", icon: "https://img.icons8.com/?size=100&id=AtEKkdldZfri&format=png&color=ff0000" },
      { name: "GCP", description: "Google Cloud Platform", icon: "https://img.icons8.com/?size=100&id=20773&format=png&color=ff0000" },
      { name: "Docker", description: "Containerization", icon: "https://img.icons8.com/?size=100&id=ckyutUQGU0PM&format=png&color=ff0000" },
      { name: "Kubernetes", description: "Orchestration", icon: "https://img.icons8.com/?size=100&id=1hFR28gNL9Hy&format=png&color=ff0000" },
      { name: "Terraform", description: "Infrastructure as Code", icon: "https://img.icons8.com/?size=100&id=F2ZeQQjwdIJp&format=png&color=ff0000" },
      { name: "Jenkins & CI/CD", description: "Automation Server", icon: "https://img.icons8.com/?size=100&id=41129&format=png&color=ff0000" },
    ],
  },
  {
    category: "Databases & Architecture",
    items: [
      { name: "MySQL", description: "Relational Storage", icon: "https://img.icons8.com/?size=100&id=39858&format=png&color=ff0000" },
      { name: "MongoDB", description: "Document Store", icon: "https://img.icons8.com/?size=100&id=Y9VdL7V5XPIc&format=png&color=ff0000" },
      { name: "Redis", description: "In-Memory Cache", icon: "https://img.icons8.com/?size=100&id=dmAy2s25QyTr&format=png&color=ff0000" },
      { name: "Kafka", description: "Event Streaming", icon: "https://img.icons8.com/?size=100&id=GcoBILXGLwFD&format=png&color=ff0000" },
      { name: "Microservices", description: "Distributed Systems", icon: "https://img.icons8.com/?size=100&id=k3W8eBXojTKY&format=png&color=ff0000" },
    ],
  },
];

const projectsData = [
  {
    id: 1,
    title: "National Cyber Threat Intelligence Hub",
    description: "A centralized platform designed to monitor, aggregate, and analyze real-time cyber threats. Features ingestion of feed intelligence, indicators of compromise (IoC) visualization, and collaborative threat response frameworks.",
    technologies: ["React", "Node.js", "Django", "Kafka", "Kubernetes", "Docker"],
    github: "https://github.com/ktyangden/National-Cyber-Threat-Intelligence-Hub",
    demo: "",
    image: "",
  },
  {
    id: 2,
    title: "Sage AI",
    description: "This is a MERN stack chatbot platform project with some additional features like Chats history organized in folder, reusable prompts and interactive quizzes.",
    technologies: ["React", "Node.js", "FastAPI", "Redis", "MongoDB", "LLM"],
    github: "https://github.com/Harshwardhan199/SageAI",
    demo: "https://sage-ai-chatbot.vercel.app/",
    image: "",
  },
  {
    id: 3,
    title: "BrandSight",
    description: "This is a team project where we built a Brand Analyzer website which takes reviews from different sources (PlayStore, Maps) and analyzes them using our NLP API and gives suggestions to improve their service.",
    technologies: ["React", "Node.js", "MongoDB", "NLP"],
    github: "https://github.com/rakshitsawarn/brandsight",
    demo: "",
    image: "",
  },
];

const experienceData = [
  {
    role: "DT Intern",
    company: "GE Appliances (Haier)",
    duration: "Jan 2026 – June 2026",
    responsibilities: [
      "Built AI conversational agents using ADK and Dialogflow CX for manufacturing data.",
      "Developed backend APIs, cloud infrastructure, CI/CD pipelines and multi-agent orchestration.",
      "Worked across Angular frontend, Agent Engine, MCP, Cloud Run, AWS Lambda and Google Cloud Functions.",
      "Built reusable Angular components for internal AI agent UI.",
      "Developed MCP-based natural language interface for BigQuery.",
      "Built foundations for autonomous AI workflows including Cypress test generation.",
      "Automated deployments using Terraform, Jenkins and GitHub Actions.",
    ],
  },
];

/**
 * Seeds initial portfolio data into Firestore draft collections and publishes immediately using Admin SDK.
 * @param {object} user - Decoded ID token
 */
export async function seedInitialData(user) {
  const { db } = getFirebaseAdmin();
  const batch = db.batch();
  const metadata = {
    updatedAt: FieldValue.serverTimestamp(),
    updatedByUid: user?.uid || "system",
    updatedByEmail: user?.email || "system",
  };

  // 1. Seed Shared Icons & Skills
  const iconMap = new Map();

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
    const iconRef = db.collection("icons").doc(iconId);
    batch.set(iconRef, { ...iconObj, ...metadata });
  });

  // Write skills to draft_skills/
  initialSkills.forEach((cat) => {
    const catRef = db.collection("draft_skills").doc(cat.id);
    batch.set(catRef, { ...cat, ...metadata });
  });

  // 2. Seed Projects to draft_projects/
  projectsData.forEach((proj, idx) => {
    const projId = `proj_${proj.id || idx + 1}`;
    const projRef = db.collection("draft_projects").doc(projId);
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
    const expRef = db.collection("draft_experience").doc(expId);
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
  const heroRef = db.collection("draft_portfolio").doc("hero");
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
  const aboutRef = db.collection("draft_portfolio").doc("about");
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
  const contactRef = db.collection("draft_portfolio").doc("contact");
  batch.set(contactRef, {
    email: "harshwardhansaini@gmail.com",
    phone: "",
    location: "India",
    formEnabled: true,
    ...metadata,
  });

  // 7. Seed Socials to draft_portfolio/socials
  const socialsRef = db.collection("draft_portfolio").doc("socials");
  batch.set(socialsRef, {
    items: [
      { id: "soc_1", platform: "GitHub", url: "https://github.com/Harshwardhan199", iconId: "github", order: 1 },
      { id: "soc_2", platform: "LinkedIn", url: "https://www.linkedin.com/in/harshwardhan-saini-ab65a4279/", iconId: "linkedin", order: 2 },
    ],
    ...metadata,
  });

  // 8. Seed SEO to draft_portfolio/seo
  const seoRef = db.collection("draft_portfolio").doc("seo");
  batch.set(seoRef, {
    title: "Harshwardhan Saini | Portfolio",
    description: "Software Developer specializing in backend engineering, distributed systems, and AI agents.",
    keywords: "Harshwardhan Saini, Software Engineer, React, Node.js, AI, Full Stack, Portfolio",
    ogImage: "",
    ...metadata,
  });

  // Write status flag
  const statusRef = db.collection("system").doc("status");
  batch.set(statusRef, {
    isInitialized: true,
    lastDraftUpdatedAt: FieldValue.serverTimestamp(),
    updatedByEmail: user?.email || "system",
  });

  await batch.commit();

  // Automatically publish all draft data to live collections
  await publishAll(user);
}
