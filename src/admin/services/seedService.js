import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { apiClient } from "../../api/apiClient";

/**
 * Checks whether Firestore has been initialized with portfolio data.
 * Non-privileged client-side read operation.
 * @returns {Promise<boolean>}
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
 * Invokes the serverless API endpoint to seed initial data and publish.
 * @param {object} [user] - User object (authentication token is handled by apiClient)
 * @returns {Promise<object>}
 */
export async function seedInitialData(user) {
  return await apiClient.post("/api/admin/seed");
}
