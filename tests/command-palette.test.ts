import { describe, expect, it } from "vitest";

import type { ContentIndexItem } from "../src/lib/content-index";
import { buildCommandPaletteItems } from "../src/lib/command-palette";

const items = [
  {
    date: "2026-05-18",
    excerpt: "Static bilingual architecture.",
    key: "projects:reno-blog",
    language: "en",
    relationKeys: [],
    section: "projects",
    slug: "reno-blog",
    summary: "A static, bilingual, content-first personal site.",
    tags: ["astro"],
    techStack: ["Astro"],
    title: "Reno Blog",
    updated: undefined,
    url: "/en/projects/reno-blog/",
  },
] satisfies ContentIndexItem[];

describe("command palette data", () => {
  it("builds bilingual commands from static navigation, actions, and content index", () => {
    const commands = buildCommandPaletteItems("en", items);

    expect(commands.map((command) => command.id)).toContain("nav:now");
    expect(commands.map((command) => command.id)).toContain("action:copy-email");
    expect(commands.map((command) => command.id)).toContain("action:github");
    expect(commands.map((command) => command.id)).toContain("ai:ask-entry");
    expect(commands.map((command) => command.id)).toContain("content:projects:reno-blog");
    expect(commands.find((command) => command.id === "action:copy-email")?.action).toBe("copy");
    expect(commands.find((command) => command.id === "ai:ask-entry")?.href).toBe(
      "/en/search/#ask",
    );
  });

  it("localizes safe action labels", () => {
    const commands = buildCommandPaletteItems("zh", []);

    expect(commands.find((command) => command.id === "action:copy-email")?.label).toBe(
      "复制邮箱",
    );
    expect(commands.find((command) => command.id === "nav:now")?.href).toBe("/zh/now/");
  });
});
