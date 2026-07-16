import sageAiImg from "../assets/images/SageAI.png";
import portfolioImg from "../assets/images/Portfolio-Website.png";
import brandSightImg from "../assets/images/BrandSight.png";
import foodiesImg from "../assets/images/foodies.png";
import threatVistaImg from "../assets/images/Threat-Vista.png";

export const projectsData = [
  {
    id: 1,
    title: "National Cyber Threat Intelligence Hub",
    description: "A centralized platform designed to monitor, aggregate, and analyze real-time cyber threats. Features ingestion of feed intelligence, indicators of compromise (IoC) visualization, and collaborative threat response frameworks.",
    technologies: ["React", "Node.js", "Django", "Kafka", "Kubernetes", "Docker"],
    github: "https://github.com/ktyangden/National-Cyber-Threat-Intelligence-Hub",
    demo: "",
    image: threatVistaImg
  },
  {
    id: 2,
    title: "Sage AI",
    description: "This is a MERN stack chatbot platform project with some additional features like Chats history organized in folder, reusable prompts and interactive quizzes.",
    technologies: ["React", "Node.js", "FastAPI", "Redis", "MongoDB", "LLM"],
    github: "https://github.com/Harshwardhan199/SageAI",
    demo: "https://sage-ai-chatbot.vercel.app/",
    image: sageAiImg
  },
  {
    id: 3,
    title: "BrandSight",
    description: "This is a team project where we built a Brand Analyzer website which takes reviews from different sources (PlayStore, Maps) and analyzes them using our NLP API and gives suggestions to improve their service.",
    technologies: ["React", "Node.js", "MongoDB", "NLP"],
    github: "https://github.com/rakshitsawarn/brandsight",
    demo: "",
    image: brandSightImg
  },
  // {
  //   id: 4,
  //   title: "Foodies",
  //   description: "This is a team project where we built an android app where users can search recipes that can be made based on direct recipe name or ingredients on hand to minimize unused ingredients wastage.",
  //   technologies: ["Kotlin", "XML", "Node.js", "MongoDB"],
  //   github: "",
  //   demo: "",
  //   image: foodiesImg
  // },
  // {
  //   id: 5,
  //   title: "Portfolio Website",
  //   description: "This is my personal project where I have built a responsive website for my portfolio to showcase my skill and projects. This website is built using HTML, CSS and JavaScript.",
  //   technologies: ["HTML5", "CSS3"],
  //   github: "https://github.com/Harshwardhan199/My-Portfolio-Website",
  //   demo: "https://harshwardhansaini.netlify.app",
  //   image: portfolioImg
  // }
];
