import { describe, expect, it } from "vitest";

import { buildContentIndex } from "../src/lib/content-index";

describe("content index", () => {
  it("publishes only public metadata for published entries", () => {
    const index = buildContentIndex([
      {
        section: "writing",
        entries: [
          {
            data: {
              date: new Date("2026-05-01"),
              language: "zh",
              status: "draft",
              summary: "Hidden draft",
              tags: ["private"],
              title: "Draft",
              translationKey: "draft",
            },
          },
          {
            data: {
              date: new Date("2026-05-02"),
              language: "zh",
              status: "published",
              summary: "公开摘要",
              tags: ["site"],
              title: "站点上线",
              translationKey: "site-launch",
              updated: new Date("2026-05-04"),
            },
            body: "这是一段用于未来问答索引的公开正文。",
          },
        ],
      },
      {
        section: "projects",
        entries: [
          {
            data: {
              date: new Date("2026-05-03"),
              language: "en",
              name: "Reno Blog",
              status: "published",
              summary: "Public project",
              tags: ["astro"],
              techStack: ["Astro"],
              translationKey: "reno-blog",
              related: ["writing:site-launch"],
            },
            body: "Project body for static AI indexing.",
          },
        ],
      },
    ]);

    expect(index).toEqual([
      {
        date: "2026-05-03",
        excerpt: "Project body for static AI indexing.",
        key: "projects:reno-blog",
        language: "en",
        relationKeys: ["writing:site-launch"],
        section: "projects",
        slug: "reno-blog",
        summary: "Public project",
        tags: ["astro"],
        techStack: ["Astro"],
        title: "Reno Blog",
        updated: undefined,
        url: "/en/projects/reno-blog/",
      },
      {
        date: "2026-05-02",
        excerpt: "这是一段用于未来问答索引的公开正文。",
        key: "writing:site-launch",
        language: "zh",
        relationKeys: [],
        section: "writing",
        slug: "site-launch",
        summary: "公开摘要",
        tags: ["site"],
        techStack: [],
        title: "站点上线",
        updated: "2026-05-04",
        url: "/zh/writing/site-launch/",
      },
    ]);
  });
});
