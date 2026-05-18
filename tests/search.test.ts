import { describe, expect, it } from "vitest";

import { filterSearchItems } from "../src/lib/search";
import type { ContentIndexItem } from "../src/lib/content-index";

const items = [
  {
    date: "2026-05-18",
    language: "zh",
    section: "notes",
    slug: "cicd-baseline",
    summary: "先让测试、构建、Docker 和远端 Actions 跑通。",
    tags: ["cicd", "docker"],
    title: "CI/CD 基线",
    url: "/zh/notes/cicd-baseline/",
  },
  {
    date: "2026-05-18",
    language: "en",
    section: "projects",
    slug: "reno-blog",
    summary: "A static, bilingual, content-first personal site.",
    tags: ["astro", "docker"],
    title: "Reno Blog",
    url: "/en/projects/reno-blog/",
  },
] satisfies ContentIndexItem[];

describe("content search", () => {
  it("filters by language and query across title summary tags and section", () => {
    expect(filterSearchItems(items, "zh", "docker").map((item) => item.url)).toEqual([
      "/zh/notes/cicd-baseline/",
    ]);

    expect(filterSearchItems(items, "en", "project").map((item) => item.url)).toEqual([
      "/en/projects/reno-blog/",
    ]);
  });

  it("returns language-specific recent items for an empty query", () => {
    expect(filterSearchItems(items, "zh", "").map((item) => item.url)).toEqual([
      "/zh/notes/cicd-baseline/",
    ]);
  });
});
