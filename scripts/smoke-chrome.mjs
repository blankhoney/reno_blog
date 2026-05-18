import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4321";
const headless = process.env.SMOKE_HEADED !== "1";

const browser = await chromium.launch({ channel: "chrome", headless });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

try {
  await page.goto(`${baseUrl}/zh/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "内容优先的个人实验室" }).waitFor();
  await page.getByRole("navigation", { name: "主导航" }).waitFor();

  await page.getByRole("link", { exact: true, name: "EN" }).click();
  await page.waitForURL("**/en/");
  await page.getByRole("heading", { name: "A content-first personal lab" }).waitFor();
  await page.getByRole("navigation", { name: "Main navigation" }).waitFor();

  await page.getByRole("link", { name: "Projects" }).click();
  await page.waitForURL("**/en/projects/");
  await page.getByRole("heading", { name: "Projects" }).waitFor();
  await page.getByRole("heading", { name: "Reno Blog" }).waitFor();
  await page.locator(".content-card a").first().click();
  await page.waitForURL("**/en/projects/reno-blog/");
  await page.getByRole("heading", { name: "Reno Blog" }).waitFor();
} finally {
  await browser.close();
}
