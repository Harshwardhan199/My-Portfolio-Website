import { auth } from "../firebase/firebase";

/**
 * Retrieves current authenticated user's Firebase ID Token.
 * @param {boolean} forceRefresh - Whether to force token refresh.
 * @returns {Promise<string|null>}
 */
export async function getAuthToken(forceRefresh = false) {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken(forceRefresh);
  } catch (err) {
    console.error("Error obtaining Firebase ID token:", err);
    return null;
  }
}

/**
 * Low-level request wrapper for calling API endpoints.
 * @param {string} endpoint - API route (e.g. "/api/admin/publish")
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @returns {Promise<any>} Response JSON data
 */
export async function request(endpoint, options = {}) {
  const token = await getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(endpoint, config);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok || data?.success === false) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = data?.code || "API_ERROR";
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body = {}, options = {}) =>
    request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body = {}, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  del: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
