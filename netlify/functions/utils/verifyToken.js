import { getFirebaseAdmin } from "./firebaseAdmin.js";

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
