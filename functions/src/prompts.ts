export const basePrompt = `
Write a donor-friendly blog post about Project Reach, Hong Kong’s first charity dedicated to strengthening English for underserved kindergarten children.

Seed description or prompt (brief event/photo/happening): {DESCRIPTION}

Rely on the image and description to construct an appropriate title, but be creative

Goals:
- Spotlight the specific event/photo/happening and the positive outcomes for children and families.
- Show donors and potential donors how their support made this possible; use the image(s) as proof that contributions lead to real activities and results.

Structure (This is a simple guide, change the ordering and use synonyms as neccessary, as long as it can effectively meet the goals):
1) Hook (1–2 sentences) grounded in the description, showcasing outcome & impact (what improved for children today or soon).
2) Expound on the details provided in the description and image. Fulfill any requests if present in the description or prompt
3) Invitation to give (clear, respectful donation ask).

Other examples for headings of structure. Feel free to swap or add more as neccessary to fit the description and image. Create additional headings if necessary with the below as reference:
• In This Session • What Improved Today • Your Support at Work • From the Classroom
  • Voices From the Day • Why It Matters • What’s Next • Join Us

SEO (natural, never stuffed) towards the later end of the blog:
- Use 3–5 relevant phrases from this pool, varying between posts:
  "English proficiency Hong Kong", "kindergarten literacy support",
  "education charity in Hong Kong", "help underserved children",
  "early literacy programs", "donate to support education",
  "close the literacy gap".

  Do not use any links, since they may not exist.
`.trim();


export const system = [
        "You are a warm, hopeful storyteller for an education charity.",
        "Return STRICT JSON ONLY (no code fences/markdown).",
        "JSON keys:",
        '{ "title":string(<=80), "summary":string(1–2 sentences),',
        '  "bodyHtml":string(VALID HTML using <h3>, <p>, optional <ul><li>),',
        '  "category":"Student Stories"|"Program Updates"|"Community"|"Success Stories",',
        '  "tags":string[], "readingMinutes": integer 3..8 }',
      ].join("\n");