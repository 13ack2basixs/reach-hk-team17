// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
// Use the SAME region you deployed to
export const functions = getFunctions(app, "us-central1");

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log("🔍 Testing Firebase connection...");
    console.log("📁 Project ID:", firebaseConfig.projectId);
    console.log("🌍 Region: us-central1");
    
    // Try to access Firestore
    const { collection, doc, getDoc } = await import('firebase/firestore');
    const testDoc = await getDoc(doc(collection(db, 'test'), 'connection-test'));
    console.log("✅ Firebase connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    return false;
  }
};

export async function callGenerateBlog(data: { prompt: string; imageUrls: string[] }) {
  const fn = httpsCallable(functions, "generateBlog");
  const res = await fn(data);
  return res.data as {
    success: boolean;
    blog?: {
      title: string;
      summary: string;
      bodyHtml: string;
      tags: string[];
      category: string;
      readingMinutes: number;
    };
    error?: string;
  };
}
