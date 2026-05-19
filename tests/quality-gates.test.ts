import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};
const astroConfig = readFileSync("astro.config.mjs", "utf8");
const ciWorkflow = readFileSync(".github/workflows/ci.yml", "utf8");

describe("quality gates", () => {
  it("exposes browser and accessibility smoke scripts", () => {
    expect(packageJson.scripts["smoke:chrome"]).toContain("smoke-chrome.mjs");
    expect(packageJson.scripts["smoke:ci"]).toContain("SMOKE_BROWSER=chromium");
    expect(packageJson.scripts["smoke:a11y"]).toContain("smoke-accessibility.mjs");
  });

  it("runs browser and accessibility smoke in CI after the static build", () => {
    expect(ciWorkflow).toContain("npx playwright install --with-deps chromium");
    expect(ciWorkflow).toContain("npm run preview -- --host 127.0.0.1 --port 4321");
    expect(ciWorkflow).toContain("npm run smoke:ci");
    expect(ciWorkflow).toContain("npm run smoke:a11y");
  });

  it("keeps heavy 3D dependencies isolated from the main route chunk", () => {
    expect(astroConfig).toContain("manualChunks");
    expect(astroConfig).toContain("three-vendor");
    expect(astroConfig).toContain("react-three-vendor");
  });
});
