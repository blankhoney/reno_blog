import { describe, expect, it } from "vitest";

import { buildProjectOrbitGraph } from "../src/lib/project-orbit";
import type { ContentIndexItem } from "../src/lib/content-index";

const baseItem = {
  date: "2026-05-19",
  excerpt: "",
  relationKeys: [],
  summary: "",
  tags: [],
  techStack: [],
  updated: undefined,
} satisfies Partial<ContentIndexItem>;

describe("ProjectOrbit graph", () => {
  it("builds deterministic nodes and edges from static content metadata", () => {
    const graph = buildProjectOrbitGraph(
      [
        {
          ...baseItem,
          key: "projects:reno-blog",
          language: "en",
          relationKeys: ["writing:site-launch"],
          section: "projects",
          slug: "reno-blog",
          tags: ["astro"],
          title: "Reno Blog",
          url: "/en/projects/reno-blog/",
        },
        {
          ...baseItem,
          key: "writing:site-launch",
          language: "en",
          section: "writing",
          slug: "site-launch",
          tags: ["astro"],
          title: "Launch",
          url: "/en/writing/site-launch/",
        },
        {
          ...baseItem,
          key: "notes:cicd-baseline",
          language: "zh",
          section: "notes",
          slug: "cicd-baseline",
          title: "CI/CD",
          url: "/zh/notes/cicd-baseline/",
        },
      ] satisfies ContentIndexItem[],
      "en",
    );

    expect(graph.nodes.map((node) => node.key)).toEqual([
      "projects:reno-blog",
      "writing:site-launch",
    ]);
    expect(graph.edges).toEqual([
      {
        from: "projects:reno-blog",
        to: "writing:site-launch",
        weight: 2,
      },
    ]);
    expect(graph.nodes[0].position).toEqual([0, 0, 0]);
    expect(graph.nodes[1].position[0]).toBeGreaterThan(0);
  });
});

