import { describe, expect, it } from "vitest";

import { getSectionNavigation } from "../src/lib/sections";

describe("section navigation", () => {
  it("returns stable bilingual return links for content detail pages", () => {
    expect(getSectionNavigation("zh", "writing")).toEqual({
      href: "/zh/writing/",
      label: "写作",
      returnLabel: "返回写作",
    });

    expect(getSectionNavigation("en", "projects")).toEqual({
      href: "/en/projects/",
      label: "Projects",
      returnLabel: "Back to Projects",
    });
  });
});
