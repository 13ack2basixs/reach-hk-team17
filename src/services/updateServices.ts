import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Update {
  id?: string;
  type: "Program Update" | "Student Achievement" | "Milestone Reached";
  description: string;
  createdAt: Timestamp;
}

const UPDATES_COLLECTION = "update";

export const updatesService = {
  // Add new update
  async addUpdate(update: Omit<Update, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, UPDATES_COLLECTION), {
        ...update,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding update:", error);
      throw error;
    }
  },

  // Get all updates
  async getUpdates(): Promise<Update[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, UPDATES_COLLECTION), orderBy("createdAt", "desc"))
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          description: data.description || "",
          createdAt: data.createdAt,
        } as Update;
      });
    } catch (error) {
      console.error("Error fetching updates:", error);
      throw error;
    }
  },

  // Update an update
  async updateUpdate(
    updateId: string,
    updates: Partial<Update>
  ): Promise<void> {
    try {
      const updateRef = doc(db, UPDATES_COLLECTION, updateId);
      await updateDoc(updateRef, updates);
    } catch (error) {
      console.error("Error updating update:", error);
      throw error;
    }
  },

  // Delete update
  async deleteUpdate(updateId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, UPDATES_COLLECTION, updateId));
    } catch (error) {
      console.error("Error deleting update:", error);
      throw error;
    }
  },

  // Real-time listener for updates
  subscribeToUpdates(callback: (updates: Update[]) => void) {
    const q = query(
      collection(db, UPDATES_COLLECTION),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(
      q,
      (querySnapshot) => {
        const updates = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type,
            description: data.description || "",
            createdAt: data.createdAt || Timestamp.now(),
          } as Update;
        });
        callback(updates);
      },
      (error) => {
        console.error("Error in updates listener:", error);
      }
    );
  },
};
