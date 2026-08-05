import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Initializes and returns singleton Firebase Admin instance.
 */
export function getFirebaseAdmin() {
  if (getApps().length === 0) {
    let credentials;

    // 1. Try full JSON service account string
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        let rawStr = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        // If base64 encoded string
        if (!rawStr.startsWith("{") && rawStr.length > 20) {
          try {
            rawStr = Buffer.from(rawStr, "base64").toString("utf8");
          } catch (e) {}
        }
        const parsed = JSON.parse(rawStr);
        if (parsed.private_key && typeof parsed.private_key === "string") {
          parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        credentials = cert(parsed);
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err);
      }
    }

    // 2. Try individual environment variables if service account string isn't present
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!credentials && projectId && clientEmail && privateKey) {
      credentials = cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      });
    }

    // 3. Initialize Firebase Admin app safely
    if (credentials) {
      initializeApp({ credential: credentials });
    } else if (projectId) {
      initializeApp({ projectId });
    } else {
      initializeApp();
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}
