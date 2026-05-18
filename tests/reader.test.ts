import { describe, expect, it } from "vitest";

import {
  calculateReadingTime,
  getAdjacentReaderEntries,
  shouldShowTableOfContents,
} from "../src/lib/reader";

describe("reader shell helpers", () => {
  it("calculates at least one minute of reading time for Chinese and English content", () => {
    expect(calculateReadingTime("这是中文阅读内容。".repeat(40), "zh")).toBe(1);
    expect(calculateReadingTime("This is an English reading sample. ".repeat(80), "en")).toBe(
      2,
    );
  });

  it("shows a table of contents only when headings make it useful", () => {
    expect(
      shouldShowTableOfContents([
        { depth: 2, slug: "context", text: "Context" },
        { depth: 2, slug: "process", text: "Process" },
      ]),
    ).toBe(true);
    expect(shouldShowTableOfContents([{ depth: 2, slug: "note", text: "Note" }])).toBe(
      false,
    );
  });

  it("finds previous and next entries from the visible section order", () => {
    const adjacent = getAdjacentReaderEntries(
      [
        { slug: "newest", title: "Newest" },
        { slug: "current", title: "Current" },
        { slug: "oldest", title: "Oldest" },
      ],
      "current",
    );

    expect(adjacent.previous).toEqual({ slug: "newest", title: "Newest" });
    expect(adjacent.next).toEqual({ slug: "oldest", title: "Oldest" });
  });
});

