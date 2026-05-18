import { describe, expect, it } from "vitest";

import { getRelatedContent } from "../src/lib/relations";

describe("content relations", () => {
  it("prioritizes explicit relations and then inferred shared context", () => {
    const related = getRelatedContent(
      [
        {
          key: "writing:site-launch",
          language: "en",
          section: "writing",
          slug: "site-launch",
          tags: ["astro", "personal-site"],
          title: "Launch",
        },
        {
          key: "projects:reno-blog",
          language: "en",
          related: ["notes:cicd-baseline"],
          section: "projects",
          slug: "reno-blog",
          tags: ["astro", "docker"],
          techStack: ["Astro", "Docker"],
          title: "Reno Blog",
        },
        {
          key: "notes:cicd-baseline",
          language: "en",
          section: "notes",
          slug: "cicd-baseline",
          tags: ["docker"],
          title: "CI/CD Baseline",
        },
        {
          key: "writing:zh-only",
          language: "zh",
          section: "writing",
          slug: "zh-only",
          tags: ["astro"],
          title: "中文",
        },
      ],
      "projects:reno-blog",
    );

    expect(related.map((item) => item.key)).toEqual([
      "notes:cicd-baseline",
      "writing:site-launch",
    ]);
  });
});

