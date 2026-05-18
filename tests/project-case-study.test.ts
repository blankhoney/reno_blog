import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const requiredEnglishSections = [
  "## Context",
  "## Problem",
  "## Goal",
  "## Process",
  "## Architecture",
  "## Outcome",
  "## Learnings",
  "## Links",
];

const requiredChineseSections = [
  "## 背景",
  "## 问题",
  "## 目标",
  "## 过程",
  "## 架构",
  "## 结果",
  "## 学习",
  "## 链接",
];

describe("project case studies", () => {
  it("keeps the Reno Blog project in the agreed case-study shape", () => {
    const english = readFileSync("src/content/projects/reno-blog.en.mdx", "utf8");
    const chinese = readFileSync("src/content/projects/reno-blog.zh.mdx", "utf8");

    for (const heading of requiredEnglishSections) {
      expect(english).toContain(heading);
    }

    for (const heading of requiredChineseSections) {
      expect(chinese).toContain(heading);
    }

    expect(english).toContain("related:");
    expect(chinese).toContain("related:");
  });
});

