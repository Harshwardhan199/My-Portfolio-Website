/**
 * Verifies that the decoded token's email belongs to an authorized administrator.
 * Uses server-only environment variable FIREBASE_ADMIN_EMAIL.
 * @param {import("firebase-admin/auth").DecodedIdToken} decodedToken
 * @returns {boolean}
 */
export function requireAdmin(decodedToken) {
  const adminEmailConfig = process.env.FIREBASE_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

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
