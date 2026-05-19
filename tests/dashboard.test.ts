import { describe, expect, it } from "vitest";

import type { ContentIndexItem } from "../src/lib/content-index";
import {
  buildAiAskPreview,
  buildProjectEvidenceCards,
  buildSkillEvidenceMap,
  getActionCards,
} from "../src/lib/dashboard";

const items = [
  {
    date: "2026-05-18",
    excerpt: "Static bilingual architecture with Docker delivery.",
    key: "projects:reno-blog",
    language: "en",
    relationKeys: ["notes:cicd-baseline"],
    section: "projects",
    slug: "reno-blog",
    summary: "A static, bilingual, content-first personal site.",
    tags: ["astro", "docker", "personal-site"],
    techStack: ["Astro", "TypeScript", "Docker"],
    title: "Reno Blog",
    updated: "2026-05-19",
    url: "/en/projects/reno-blog/",
  },
  {
    date: "2026-05-18",
    excerpt: "Make tests, builds, Docker, and remote Actions work first.",
    key: "notes:cicd-baseline",
    language: "en",
    relationKeys: [],
    section: "notes",
    slug: "cicd-baseline",
    summary: "Make tests, builds, Docker, and remote Actions work first.",
    tags: ["cicd", "docker"],
    techStack: [],
    title: "CI/CD Baseline",
    updated: undefined,
    url: "/en/notes/cicd-baseline/",
  },
  {
    date: "2026-05-18",
    excerpt: "A first record of v1 boundaries.",
    key: "writing:site-launch",
    language: "en",
    relationKeys: [],
    section: "writing",
    slug: "site-launch",
    summary: "A first record of the v1 boundaries.",
    tags: ["personal-site", "astro"],
    techStack: [],
    title: "Reno Blog Launch Notes",
    updated: undefined,
    url: "/en/writing/site-launch/",
  },
] satisfies ContentIndexItem[];

describe("personal dashboard data", () => {
  it("builds project evidence cards around outcomes and verification links", () => {
    const [card] = buildProjectEvidenceCards(items, "en");

    expect(card.title).toBe("Reno Blog");
    expect(card.outcome).toContain("static, bilingual");
    expect(card.verification.map((item) => item.label)).toContain("CI/CD baseline");
    expect(card.evidenceLinks.map((item) => item.url)).toContain("/en/notes/cicd-baseline/");
  });

  it("derives skills from tech stacks, tags, and related content evidence", () => {
    const skills = buildSkillEvidenceMap(items, "en");
    const docker = skills.find((skill) => skill.name === "Docker");

    expect(docker?.evidenceCount).toBe(2);
    expect(docker?.evidence.map((item) => item.url)).toEqual([
      "/en/projects/reno-blog/",
      "/en/notes/cicd-baseline/",
    ]);
  });

  it("keeps action cards bilingual and free of empty resume links", () => {
    const cards = getActionCards("zh");

    expect(cards.map((card) => card.kind)).toEqual(["email", "github", "now"]);
    expect(cards.every((card) => card.title.length > 0)).toBe(true);
    expect(cards.some((card) => card.kind === "resume")).toBe(false);
  });

  it("summarizes static index scope for the AI Ask entry", () => {
    const preview = buildAiAskPreview(items, "en");

    expect(preview.title).toBe("Ask the static index");
    expect(preview.sections).toEqual([
      { count: 1, label: "Writing", section: "writing" },
      { count: 1, label: "Notes", section: "notes" },
      { count: 1, label: "Projects", section: "projects" },
    ]);
    expect(preview.providerBoundary).toContain("No AI provider");
  });
});
