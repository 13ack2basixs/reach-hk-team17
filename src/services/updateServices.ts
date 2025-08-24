import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Update {
  id?: string;
  type: "Program Update" | "Student Achievement" | "Milestone Reached";
  description: string;
  studentName?: string;
  school?: string;
  isPending?: boolean;
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  read?: boolean;
  readBy?: string[];
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

  async addPendingUpdate(
    update: Omit<Update, "id" | "createdAt" | "isPending">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, UPDATES_COLLECTION), {
        ...update,
        isPending: true,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding pending update:", error);
      throw error;
    }
  },

  // Approve pending update
  async approveUpdate(updateId: string): Promise<void> {
    try {
      const updateRef = doc(db, UPDATES_COLLECTION, updateId);
      await updateDoc(updateRef, {
        isPending: false,
        approvedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error approving update:", error);
      throw error;
    }
  },

  // Get only approved updates (for donors)
  async getApprovedUpdates(): Promise<Update[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, UPDATES_COLLECTION),
          where("isPending", "==", false),
          orderBy("createdAt", "desc")
        )
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          description: data.description || "",
          title: data.title || "",
          studentName: data.studentName || "",
          school: data.school || "",
          isPending: data.isPending || false,
          createdAt: data.createdAt,
          approvedAt: data.approvedAt,
        } as Update;
      });
    } catch (error) {
      console.error("Error fetching approved updates:", error);
      throw error;
    }
  },

  // Get all updates (pending and approved) for admin
  async getAllUpdates(): Promise<Update[]> {
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
          title: data.title || "",
          studentName: data.studentName || "",
          school: data.school || "",
          isPending: data.isPending || false,
          createdAt: data.createdAt,
          approvedAt: data.approvedAt,
        } as Update;
      });
    } catch (error) {
      console.error("Error fetching all updates:", error);
      throw error;
    }
  },

  // Subscribe to all updates (for admin)
  subscribeToAllUpdates(callback: (updates: Update[]) => void) {
    const q = query(
      collection(db, UPDATES_COLLECTION),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (querySnapshot) => {
      const updates = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          description: data.description || "",
          title: data.title || "",
          studentName: data.studentName || "",
          school: data.school || "",
          isPending: data.isPending || false,
          createdAt: data.createdAt || Timestamp.now(),
          approvedAt: data.approvedAt,
        } as Update;
      });
      callback(updates);
    });
  },

  // Subscribe to approved updates only (for donors)
  subscribeToApprovedUpdates(callback: (updates: Update[]) => void) {
    const q = query(
      collection(db, UPDATES_COLLECTION),
      where("isPending", "==", false),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (querySnapshot) => {
      const updates = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          description: data.description || "",
          title: data.title || "",
          studentName: data.studentName || "",
          school: data.school || "",
          isPending: data.isPending || false,
          createdAt: data.createdAt || Timestamp.now(),
          approvedAt: data.approvedAt,
        } as Update;
      });
      callback(updates);
    });
  },

  // Add these new functions to the updatesService object

  // Mark update as read for a specific donor
  async markUpdateAsRead(updateId: string, donorEmail: string): Promise<void> {
    try {
      const updateRef = doc(db, UPDATES_COLLECTION, updateId);

      // Get current document to check existing readBy array
      const updateSnapshot = await getDocs(
        query(
          collection(db, UPDATES_COLLECTION),
          where("__name__", "==", updateId)
        )
      );

      if (!updateSnapshot.empty) {
        const currentData = updateSnapshot.docs[0].data();
        const readBy = currentData.readBy || [];

        // Only update if donor hasn't already read it
        if (!readBy.includes(donorEmail)) {
          await updateDoc(updateRef, {
            readBy: [...readBy, donorEmail],
          });
        }
      }
    } catch (error) {
      console.error("Error marking update as read:", error);
      throw error;
    }
  },

  // Subscribe to approved updates with read status for specific donor
  subscribeToApprovedUpdatesForDonor(
    donorEmail: string,
    callback: (updates: (Update & { read: boolean })[]) => void
  ) {
    console.log(
      "🔥 Setting up Firebase listener for approved updates, donor:",
      donorEmail
    );

    const q = query(
      collection(db, UPDATES_COLLECTION),
      where("isPending", "==", false),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        console.log(
          "📡 Firebase listener triggered, documents:",
          querySnapshot.docs.length
        );
        console.log(
          "📡 Listener metadata - hasPendingWrites:",
          querySnapshot.metadata.hasPendingWrites
        );
        console.log(
          "📡 Listener metadata - fromCache:",
          querySnapshot.metadata.fromCache
        );

        const updates = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const readBy = data.readBy || [];
          const isRead = readBy.includes(donorEmail);

          return {
            id: doc.id,
            type: data.type,
            description: data.description || "",
            studentName: data.studentName || "",
            school: data.school || "",
            isPending: data.isPending || false,
            createdAt: data.createdAt || Timestamp.now(),
            approvedAt: data.approvedAt,
            read: isRead,
            readBy: readBy,
          } as Update & { read: boolean; readBy: string[] };
        });

        console.log("✅ Processed updates:", updates.length);
        callback(updates);
      },
      (error) => {
        console.error("❌ Firebase listener error:", error);
      }
    );
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
