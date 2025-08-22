import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

/** Heuristic formatter:
 * - If body already contains HTML tags, return as-is.
 * - Promote short “title-ish” lines (no ending punctuation) to <h3>.
 * - Convert bullets (-/*) to <ul><li>.
 * - Wrap other lines/paragraph chunks in <p>.
 */
function coerceToHtml(raw: string): string {
  const s = (raw || "").trim();
  if (!s) return "";

  // Already HTML?
  if (/<(p|h\d|ul|ol|li|br)\b/i.test(s)) return s;

  const src = s.replace(/\r\n/g, "\n");
  const lines = src.split("\n");

  const out: string[] = [];
  let listOpen = false;
  const closeList = () => {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  };

  const isBullet = (line: string) => /^[-*]\s+/.test(line);
  const isTitleish = (line: string) => {
    // Short-ish, no terminal punctuation, contains letters,
    // not obviously a sentence.
    const trimmed = line.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > 80) return false;
    if (/[.?!:]$/.test(trimmed)) return false;
    if (!/[A-Za-z]/.test(trimmed)) return false;
    // Looks like Title Case or Capitalized Words helps indicate heading
    const words = trimmed.split(/\s+/);
    const capWords = words.filter(w => /^[A-Z]/.test(w));
    return capWords.length >= Math.max(2, Math.ceil(words.length * 0.6));
  };

  // Group consecutive non-empty non-bullet lines into paragraphs,
  // but if a line is "titleish", emit <h3> and start a new paragraph group.
  let paraBuf: string[] = [];
  const flushPara = () => {
    if (paraBuf.length) {
      out.push(`<p>${paraBuf.join(" ")}</p>`);
      paraBuf = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) {
      // Blank line => paragraph break
      closeList();
      flushPara();
      continue;
    }

    // Bullets
    if (isBullet(line)) {
      flushPara();
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${line.replace(/^[-*]\s+/, "").trim()}</li>`);
      continue;
    }

    // Title-ish line => heading
    if (isTitleish(line)) {
      closeList();
      flushPara();
      out.push(`<h3>${line}</h3>`);
      continue;
    }

    // Otherwise, accumulate into paragraph
    closeList();
    paraBuf.push(line);
  }

  closeList();
  flushPara();

  return out.length ? out.join("\n") : `<p>${s}</p>`;
}

/**
 * Callable: generateBlog
 * data = { prompt: string, imageUrls?: string[] }
 * returns { success, blog?: { title, summary, bodyHtml, category, tags, readingMinutes }, error? }
 */
export const generateBlog = onCall(
  { cors: true, region: "us-central1", secrets: [OPENAI_API_KEY] },
  async (request) => {
    try {
      const { prompt, imageUrls } = (request.data || {}) as {
        prompt?: string;
        imageUrls?: string[];
      };
      if (!prompt || typeof prompt !== "string") {
        return { success: false, error: "Missing prompt" };
      }

      const openai = new OpenAI({ apiKey: OPENAI_API_KEY.value() });

      const system =
        [
          "You are a warm, hopeful storyteller for an education charity.",
          "Return STRICT JSON ONLY (no code fences/markdown).",
          "JSON keys:",
          '{ "title":string(<=80), "summary":string(1–2 sentences),',
          '  "bodyHtml":string(VALID HTML using <h3>, <p>, optional <ul><li>),',
          '  "category":"Student Stories"|"Program Updates"|"Community"|"Success Stories",',
          '  "tags":string[], "readingMinutes": integer 3..8 }',
        ].join("\n");

      const userParts: any[] = [
        {
          type: "text",
          text:
            `Create a donor‑friendly blog post from this description.\n\n` +
            `PROMPT: ${prompt}\n\n` +
            `Output exactly the JSON as specified above.`,
        },
      ];

      if (Array.isArray(imageUrls)) {
        for (const url of imageUrls.slice(0, 4)) {
          userParts.push({ type: "image_url", image_url: { url } });
        }
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userParts as any },
        ],
        response_format: { type: "json_object" },
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);

      const allowedCategories = [
        "Student Stories",
        "Program Updates",
        "Community",
        "Success Stories",
      ] as const;

      // Coerce + sanitize
      const bodyHtml = coerceToHtml(String(parsed.bodyHtml || ""));

      const blog = {
        title: String(parsed.title || "Untitled").slice(0, 80),
        summary: String(parsed.summary || ""),
        bodyHtml,
        category: allowedCategories.includes(parsed.category)
          ? parsed.category
          : "Student Stories",
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.slice(0, 6).map((t: any) => String(t))
          : [],
        readingMinutes:
          Number.isFinite(parsed.readingMinutes) &&
          parsed.readingMinutes >= 3 &&
          parsed.readingMinutes <= 8
            ? Math.round(parsed.readingMinutes)
            : 5,
      };

      return { success: true, blog };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e?.message || "Generation failed" };
    }
  }
);
