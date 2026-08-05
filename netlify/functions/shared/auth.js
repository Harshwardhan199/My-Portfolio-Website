import { getFirebaseAdmin } from "./firebase.js";

/**
 * Extracts and verifies Firebase ID token from HTTP Authorization header.
 * @param {object} event - Netlify function event or Request object
 * @returns {Promise<import("firebase-admin/auth").DecodedIdToken>}
 */
export async function verifyToken(event) {
  let authHeader = null;

  if (event.headers) {
    if (typeof event.headers.get === "function") {
      authHeader = event.headers.get("authorization") || event.headers.get("Authorization");
    } else {
      authHeader = event.headers.authorization || event.headers.Authorization || event.headers.AUTHORIZATION;
    }
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("Missing or malformed Authorization header");
    err.statusCode = 401;
    err.code = "UNAUTHORIZED";
    throw err;
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    const err = new Error("Bearer token is empty");
    err.statusCode = 401;
    err.code = "UNAUTHORIZED";
    throw err;
  }

  try {
    const { auth } = getFirebaseAdmin();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    const err = new Error("Invalid or expired Firebase authentication token");
    err.statusCode = 401;
    err.code = "UNAUTHORIZED";
    err.originalError = error;
    throw err;
  }
}

/**
 * Verifies that the decoded token's email belongs to an authorized administrator.
 * Uses server-side environment variables (FIREBASE_ADMIN_EMAIL, ADMIN_EMAIL, VITE_ADMIN_EMAIL).
 * @param {import("firebase-admin/auth").DecodedIdToken} decodedToken
 * @returns {boolean}
 */
export function requireAdmin(decodedToken) {
  const adminEmailConfig =
    process.env.FIREBASE_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.VITE_ADMIN_EMAIL;

  if (!decodedToken || !decodedToken.email || !adminEmailConfig) {
    const err = new Error("Forbidden: Administrator privileges required");
    err.statusCode = 403;
    err.code = "FORBIDDEN";
    throw err;
  }

  const allowedEmails = adminEmailConfig
    .split(",")
    .map((email) => email.trim().toLowerCase());

  const userEmail = decodedToken.email.trim().toLowerCase();

  if (!allowedEmails.includes(userEmail)) {
    const err = new Error("Forbidden: User email is not authorized for administrative access");
    err.statusCode = 403;
    err.code = "FORBIDDEN";
    throw err;
  }

  return true;
}
