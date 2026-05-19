import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getMotionInitScript } from "../src/lib/motion";

const baseLayout = readFileSync("src/layouts/base-layout.astro", "utf8");
const globalCss = readFileSync("src/styles/global.css", "utf8");

describe("motion system", () => {
  it("enables Astro client routing with slide and fade route transitions", () => {
    expect(baseLayout).toContain('ClientRouter');
    expect(baseLayout).toContain('from "astro:transitions"');
    expect(baseLayout).toContain("<ClientRouter />");
    expect(baseLayout).toContain('transition:animate="fade"');
    expect(baseLayout).toContain('transition:animate="slide"');
  });

  it("defines shared motion primitives with a reduced-motion escape hatch", () => {
    expect(globalCss).toContain("--motion-duration-fast");
    expect(globalCss).toContain("--motion-ease-emphasized");
    expect(globalCss).toContain("[data-motion-stagger]");
    expect(globalCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalCss).toContain("::view-transition-old");
  });

  it("uses WAAPI entrance motion only when reduced motion is not requested", () => {
    const script = getMotionInitScript();

    expect(script).toContain("IntersectionObserver");
    expect(script).toContain(".animate(");
    expect(script).toContain("prefers-reduced-motion: reduce");
    expect(script).toContain("data-motion-stagger");
  });
});
