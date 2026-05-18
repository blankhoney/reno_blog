import axe from "axe-core";
import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4321";
const browserName = process.env.A11Y_BROWSER ?? "chrome";
const seriousImpacts = new Set(["serious", "critical"]);
const paths = [
  "/zh/",
  "/en/",
  "/zh/library/",
  "/en/playground/",
  "/zh/search/",
  "/en/projects/reno-blog/",
];

const browser = await chromium.launch(
  browserName === "chromium" ? { headless: true } : { channel: "chrome", headless: true },
);
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const failures = [];

try {
  for (const path of paths) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axe.source });

    const results = await page.evaluate(async () => {
      return window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa"],
        },
      });
    });

    const seriousViolations = results.violations.filter((violation) =>
      seriousImpacts.has(violation.impact),
    );

    for (const violation of seriousViolations) {
      failures.push(
        `${path} [${violation.impact}] ${violation.id}: ${violation.nodes
          .map((node) => node.target.join(" "))
          .join(", ")}`,
      );
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  throw new Error(`Accessibility smoke failed:\n${failures.join("\n")}`);
}

console.log(`Accessibility smoke passed for ${paths.length} pages.`);
