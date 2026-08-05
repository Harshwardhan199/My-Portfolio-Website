import { useState, useEffect } from "react";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { experienceData } from "../data/experience";
import { projectsData } from "../data/projects";
import { skillsData } from "../data/skills";

/**
 * Custom hook to load portfolio section data from published collections (default)
 * or draft collections (when isPreview is true). Fallbacks to local data if Firestore is unpopulated.
 */
export function usePortfolioData(isPreview = false) {
  const prefix = isPreview ? "draft_" : "";
  const portfolioCol = isPreview ? "draft_portfolio" : "portfolio";

  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [contact, setContact] = useState(null);
  const [socials, setSocials] = useState(null);
  const [seo, setSeo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe to Hero
    const unsubHero = onSnapshot(doc(db, portfolioCol, "hero"), (snap) => {
      if (snap.exists()) setHero(snap.data());
    });

    // 2. Subscribe to About
    const unsubAbout = onSnapshot(doc(db, portfolioCol, "about"), (snap) => {
      if (snap.exists()) setAbout(snap.data());
    });

    // 3. Subscribe to Contact
    const unsubContact = onSnapshot(doc(db, portfolioCol, "contact"), (snap) => {
      if (snap.exists()) setContact(snap.data());
    });

    // 4. Subscribe to Socials
    const unsubSocials = onSnapshot(doc(db, portfolioCol, "socials"), (snap) => {
      if (snap.exists()) setSocials(snap.data());
    });

    // 5. Subscribe to SEO
    const unsubSeo = onSnapshot(doc(db, portfolioCol, "seo"), (snap) => {
      if (snap.exists()) setSeo(snap.data());
    });

    // 6. Subscribe to Projects
    const qProjects = query(collection(db, `${prefix}projects`), orderBy("order", "asc"));
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setProjects(projectsData);
      }
    });

    // 7. Subscribe to Skills
    const qSkills = query(collection(db, `${prefix}skills`), orderBy("order", "asc"));
    const unsubSkills = onSnapshot(qSkills, (snap) => {
      if (!snap.empty) {
        setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setSkills(skillsData);
      }
    });

    // 8. Subscribe to Experience
    const qExp = query(collection(db, `${prefix}experience`), orderBy("order", "asc"));
    const unsubExp = onSnapshot(qExp, (snap) => {
      if (!snap.empty) {
        setExperience(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setExperience(experienceData);
      }
    });

    // 9. Subscribe to Shared Icons
    const qIcons = query(collection(db, "icons"));
    const unsubIcons = onSnapshot(qIcons, (snap) => {
      if (!snap.empty) {
        setIcons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    });

    return () => {
      unsubHero();
      unsubAbout();
      unsubContact();
      unsubSocials();
      unsubSeo();
      unsubProjects();
      unsubSkills();
      unsubExp();
      unsubIcons();
    };
  }, [portfolioCol, prefix]);

  return {
    hero,
    about,
    contact,
    socials,
    seo,
    projects,
    skills,
    experience,
    icons,
    loading,
    isPreview,
  };
}
