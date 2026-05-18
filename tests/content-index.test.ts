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
            },
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
              translationKey: "reno-blog",
            },
          },
        ],
      },
    ]);

    expect(index).toEqual([
      {
        date: "2026-05-03",
        language: "en",
        section: "projects",
        slug: "reno-blog",
        summary: "Public project",
        tags: ["astro"],
        title: "Reno Blog",
        url: "/en/projects/reno-blog/",
      },
      {
        date: "2026-05-02",
        language: "zh",
        section: "writing",
        slug: "site-launch",
        summary: "公开摘要",
        tags: ["site"],
        title: "站点上线",
        url: "/zh/writing/site-launch/",
      },
    ]);
  });
});
