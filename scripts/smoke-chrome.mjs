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
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { width: 1440, height: 960 },
});
const page = await context.newPage();

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
  await page.getByRole("heading", { exact: true, level: 1, name: "Reno Blog" }).waitFor();
  await page.getByText("项目证据").first().waitFor();
  await page.getByRole("navigation", { name: "主导航" }).waitFor();
  const dashboardCanvas = page.locator("[data-dashboard-canvas]");
  await dashboardCanvas.waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(500);
  await assertElementHasPixelVariance(dashboardCanvas, "Dashboard background canvas");
  if (screenshotDir) {
    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ fullPage: true, path: `${screenshotDir}/home-dashboard-desktop.png` });
  }

  await page.getByRole("link", { exact: true, name: "EN" }).click();
  await page.waitForURL("**/en/");
  await page.getByRole("heading", { exact: true, level: 1, name: "Reno Blog" }).waitFor();
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

  await page.keyboard.press("Control+K");
  await page.getByRole("dialog", { name: "Command palette" }).waitFor();
  await page.waitForFunction(() => document.activeElement?.matches("[data-command-input]"));
  await page.keyboard.press("Shift+Tab");
  const focusStayedInPalette = await page.evaluate(() => {
    const palette = document.querySelector("[data-command-palette]");
    return Boolean(palette?.contains(document.activeElement));
  });
  if (!focusStayedInPalette) {
    throw new Error("Command Palette focus escaped the dialog");
  }
  await page.getByPlaceholder("Type a page, content, or action").fill("Reno");
  await page.getByRole("option", { name: /Reno Blog/ }).first().waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Command/ }).click();
  await page.getByRole("dialog", { name: "Command palette" }).waitFor();
  await page.mouse.click(8, 8);
  await page.waitForFunction(() => document.querySelector("[data-command-palette]")?.hidden);
  await page.keyboard.press("Control+K");
  await page.getByPlaceholder("Type a page, content, or action").fill("email");
  await page.getByRole("option", { name: /Copy email/ }).click();
  const copiedEmail = await page.evaluate(() => navigator.clipboard.readText());
  if (copiedEmail !== "hello@blankhoney.xyz") {
    throw new Error(`Expected copied email, received ${copiedEmail}`);
  }
  await page.keyboard.press("Control+K");
  await page.getByPlaceholder("Type a page, content, or action").fill("now");
  await page.getByRole("option", { name: /^Now/ }).click();
  await page.waitForURL("**/en/now/");
  await page.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Control+K");
  await page.getByPlaceholder("Type a page, content, or action").fill("CI/CD");
  await page.getByRole("option", { name: /CI\/CD Baseline/ }).click();
  await page.waitForURL("**/en/notes/cicd-baseline/");
  await page.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });

  await page.getByRole("link", { exact: true, name: "Projects" }).click();
  await page.waitForURL("**/en/projects/");
  await page.getByRole("heading", { name: "Projects" }).waitFor();
  await page.getByRole("heading", { name: "Reno Blog" }).waitFor();
  await page.locator("dt", { hasText: "CI/CD baseline" }).first().waitFor();
  await page.locator(".evidence-card .text-link").first().click();
  await page.waitForURL("**/en/projects/reno-blog/");
  await page.getByRole("heading", { exact: true, name: "Reno Blog" }).waitFor();
  await page.getByRole("link", { name: "Back to Projects" }).click();
  await page.waitForURL("**/en/projects/");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/zh/`, { waitUntil: "networkidle" });
  await page.getByRole("group", { name: "主题" }).waitFor();
  if (screenshotDir) {
    await page.screenshot({ fullPage: true, path: `${screenshotDir}/home-dashboard-mobile.png` });
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (hasHorizontalOverflow) {
    throw new Error("Mobile viewport has horizontal overflow");
  }

  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${baseUrl}/en/search/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { exact: true, name: "Search" }).waitFor();
  await page.getByRole("heading", { name: "Ask the static index" }).waitFor();
  await page.getByText("No AI provider").waitFor();
  await page.getByRole("searchbox", { name: "Search public content" }).fill("docker");
  await page.getByRole("heading", { name: "CI/CD Baseline" }).waitFor();

  await page.goto(`${baseUrl}/en/writing/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { exact: true, name: "Writing" }).waitFor();
  await page.getByRole("button", { name: "astro" }).click();
  await page.getByRole("heading", { name: "Reno Blog Launch Notes" }).waitFor();

  await page.goto(`${baseUrl}/en/notes/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { exact: true, name: "Notes" }).waitFor();
  await page.getByRole("button", { name: "docker" }).click();
  await page.getByRole("heading", { name: "CI/CD Baseline" }).waitFor();

  await page.goto(`${baseUrl}/en/now/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { exact: true, name: "Now" }).waitFor();
  await page.getByRole("heading", { name: "Q&A preparation" }).waitFor();

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

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { exact: true, level: 1, name: "Reno Blog" }).waitFor();
  const reducedCanvasVisible = await page.locator("[data-dashboard-canvas]").isVisible();
  if (reducedCanvasVisible) {
    throw new Error("Dashboard canvas should be hidden under reduced motion");
  }
} finally {
  await browser.close();
}
