export function getRobotsTxt(siteUrl: string): string {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");

  return [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${normalizedSiteUrl}/sitemap-index.xml`,
    "",
  ].join("\n");
}
