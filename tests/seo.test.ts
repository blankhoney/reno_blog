import { describe, expect, it } from "vitest";

import { getRobotsTxt } from "../src/lib/seo";

describe("SEO helpers", () => {
  it("generates a robots file that points crawlers to the sitemap", () => {
    expect(getRobotsTxt("https://reno.example")).toBe(
      [
        "User-agent: *",
        "Allow: /",
        "Sitemap: https://reno.example/sitemap-index.xml",
        "",
      ].join("\n"),
    );
  });
});
