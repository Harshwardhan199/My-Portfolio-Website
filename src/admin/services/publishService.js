import {
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

// Section to collection mapping
const SECTION_MAP = {
  hero: { type: "doc", draftPath: ["draft_portfolio", "hero"], pubPath: ["portfolio", "hero"] },
  about: { type: "doc", draftPath: ["draft_portfolio", "about"], pubPath: ["portfolio", "about"] },
  contact: { type: "doc", draftPath: ["draft_portfolio", "contact"], pubPath: ["portfolio", "contact"] },
  socials: { type: "doc", draftPath: ["draft_portfolio", "socials"], pubPath: ["portfolio", "socials"] },
  seo: { type: "doc", draftPath: ["draft_portfolio", "seo"], pubPath: ["portfolio", "seo"] },
  projects: { type: "collection", draftPath: "draft_projects", pubPath: "projects" },
  skills: { type: "collection", draftPath: "draft_skills", pubPath: "skills" },
  experience: { type: "collection", draftPath: "draft_experience", pubPath: "experience" },
  education: { type: "collection", draftPath: "draft_education", pubPath: "education" },
  certifications: { type: "collection", draftPath: "draft_certifications", pubPath: "certifications" },
  achievements: { type: "collection", draftPath: "draft_achievements", pubPath: "achievements" },
};

/**
 * Publishes a single section atomically from draft to published collection.
 */
export async function publishSection(sectionName, user) {
  const mapping = SECTION_MAP[sectionName];
  if (!mapping) {
    throw new Error(`Unknown section: ${sectionName}`);
  }

  const batch = writeBatch(db);
  const metadata = {
    updatedAt: serverTimestamp(),
    updatedByUid: user?.uid || "admin",
    updatedByEmail: user?.email || "admin",
  };

  if (mapping.type === "doc") {
    const draftDocRef = doc(db, mapping.draftPath[0], mapping.draftPath[1]);
    const pubDocRef = doc(db, mapping.pubPath[0], mapping.pubPath[1]);
    const snap = await getDoc(draftDocRef);

    if (snap.exists()) {
      batch.set(pubDocRef, { ...snap.data(), ...metadata });
    }
  } else {
    // Collection publishing: clear existing published collection and copy draft documents
    const draftSnap = await getDocs(collection(db, mapping.draftPath));
    const pubSnap = await getDocs(collection(db, mapping.pubPath));

    // Delete current published docs
    pubSnap.docs.forEach((d) => batch.delete(d.ref));

    // Copy draft docs
    draftSnap.docs.forEach((d) => {
      const targetRef = doc(db, mapping.pubPath, d.id);
      batch.set(targetRef, { ...d.data(), ...metadata });
    });
  }

  // Update system status
  const statusRef = doc(db, "system", "status");
  batch.set(
    statusRef,
    {
      lastPublishedAt: serverTimestamp(),
      lastPublishedSection: sectionName,
      updatedByEmail: user?.email || "admin",
    },
    { merge: true }
  );

  await batch.commit();
}

/**
 * Atomically publishes all CMS draft sections to published collections.
 */
export async function publishAll(user) {
  const sections = Object.keys(SECTION_MAP);
  for (const section of sections) {
    await publishSection(section, user);
  }

  const statusRef = doc(db, "system", "status");
  const batch = writeBatch(db);
  batch.set(
    statusRef,
    {
      lastPublishedAt: serverTimestamp(),
      lastPublishedSection: "all",
      isInitialized: true,
      updatedByEmail: user?.email || "admin",
    },
    { merge: true }
  );
  await batch.commit();
}
