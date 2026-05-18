import { describe, expect, it } from "vitest";

import {
  getContentSlug,
  getEntryForLanguageAndSlug,
  getPublishedEntriesForLanguage,
  type LocalizedContentEntry,
} from "../src/lib/content";

describe("content lists", () => {
  it("normalizes language-specific content ids into stable slugs", () => {
    expect(getContentSlug("reno-blog.en")).toBe("reno-blog");
    expect(getContentSlug("reno-blog.zh.mdx")).toBe("reno-blog");
  });

  it("returns published entries for the requested language in newest-first order", () => {
    const entries = [
      {
        slug: "older",
        data: {
          date: new Date("2026-01-01"),
          language: "en",
          status: "published",
        },
      },
      {
        slug: "draft",
        data: {
          date: new Date("2026-03-01"),
          language: "en",
          status: "draft",
        },
      },
      {
        slug: "newer",
        data: {
          date: new Date("2026-02-01"),
          language: "en",
          status: "published",
        },
      },
      {
        slug: "zh-entry",
        data: {
          date: new Date("2026-04-01"),
          language: "zh",
          status: "published",
        },
      },
    ] satisfies LocalizedContentEntry[];

    expect(getPublishedEntriesForLanguage(entries, "en").map((entry) => entry.slug)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("finds a published entry by language and translation key", () => {
    const entries = [
      {
        slug: "draft",
        data: {
          date: new Date("2026-01-01"),
          language: "en",
          status: "draft",
          translationKey: "draft",
        },
      },
      {
        slug: "site-launch",
        data: {
          date: new Date("2026-01-02"),
          language: "en",
          status: "published",
          translationKey: "site-launch",
        },
      },
    ] satisfies Array<
      LocalizedContentEntry & { data: LocalizedContentEntry["data"] & { translationKey: string } }
    >;

    expect(getEntryForLanguageAndSlug(entries, "en", "site-launch")?.slug).toBe(
      "site-launch",
    );
    expect(getEntryForLanguageAndSlug(entries, "en", "draft")).toBeUndefined();
  });
});
