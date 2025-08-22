// src/services/blogService.ts
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function uploadImages(files: File[]) {
  const folder = `drafts/${Date.now()}`;
  const results: { url: string; path: string; name: string }[] = [];

  for (const f of files) {
    const path = `${folder}/${crypto.randomUUID()}-${f.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, f);
    const url = await getDownloadURL(storageRef);
    results.push({ url, path, name: f.name });
  }
  return results;
}

export type StoryRecord = {
  title: string;
  summary: string;
  bodyHtml: string;
  tags: string[];
  category: string;
  readingMinutes: number;
  images: { url: string; alt?: string }[];
  author?: string;
  createdAt?: any; // serverTimestamp
  views: number;
  likes: number;
};

export async function saveStory(story: Omit<StoryRecord, "views" | "likes">) {
  const docRef = await addDoc(collection(db, "stories"), {
    ...story,
    createdAt: serverTimestamp(),
    views: 0,
    likes: 0,
  });
  return docRef.id;
}
