import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";

/**
 * Hook for subscribing to and managing a Firestore collection in real-time.
 * @param {string} collectionName
 * @param {string} sortField - default is 'order'
 */
export function useFirestoreCollection(collectionName, sortField = "order") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!collectionName) return;

    setLoading(true);
    const colRef = collection(db, collectionName);
    const q = query(colRef, orderBy(sortField, "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error loading collection ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, sortField]);

  const addItem = async (newItem) => {
    try {
      const docId = newItem.id || `${collectionName}_${Date.now()}`;
      const itemRef = doc(db, collectionName, docId);
      const nextOrder = data.length > 0 ? Math.max(...data.map((i) => i.order || 0)) + 1 : 1;

      const payload = {
        ...newItem,
        id: docId,
        order: newItem.order ?? nextOrder,
        updatedAt: serverTimestamp(),
        updatedByUid: user?.uid || "admin",
        updatedByEmail: user?.email || "admin",
      };

      await setDoc(itemRef, payload);

      const statusRef = doc(db, "system", "status");
      await setDoc(statusRef, { lastDraftUpdatedAt: serverTimestamp() }, { merge: true });
      return docId;
    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      throw err;
    }
  };

  const updateItem = async (id, updatedFields) => {
    try {
      const itemRef = doc(db, collectionName, id);
      const payload = {
        ...updatedFields,
        updatedAt: serverTimestamp(),
        updatedByUid: user?.uid || "admin",
        updatedByEmail: user?.email || "admin",
      };

      await setDoc(itemRef, payload, { merge: true });

      const statusRef = doc(db, "system", "status");
      await setDoc(statusRef, { lastDraftUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error(`Error updating item ${id} in ${collectionName}:`, err);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      const itemRef = doc(db, collectionName, id);
      await deleteDoc(itemRef);

      const statusRef = doc(db, "system", "status");
      await setDoc(statusRef, { lastDraftUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error(`Error deleting item ${id} from ${collectionName}:`, err);
      throw err;
    }
  };

  const reorderItems = async (reorderedItems) => {
    try {
      const batch = writeBatch(db);
      reorderedItems.forEach((item, index) => {
        const itemRef = doc(db, collectionName, item.id);
        batch.update(itemRef, {
          order: index + 1,
          updatedAt: serverTimestamp(),
          updatedByEmail: user?.email || "admin",
        });
      });

      const statusRef = doc(db, "system", "status");
      batch.set(statusRef, { lastDraftUpdatedAt: serverTimestamp() }, { merge: true });

      await batch.commit();
    } catch (err) {
      console.error(`Error reordering items in ${collectionName}:`, err);
      throw err;
    }
  };

  return { data, loading, error, addItem, updateItem, deleteItem, reorderItems };
}
