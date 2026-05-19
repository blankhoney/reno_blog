import { describe, expect, it } from "vitest";

import { buildTimelineGroups, getTimelineTags } from "../src/lib/timeline";

const entries = [
  {
    slug: "newer",
    data: {
      date: new Date("2026-05-18"),
      language: "en",
      status: "published",
      summary: "Newer item",
      tags: ["astro", "site"],
      title: "Newer",
    },
  },
  {
    slug: "older",
    data: {
      date: new Date("2025-12-01"),
      language: "en",
      status: "published",
      summary: "Older item",
      tags: ["docker"],
      title: "Older",
    },
  },
];

describe("timeline discovery", () => {
  it("groups entries by year while preserving newest-first item order", () => {
    expect(buildTimelineGroups(entries).map((group) => group.year)).toEqual(["2026", "2025"]);
    expect(buildTimelineGroups(entries)[0]?.items.map((item) => item.slug)).toEqual(["newer"]);
  });

  it("returns a stable sorted tag list for static filters", () => {
    expect(getTimelineTags(entries)).toEqual(["astro", "docker", "site"]);
  });
});
