import { describe, expect, it } from "vitest";

import { buildDraftPair } from "../scripts/content-drafts.mjs";

describe("content draft helper", () => {
  it("creates a bilingual draft pair without publishing generated content", () => {
    const drafts = buildDraftPair({
      collection: "notes",
      slug: "reader-shell-notes",
      title: {
        zh: "Reader Shell 记录",
        en: "Reader Shell Notes",
      },
      summary: {
        zh: "用于验证双语草稿生成。",
        en: "Used to verify bilingual draft generation.",
      },
      tags: ["reader-shell", "demo"],
      date: "2026-05-19",
    });

    expect(drafts.map((draft) => draft.path)).toEqual([
      "src/content/notes/reader-shell-notes.zh.mdx",
      "src/content/notes/reader-shell-notes.en.mdx",
    ]);
    expect(drafts.every((draft) => draft.frontmatter.status === "draft")).toBe(true);
    expect(drafts.map((draft) => draft.frontmatter.language)).toEqual(["zh", "en"]);
    expect(new Set(drafts.map((draft) => draft.frontmatter.translationKey))).toEqual(
      new Set(["reader-shell-notes"]),
    );
    expect(drafts.every((draft) => draft.body.includes("Seed draft"))).toBe(true);
  });
});

