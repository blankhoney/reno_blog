import { describe, expect, it } from "vitest";

import { findMissingPublishedTranslationPairs } from "../src/lib/content-pairs";

describe("bilingual content pairs", () => {
  it("requires published entries to have both Chinese and English versions", () => {
    const missing = findMissingPublishedTranslationPairs([
      {
        id: "site-launch.zh.mdx",
        data: {
          language: "zh",
          status: "published",
          translationKey: "site-launch",
        },
      },
      {
        id: "site-launch.en.mdx",
        data: {
          language: "en",
          status: "published",
          translationKey: "site-launch",
        },
      },
      {
        id: "only-chinese.zh.mdx",
        data: {
          language: "zh",
          status: "published",
          translationKey: "only-chinese",
        },
      },
    ]);

    expect(missing).toEqual([
      {
        existingLanguage: "zh",
        missingLanguage: "en",
        translationKey: "only-chinese",
      },
    ]);
  });

  it("allows draft entries to exist before translation is complete", () => {
    const missing = findMissingPublishedTranslationPairs([
      {
        id: "draft-note.zh.mdx",
        data: {
          language: "zh",
          status: "draft",
          translationKey: "draft-note",
        },
      },
    ]);

    expect(missing).toEqual([]);
  });
});
