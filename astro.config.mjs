import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://example.com",
  output: "static",
  integrations: [mdx(), react(), sitemap()],
});
