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
        credentials = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err);
      }
    }

    // 2. Try individual environment variables if service account string isn't present
    if (!credentials && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      credentials = cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    }

    // Initialize Firebase Admin app
    if (credentials) {
      initializeApp({ credential: credentials });
    } else {
      // Fallback: Default initialization (e.g. GCP Application Default Credentials)
      initializeApp();
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}
