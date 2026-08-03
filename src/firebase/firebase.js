import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Initiates Google Sign-In with popup.
 * Prints UID and Email to console upon success for initial setup.
 * @returns {Promise<import("firebase/auth").User>}
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
    }
    return user;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
}

/**
 * Logs out current user session.
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

/**
 * Validates if given user's email matches configured VITE_ADMIN_EMAIL.
 * No frontend UID checks are performed. Security is enforced by Firestore Security Rules.
 * Supports comma-separated emails if multiple admin emails are configured.
 * @param {import("firebase/auth").User | null} user
 * @returns {boolean}
 */
export function isAdmin(user) {
  const adminEmailConfig = import.meta.env.VITE_ADMIN_EMAIL;

  if (!user || !user.email || !adminEmailConfig) {
    return false;
  }

  const allowedEmails = adminEmailConfig
    .split(",")
    .map((email) => email.trim().toLowerCase());

  return allowedEmails.includes(user.email.trim().toLowerCase());
}