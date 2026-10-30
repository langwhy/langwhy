// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";

// Unverified cards stay out of the sitemap (and carry noindex) until a human checked them.
const unverified = readdirSync("./data/languages")
  .filter((f) => f.endsWith(".yaml"))
  .map((f) => parse(readFileSync(`./data/languages/${f}`, "utf8")))
  .filter((c) => c && c.verified === false)
  .map((c) => `https://langwhy.dev/lang/${c.id}/`);

export default defineConfig({
  site: "https://langwhy.dev",
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      filter: (page) => !unverified.includes(page) && !page.endsWith("/search/") && !page.endsWith("/404/"),
    }),
  ],
});
