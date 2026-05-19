import { describe, expect, it } from "vitest";

import {
  THEME_STORAGE_KEY,
  getThemeOptions,
  getThemeInitScript,
  normalizeThemePreference,
} from "../src/lib/theme";

describe("theme preference", () => {
  it("keeps a stable storage boundary and accepts only supported preferences", () => {
    expect(THEME_STORAGE_KEY).toBe("reno-blog-theme");
    expect(normalizeThemePreference("system")).toBe("system");
    expect(normalizeThemePreference("light")).toBe("light");
    expect(normalizeThemePreference("dark")).toBe("dark");
    expect(normalizeThemePreference("sepia")).toBe("system");
    expect(normalizeThemePreference(null)).toBe("system");
  });

  it("returns localized labels for the theme control", () => {
    expect(getThemeOptions("zh").map((option) => option.label)).toEqual([
      "系统",
      "浅色",
      "深色",
    ]);

    expect(getThemeOptions("en").map((option) => option.label)).toEqual([
      "Auto",
      "Light",
      "Dark",
    ]);
  });

  it("prepares theme state for Astro client-side document swaps", () => {
    const script = getThemeInitScript();

    expect(script).toContain("astro:before-swap");
    expect(script).toContain("astro:after-swap");
    expect(script).toContain("applyThemeToDocument(event.newDocument");
    expect(script).toContain("targetDocument.documentElement.dataset.theme");
    expect(script).toContain("applyTheme(readPreference())");
  });
});
