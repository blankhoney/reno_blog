import { describe, expect, it } from "vitest";

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLocalizedPath,
  getNavigation,
  isSupportedLanguage,
} from "../src/lib/i18n";

describe("i18n routing", () => {
  it("uses explicit Chinese and English language routes", () => {
    expect(DEFAULT_LANGUAGE).toBe("zh");
    expect(SUPPORTED_LANGUAGES).toEqual(["zh", "en"]);
    expect(isSupportedLanguage("zh")).toBe(true);
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("fr")).toBe(false);
  });

  it("builds stable localized paths", () => {
    expect(getLocalizedPath("zh", "/")).toBe("/zh/");
    expect(getLocalizedPath("en", "/writing")).toBe("/en/writing/");
    expect(getLocalizedPath("zh", "projects/reno-blog")).toBe(
      "/zh/projects/reno-blog/",
    );
  });

  it("returns bilingual navigation labels", () => {
    expect(getNavigation("zh").map((item) => item.label)).toEqual([
      "写作",
      "笔记",
      "项目",
      "关于",
      "实验室",
    ]);

    expect(getNavigation("en").map((item) => item.label)).toEqual([
      "Writing",
      "Notes",
      "Projects",
      "About",
      "Playground",
    ]);
  });
});
