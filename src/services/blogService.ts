// src/services/blogService.ts
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { parse, HTMLElement as HPElement, Node as HPNode } from "node-html-parser";

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
type TailwindClassMap = Partial<Record<
  | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "ul" | "ol" | "li"
  | "blockquote" | "pre" | "code"
  | "table" | "thead" | "tbody" | "tr" | "th" | "td"
  | "img" | "a" | "hr" | "br", string
>>;

const DEFAULTS: Required<TailwindClassMap> = {
  p: "mb-4 leading-relaxed",
  h1: "text-3xl font-bold mt-8 mb-4",
  h2: "text-2xl font-semibold mt-7 mb-3",
  h3: "text-xl font-semibold mt-6 mb-2",
  h4: "text-lg font-medium mt-5 mb-2",
  h5: "text-base font-medium mt-4 mb-2",
  h6: "text-sm font-semibold mt-4 mb-2 tracking-wide",
  ul: "list-disc pl-6 mb-4",
  ol: "list-decimal pl-6 mb-4",
  li: "mb-1",
  blockquote: "border-l-4 pl-4 italic text-muted-foreground my-4",
  pre: "bg-muted rounded-lg p-4 overflow-x-auto my-4",
  code: "font-mono text-sm",
  table: "w-full table-auto border-collapse my-4",
  thead: "",
  tbody: "",
  tr: "border-b",
  th: "text-left font-semibold py-2 pr-4",
  td: "py-2 pr-4 align-top",
  img: "max-w-full h-auto",
  a: "underline hover:no-underline",
  hr: "my-6 border-t",
  br: "",
};

// type guard so TS knows a node is an HPElement
function isHPElement(n: HPNode): n is HPElement {
  return (n as any).tagName !== undefined;
}

export function addTailwindClassesToHtml(html: string): string {
  if (!html?.trim()) return "";
  const classes: TailwindClassMap = { ...DEFAULTS };
  const root = parse(html, {
    lowerCaseTagName: false,
    comment: true,
    blockTextElements: { script: true, noscript: true, style: true, pre: true },
  });

  const addClasses = (el: HPElement, cls?: string) => {
    if (!cls) return;
    for (const c of cls.split(/\s+/)) {
      if (c && !el.classList.contains(c)) el.classList.add(c);
    }
  };

  // DFS without nextSibling: iterate childNodes array
  const visit = (el: HPElement) => {
    const tag = el.tagName?.toLowerCase();
    if (tag && tag !== "script" && tag !== "style") {
      addClasses(el, classes[tag as keyof TailwindClassMap]);
    }
    for (const child of el.childNodes as HPNode[]) {
      if (isHPElement(child)) visit(child);
    }
  };

  // root may be a fragment-like node; walk element children
  if (isHPElement(root as unknown as HPNode)) {
    visit(root as unknown as HPElement);
  } else {
    for (const child of (root as any).childNodes as HPNode[]) {
      if (isHPElement(child)) visit(child);
    }
  }

  return root.toString();
}