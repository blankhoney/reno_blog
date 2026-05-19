import { describe, expect, it } from "vitest";

import {
  LIBRARY_SURFACES,
  getLibraryItemsForSurface,
  getLibrarySurfaceGroups,
} from "../src/lib/library";
import { SUPPORTED_LANGUAGES } from "../src/lib/i18n";

describe("library hub data", () => {
  it("groups every inventory surface for both languages", () => {
    for (const language of SUPPORTED_LANGUAGES) {
      const groups = getLibrarySurfaceGroups(language);

      expect(groups.map((group) => group.id)).toEqual(LIBRARY_SURFACES);
      for (const group of groups) {
        expect(group.items.length).toBeGreaterThanOrEqual(3);
        expect(group.items.length).toBeLessThanOrEqual(5);
        expect(group.items.every((item) => item.language === language)).toBe(true);
        expect(group.items.every((item) => item.demo)).toBe(true);
        expect(group.items.every((item) => item.status === "published")).toBe(true);
      }
    }
  });

  it("exposes Now as an independent bilingual surface source", () => {
    expect(getLibraryItemsForSurface("zh", "now").map((item) => item.surface)).toEqual([
      "now",
      "now",
      "now",
    ]);
    expect(getLibraryItemsForSurface("en", "now").map((item) => item.title)).toContain(
      "Q&A preparation",
    );
  });
});
