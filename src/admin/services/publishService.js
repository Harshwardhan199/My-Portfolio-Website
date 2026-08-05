import { apiClient } from "../../api/apiClient";

/**
 * Invokes the serverless API endpoint to publish a single section.
 * @param {string} sectionName
 * @param {object} [user] - User object (unused directly, authentication token is handled by apiClient)
 * @returns {Promise<object>}
 */
export async function publishSection(sectionName, user) {
  return await apiClient.post("/.netlify/functions/publish", { sectionName });
}

/**
 * Invokes the serverless API endpoint to publish all draft sections.
 * @param {object} [user]
 * @returns {Promise<object>}
 */
export async function publishAll(user) {
  return await apiClient.post("/.netlify/functions/publish", { sectionName: "all" });
}
