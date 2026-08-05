import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";

/**
 * Hook for subscribing to and updating a single Firestore document in real-time.
 * @param {string} collectionName
 * @param {string} docId
 */
export function useFirestoreDoc(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!collectionName || !docId) return;

    setLoading(true);
    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data());
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error loading doc ${collectionName}/${docId}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  const saveDoc = async (newData) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const payload = {
        ...newData,
        updatedAt: serverTimestamp(),
        updatedByUid: user?.uid || "admin",
        updatedByEmail: user?.email || "admin",
      };
      await setDoc(docRef, payload, { merge: true });

      // Update last draft update status
      const statusRef = doc(db, "system", "status");
      await setDoc(statusRef, { lastDraftUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error(`Error saving doc ${collectionName}/${docId}:`, err);
      throw err;
    }
  };

  return { data, loading, error, saveDoc };
}
