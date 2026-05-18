import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { PNG } from "pngjs";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4321";
const browserName = process.env.SMOKE_BROWSER ?? "chrome";
const headless = process.env.SMOKE_HEADED !== "1";
const screenshotDir = process.env.SMOKE_SCREENSHOT_DIR;
const launchOptions =
  browserName === "chromium" ? { headless } : { channel: "chrome", headless };

const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

async function assertElementHasPixelVariance(locator, label) {
  const png = PNG.sync.read(await locator.screenshot());
  const colors = new Set();

  for (let index = 0; index < png.data.length; index += 64) {
    const alpha = png.data[index + 3];
    if (alpha > 0) {
      colors.add(
        `${png.data[index] >> 4}:${png.data[index + 1] >> 4}:${png.data[index + 2] >> 4}`,
      );
    }
  }

  if (colors.size < 4) {
    throw new Error(`${label} appears blank or too uniform`);
  }
}

try {
  await page.goto(`${baseUrl}/zh/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "内容优先的个人实验室" }).waitFor();
  await page.getByRole("navigation", { name: "主导航" }).waitFor();

  await page.getByRole("link", { exact: true, name: "EN" }).click();
  await page.waitForURL("**/en/");
  await page.getByRole("heading", { name: "A content-first personal lab" }).waitFor();
  await page.getByRole("navigation", { name: "Main navigation" }).waitFor();
  await page.getByRole("group", { name: "Theme" }).getByRole("button", { name: "Dark" }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");

  const storedTheme = await page.evaluate(() => window.localStorage.getItem("reno-blog-theme"));
  if (storedTheme !== "dark") {
    throw new Error(`Expected dark theme preference, received ${storedTheme}`);
  }

  await page.getByRole("group", { name: "Theme" }).getByRole("button", { name: "Auto" }).click();
  await page.waitForFunction(
    () => document.documentElement.dataset.themePreference === "system",
  );

  await page.getByRole("link", { name: "Projects" }).click();
  await page.waitForURL("**/en/projects/");
  await page.getByRole("heading", { name: "Projects" }).waitFor();
  await page.getByRole("heading", { name: "Reno Blog" }).waitFor();
  await page.locator(".content-card a").first().click();
  await page.waitForURL("**/en/projects/reno-blog/");
  await page.getByRole("heading", { exact: true, name: "Reno Blog" }).waitFor();
  await page.getByRole("link", { name: "Back to Projects" }).click();
  await page.waitForURL("**/en/projects/");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/zh/`, { waitUntil: "networkidle" });
  await page.getByRole("group", { name: "主题" }).waitFor();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (hasHorizontalOverflow) {
    throw new Error("Mobile viewport has horizontal overflow");
  }

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${baseUrl}/en/search/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { exact: true, name: "Search" }).waitFor();
  await page.getByRole("searchbox", { name: "Search public content" }).fill("docker");
  await page.getByRole("heading", { name: "CI/CD Baseline" }).waitFor();

  await page.goto(`${baseUrl}/en/library/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Library" }).waitFor();
  await page.getByRole("heading", { name: "Uses" }).waitFor();
  await page.getByRole("heading", { name: "Bookmarks" }).waitFor();

  await page.goto(`${baseUrl}/en/playground/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "ProjectOrbit" }).waitFor();
  const orbit = page.locator("[data-project-orbit]");
  await orbit.scrollIntoViewIfNeeded();
  const orbitCanvas = page.locator("[data-project-orbit] canvas").first();
  await orbitCanvas.waitFor({ state: "visible", timeout: 15000 });
  await assertElementHasPixelVariance(orbitCanvas, "ProjectOrbit canvas");
  if (screenshotDir) {
    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ fullPage: true, path: `${screenshotDir}/project-orbit-desktop.png` });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/zh/playground/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "ProjectOrbit" }).waitFor();
  await page.getByRole("link", { name: /Reno Blog/ }).first().waitFor();
  if (screenshotDir) {
    await page.screenshot({ fullPage: true, path: `${screenshotDir}/project-orbit-mobile.png` });
  }

  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (mobileOverflow) {
    throw new Error("ProjectOrbit mobile fallback has horizontal overflow");
  }
} finally {
  await browser.close();
}
