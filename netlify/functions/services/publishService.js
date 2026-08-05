import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "../shared/firebase.js";

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

export const ALLOWED_SECTIONS = Object.keys(SECTION_MAP);

/**
 * Publishes a single section atomically from draft to published collection using Firebase Admin SDK.
 * @param {string} sectionName
 * @param {object} user - Decoded ID token containing uid & email
 */
export async function publishSection(sectionName, user) {
  const mapping = SECTION_MAP[sectionName];
  if (!mapping) {
    throw new Error(`Invalid section name: ${sectionName}`);
  }

  const { db } = getFirebaseAdmin();
  const batch = db.batch();
  const metadata = {
    updatedAt: FieldValue.serverTimestamp(),
    updatedByUid: user?.uid || "admin",
    updatedByEmail: user?.email || "admin",
  };

  if (mapping.type === "doc") {
    const draftDocRef = db.collection(mapping.draftPath[0]).doc(mapping.draftPath[1]);
    const pubDocRef = db.collection(mapping.pubPath[0]).doc(mapping.pubPath[1]);
    const snap = await draftDocRef.get();

    if (snap.exists) {
      batch.set(pubDocRef, { ...snap.data(), ...metadata });
    }
  } else {
    const draftSnap = await db.collection(mapping.draftPath).get();
    const pubSnap = await db.collection(mapping.pubPath).get();

    // Delete current published docs
    pubSnap.docs.forEach((d) => batch.delete(d.ref));

    // Copy draft docs to published collection
    draftSnap.docs.forEach((d) => {
      const targetRef = db.collection(mapping.pubPath).doc(d.id);
      batch.set(targetRef, { ...d.data(), ...metadata });
    });
  }

  // Update system status document
  const statusRef = db.collection("system").doc("status");
  batch.set(
    statusRef,
    {
      lastPublishedAt: FieldValue.serverTimestamp(),
      lastPublishedSection: sectionName,
      updatedByEmail: user?.email || "admin",
    },
    { merge: true }
  );

  await batch.commit();
}

/**
 * Atomically publishes all CMS draft sections to published collections.
 * @param {object} user - Decoded ID token
 */
export async function publishAll(user) {
  const sections = Object.keys(SECTION_MAP);
  for (const section of sections) {
    await publishSection(section, user);
  }

  const { db } = getFirebaseAdmin();
  const statusRef = db.collection("system").doc("status");
  const batch = db.batch();
  batch.set(
    statusRef,
    {
      lastPublishedAt: FieldValue.serverTimestamp(),
      lastPublishedSection: "all",
      isInitialized: true,
      updatedByEmail: user?.email || "admin",
    },
    { merge: true }
  );
  await batch.commit();
}
